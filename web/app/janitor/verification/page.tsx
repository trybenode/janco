"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Collects janitor ID details and a camera selfie for provider-backed verification.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/ActionRow.tsx, web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts.
 * Imported or linked from: web/app/janitor/status/page.tsx, web/components/ProfileScreen.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

/* eslint-disable @next/next/no-img-element -- the camera preview is an in-memory data URL. */

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, ShieldCheck } from "lucide-react";
import { ActionRow } from "@/components/ActionRow";
import { LoadingState } from "@/components/LoadingState";
import { MobileHeader } from "@/components/MobileHeader";
import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/lib/api";

function VerificationContent() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"nin" | "bvn">("nin");
  const [number, setNumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("not_started");
  const [remaining, setRemaining] = useState(3);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const { show } = useToast();

  const stopCamera = () => { stream.current?.getTracks().forEach((track) => track.stop()); stream.current = null; setCameraActive(false); };
  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;
    void api.verificationStatus().then((result) => {
      if (!mounted) return;
      if (result.data) { setStatus(result.data.status); setRemaining(result.data.retries_left ?? 3); if (result.data.status === "verified") setStep(2); }
      else show(result.error ?? "We could not check your verification status.", "error");
      setLoading(false);
    });
    return () => { mounted = false; mountedRef.current = false; stream.current?.getTracks().forEach((track) => track.stop()); };
  }, [show]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unavailable");
      const capture = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (!mountedRef.current) { capture.getTracks().forEach((track) => track.stop()); return; }
      stream.current = capture; setCameraActive(true); setPhoto("");
      if (video.current) { video.current.srcObject = capture; await video.current.play(); }
    } catch { show("Camera access is unavailable. Allow camera access and try again in a secure browser.", "error"); }
  };
  const capture = () => {
    if (!video.current || !video.current.videoWidth) { show("The camera is still starting. Please try again.", "info"); return; }
    const canvas = document.createElement("canvas");
    const ratio = Math.min(1, 1280 / video.current.videoWidth);
    canvas.width = Math.round(video.current.videoWidth * ratio); canvas.height = Math.round(video.current.videoHeight * ratio);
    const context = canvas.getContext("2d");
    if (!context) { show("We could not capture your selfie. Please try again.", "error"); return; }
    context.drawImage(video.current, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.8)); stopCamera();
  };
  const submit = async () => {
    if (!photo || !/^\d{11}$/.test(number)) { show("Enter your 11-digit identity number and capture a selfie.", "error"); return; }
    setBusy(true);
    const result = await api.completeVerification(type, number, photo.split(",")[1] ?? "");
    setPhoto(""); setNumber("");
    if (result.data?.status === "verified") { setStatus("verified"); setStep(2); show("Identity verification complete.", "success"); }
    else { show(result.error ?? "Verification could not be completed. Please try again.", "error"); const latest = await api.verificationStatus(); if (latest.data) { setRemaining(latest.data.retries_left ?? 0); setStatus(latest.data.status); } setStep(0); }
    setBusy(false);
  };

  return <div className="shell"><SiteNav portal/><main className="mobile-canvas"><MobileHeader title="ID verification"/>
    {loading ? <LoadingState label="Checking verification…"/> : <div className="card-stack verification-content">
      <ol className="verification-steps" aria-label="Verification progress">{["ID verification", "Selfie check", "Result"].map((name, index) => <li className={index <= step ? "active" : ""} key={name}><span>{index < step ? "✓" : index + 1}</span>{name}</li>)}</ol>
      {step === 0 && <section className="card"><ShieldCheck size={24}/><h2>Identity verification</h2><p className="muted">Enter your NIN or BVN. You’ll then take a selfie to confirm your identity.</p><ActionRow count={2}><button type="button" className={`btn ${type === "nin" ? "primary" : "ghost"}`} aria-pressed={type === "nin"} onClick={() => setType("nin")}>NIN</button><button type="button" className={`btn ${type === "bvn" ? "primary" : "ghost"}`} aria-pressed={type === "bvn"} onClick={() => setType("bvn")}>BVN</button></ActionRow><div className="field verification-field"><label htmlFor="identity-number">{type.toUpperCase()} number</label><input id="identity-number" inputMode="numeric" autoComplete="off" maxLength={11} value={number} onChange={(event) => setNumber(event.target.value.replace(/\D/g, ""))}/></div><p className="muted small">Attempts remaining: {remaining}</p><ActionRow count={1}><button className="btn primary" disabled={remaining <= 0} onClick={() => { if (!/^\d{11}$/.test(number)) { show("Enter an 11-digit identity number.", "error"); return; } setStep(1); }}>Continue</button></ActionRow>{status === "id_verified" && <p className="muted small">For security, re-enter your ID number to resume verification.</p>}</section>}
      {step === 1 && <section className="card"><h2>Selfie check</h2><p className="muted">Face the camera in good lighting. Your selfie will be used to confirm your identity.</p><div className="verification-camera"><video ref={video} autoPlay playsInline muted hidden={!cameraActive}/>{photo && <img src={photo} alt="Your captured selfie"/>}{!photo && !cameraActive && <Camera size={48} aria-hidden="true"/>}</div><ActionRow count={1}>{cameraActive ? <button className="btn primary" onClick={capture}>Capture selfie</button> : <button className="btn ghost" onClick={() => void startCamera()}>{photo ? "Retake selfie" : "Open camera"}</button>}</ActionRow><ActionRow count={2}><button className="btn ghost" onClick={() => { stopCamera(); setStep(0); }}>Back</button><button className="btn primary" disabled={!photo || busy} onClick={() => void submit()}>{busy ? "Checking…" : "Verify identity"}</button></ActionRow></section>}
      {step === 2 && <section className="card verification-result"><CheckCircle2 size={48}/><h2>Identity verified</h2><p className="muted">Your identity check is complete.</p></section>}
    </div>}
  </main></div>;
}

export default function Verification() { return <RoleProtected role="janitor"><VerificationContent/></RoleProtected>; }
