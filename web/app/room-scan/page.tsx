"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /room-scan page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/types.ts.
 * Imported or linked from: web/components/LandingPage.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { ToastMessage } from "@/components/ToastProvider";
import { MobileHeader } from "@/components/MobileHeader";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, LoaderCircle, ScanLine, ShieldCheck, StopCircle } from "lucide-react";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import type { ScanResult, ScanSession } from "@/lib/types";

type CapturedFrame = { image_base64: string; width: number; height: number; orientation: "portrait" | "landscape" | "square"; captured_at: string };

function localQuality(canvas: HTMLCanvasElement): string {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "Frame ready for server review.";
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let total = 0;
  let variance = 0;
  const count = Math.max(1, Math.floor(pixels.length / 16));
  for (let index = 0; index < pixels.length; index += 16) total += (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
  const mean = total / count;
  for (let index = 0; index < pixels.length; index += 16) {
    const value = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    variance += (value - mean) ** 2;
  }
  const brightness = mean / 255;
  const spread = Math.sqrt(variance / count);
  if (brightness < 0.18) return "It looks dark. Add light before capturing the room.";
  if (brightness > 0.96) return "There is too much glare. Tilt away from direct light.";
  if (spread < 8) return "Move slowly and include walls, floor, and furniture for a useful frame.";
  return "Frame looks usable. Capture another angle for a more reliable estimate.";
}

function ScanContent() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [session, setSession] = useState<ScanSession | null>(null);
  const [frames, setFrames] = useState<CapturedFrame[]>([]);
  const [area, setArea] = useState(0);
  const [clutter, setClutter] = useState("moderate");
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Start the camera to capture up to three final room frames.");
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  const startCamera = async () => {
    setError("");
    if (!window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setError("Camera access requires HTTPS. You can still use manual measurement below."); return;
    }
    setBusy(true);
    const created = await api.createScanSession({ service_type: "house_cleaning", capture_mode: "live", client: "web" });
    if (!created.data) { setBusy(false); setError(created.error ?? "Could not start the scan session."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setSession(created.data); setCameraReady(true); setMessage("Move slowly around the room. Keep the camera steady before each capture.");
    } catch {
      await api.cancelScanSession(created.data.id);
      setError("Camera access was not granted. Use manual measurement or try again in a secure browser context.");
    } finally { setBusy(false); }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraReady) return;
    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg", 0.72);
    const orientation: CapturedFrame["orientation"] = canvas.width === canvas.height ? "square" : canvas.width > canvas.height ? "landscape" : "portrait";
    setFrames((current) => [...current, { image_base64: image, width: canvas.width, height: canvas.height, orientation, captured_at: new Date().toISOString() }].slice(-3));
    setMessage(localQuality(canvas));
  };

  const finish = async () => {
    if (!session || frames.length === 0) { setError("Capture at least one room frame before verification."); return; }
    setBusy(true); setError("");
    const verified = await api.finalizeScanSession(session.id, { consent: true, frames, manual_area_m2: area || undefined, manual_clutter_level: clutter });
    if (!verified.data) { setError(verified.error ?? "The scan could not be verified. Please retry the final capture."); setBusy(false); return; }
    setResult(verified.data); setBusy(false); streamRef.current?.getTracks().forEach((track) => track.stop()); setCameraReady(false);
    sessionStorage.setItem("janco.scan.result", JSON.stringify({ area_m2: verified.data.estimated_area, clutter_level: verified.data.clutter_level, scan_id: verified.data.scan_id }));
  };

  const useManual = () => {
    if (area <= 0) { setError("Enter an area greater than zero."); return; }
    sessionStorage.setItem("janco.scan.result", JSON.stringify({ area_m2: area, clutter_level: clutter })); router.push("/book");
  };

  return <div className="shell"><SiteNav portal/><main className="container portal-main">
    <MobileHeader title="Room scan"/>
    <section className="card" style={{ marginTop: 18 }}>
      <div className="eyebrow">AI-assisted room measurement</div><h1 className="page-title">Scan your space.</h1>
      <p className="lead">Analysis starts on this device for responsiveness. JANCO only receives the final frames you approve, then verifies the estimate on the server before it can affect a quote.</p>
      <div className="info-callout"><ShieldCheck size={22}/><div><strong>Private by design</strong><p className="small" style={{ marginBottom: 0 }}>Frames stay in memory until you approve verification. No continuous video is uploaded.</p></div></div>
      <div style={{ marginTop: 18, borderRadius: 12, overflow: "hidden", background: "#111", aspectRatio: "4 / 3", position: "relative" }}>
        <video ref={videoRef} muted playsInline aria-label="Live room camera preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraReady ? "block" : "none" }}/>
        {!cameraReady && <div style={{ color: "#fff", height: "100%", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}><Camera size={36}/></div>}
        {frames.length > 0 && <span className="status" style={{ position: "absolute", top: 12, right: 12 }}>{frames.length}/3 frames</span>}
      </div>
      <canvas ref={canvasRef} className="sr-only" aria-hidden="true" />
      <p className="muted small" role="status" style={{ marginTop: 10 }}>{message}</p>
      <div className="actions" style={{ marginTop: 12 }}>
        {!cameraReady ? <button className="btn primary" onClick={() => void startCamera()} disabled={busy}><Camera size={16}/>{busy ? "Starting…" : "Start camera"}</button> : <><button className="btn primary" onClick={capture} disabled={frames.length >= 3}><ScanLine size={16}/> Capture frame</button><button className="btn ghost" onClick={() => { streamRef.current?.getTracks().forEach((track) => track.stop()); setCameraReady(false); }}><StopCircle size={16}/> Stop</button></>}
      </div>
      <div className="form-grid" style={{ marginTop: 20 }}><div className="field"><label htmlFor="area">Optional area correction (m²)</label><input id="area" type="number" min={1} max={2000} value={area || ""} onChange={(event) => setArea(Number(event.target.value))}/></div><div className="field"><label htmlFor="clutter">Observed clutter</label><select id="clutter" value={clutter} onChange={(event) => setClutter(event.target.value)}><option value="minimal">Minimal</option><option value="moderate">Moderate</option><option value="heavy">Heavy</option><option value="extreme">Extreme</option></select></div></div>
      {frames.length > 0 && !result && <button className="btn secondary" onClick={() => void finish()} disabled={busy}>{busy ? <><LoaderCircle size={16}/> Verifying…</> : <><Check size={16}/> Verify approved frames</>}</button>}
      {result && <div className="success" role="status" style={{ marginTop: 16 }}><strong>{result.estimated_area.toFixed(1)} m² estimated · {Math.round(result.confidence * 100)}% confidence</strong><br/>{result.warnings?.join(" ") || "Server verification complete. Review the measurement in your booking."}<div style={{ marginTop: 12 }}><button className="btn primary" onClick={() => router.push("/book")}>Use this in booking</button></div></div>}
      <div className="card" style={{ marginTop: 18, background: "var(--surface-variant)", boxShadow: "none" }}><h3>Manual fallback</h3><p className="muted small">If camera access is unavailable, enter the measured area and carry it into the booking. Server validation still applies to the quote.</p><button className="btn ghost" onClick={useManual} disabled={area <= 0}>Use manual measurement</button></div>
      <ToastMessage message={error}/>
    </section>
  </main></div>;
}

export default function RoomScanPage() { return <Protected><ScanContent/></Protected>; }
