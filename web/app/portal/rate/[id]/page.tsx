"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Lets the booking customer rate a completed job after checking eligibility.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/AuthProvider.tsx, web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Protected } from "@/components/Protected";
import { useAuth } from "@/components/AuthProvider";
import { LoadingState } from "@/components/LoadingState";
import { MobileHeader } from "@/components/MobileHeader";
import { SiteNav } from "@/components/SiteNav";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/lib/api";

function RateContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { show } = useToast();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (profile?.role === "janitor") { setChecking(false); return; }
    void api.booking(id).then((result) => {
      setAllowed(Boolean(result.data && result.data.user_id === profile?.id && result.data.status === "completed"));
      if (!result.data) show(result.error ?? "We could not load this booking.", "error");
      setChecking(false);
    });
  }, [id, profile?.id, profile?.role, show]);
  const submit = async () => {
    if (!allowed || !score || busy) return;
    setBusy(true);
    const result = await api.rate(id, score, comment.trim());
    if (result.data) { show("Thank you for rating your service.", "success"); router.push(`/portal/jobs/${id}`); }
    else { show(result.error ?? "We could not submit your rating yet.", "error"); setBusy(false); }
  };
  return <div className="shell"><SiteNav portal/><main className="container portal-main"><MobileHeader title="Rate your service"/>{checking ? <LoadingState label="Checking your booking…"/> : !allowed ? <section className="card"><h2>Rating unavailable</h2><p className="muted">Only the customer who booked a completed job can rate it.</p></section> : <section className="card" style={{textAlign:"center"}}><h1 className="page-title">Rate your service</h1><p className="muted">Your feedback helps professionals build trust.</p><div style={{display:"flex",justifyContent:"center",gap:4,margin:"24px 0"}} role="radiogroup" aria-label="Service rating">{[1,2,3,4,5].map((value) => <button type="button" role="radio" aria-checked={value === score} aria-label={`${value} stars`} key={value} onClick={() => setScore(value)} style={{border:0,background:"transparent",color:value <= score ? "var(--tertiary)" : "var(--outline-variant)",padding:4}}><Star size={34} fill="currentColor"/></button>)}</div><label className="sr-only" htmlFor="comment">Comment</label><textarea id="comment" value={comment} maxLength={500} onChange={(event) => setComment(event.target.value)} placeholder="Tell us about your experience" style={{width:"100%",minHeight:120,border:"1px solid var(--outline)",borderRadius:8,padding:12,background:"var(--surface)",color:"var(--on-surface)"}}/><button className="btn primary" disabled={!score || busy} onClick={() => void submit()} style={{width:"100%",marginTop:16}}>{busy ? "Submitting…" : "Submit rating"}</button></section>}</main></div>;
}
export default function RatePage() { return <Protected><RateContent/></Protected>; }
