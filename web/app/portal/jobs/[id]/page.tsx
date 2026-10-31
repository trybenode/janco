"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Shows a booking’s progress, details, live arrival, support, and role-appropriate actions.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/ActionRow.tsx, web/components/AuthProvider.tsx, web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts; 2 more in docs/file-inventory.md.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, Phone, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { ActionRow } from "@/components/ActionRow";
import { LoadingState } from "@/components/LoadingState";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { ToastMessage } from "@/components/ToastProvider";
import { label, money } from "@/lib/catalog";
import type { Job } from "@/lib/types";

const statuses = ["pending", "confirmed", "in_progress", "completed"];

function JobContent() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [location, setLocation] = useState<{ available: boolean; latitude?: number; longitude?: number; updated_at?: string; approximate?: boolean }>({ available: false });
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const load = async () => {
      const [result, live] = await Promise.all([api.booking(id), api.jobLocation(id)]);
      if (result.data) setJob(result.data); else setError(result.error ?? "We could not load this booking. Please retry.");
      if (live.data) setLocation(live.data);
    };
    void load();
    timer = setInterval(() => void load(), 15000);
    return () => { if (timer) clearInterval(timer); };
  }, [id]);

  if (!job) return <main className="container portal-main"><MobileHeader title="Active job"/><div className="card">{error ? <div className="error" role="alert">{error}</div> : <LoadingState label="Loading active job…"/>}</div></main>;

  const index = statuses.indexOf(job.status);
  const cancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    const result = await api.cancel(id);
    if (result.data?.job) setJob(result.data.job); else setError(result.error ?? "We could not cancel this booking. Please retry.");
  };

  return <div className="shell"><SiteNav portal/><main className="container portal-main job-detail-main">
    <MobileHeader title="Active job"/>
    <div className="toolbar job-detail-heading"><div><div className="eyebrow">Active job</div><h1 className="page-title">{label(job.service_type)}</h1><p className="muted">Booking #{job.id.slice(-8).toUpperCase()}</p></div><span className={`status ${job.status}`}>{label(job.status)}</span></div>
    <div className="portal-grid job-detail-layout"><section className="job-detail-column">
      <div className="card"><h2>Progress</h2><div className="job-status-list">{statuses.map((status, statusIndex) => <div key={status} className="job-status-row" style={{ color: statusIndex <= index ? "var(--brand)" : "var(--muted)" }}><div className="avatar" style={{ background: statusIndex <= index ? "var(--lime)" : "var(--surface-variant)" }}>{statusIndex <= index ? <Check size={17}/> : statusIndex + 1}</div><div><strong>{label(status)}</strong><div className="muted small">{job.status_timestamps?.[status] ? new Date(job.status_timestamps[status]).toLocaleString("en-NG") : statusIndex === index ? "Current status" : "Next step"}</div></div></div>)}</div></div>
      <div className="card"><h2>Booking details</h2><div className="summary-row"><span>Date</span><strong>{job.scheduled_date ? new Date(job.scheduled_date).toDateString() : "Pending"}</strong></div><div className="summary-row"><span>Arrival</span><strong>{job.scheduled_time || "Pending"}</strong></div><div className="summary-row"><span>Address</span><strong>{job.address || "Pending"}</strong></div>{job.landmark && <div className="summary-row"><span>Landmark</span><strong>{job.landmark}</strong></div>}<div className="summary-row"><span>Payment</span><strong>{label(job.payment_status)}</strong></div><div className="summary-total"><span>Total</span><strong>{money(job.price)}</strong></div>{job.notes && <p className="muted small">{job.notes}</p>}</div>
      {location.available && <div className="card"><h2>Live arrival</h2><p className="muted small">Approximate location from the assigned janitor. Updated {location.updated_at ? new Date(location.updated_at).toLocaleTimeString("en-NG") : "recently"}.</p><div className="info-callout"><span aria-hidden="true">📍</span><span>{location.latitude?.toFixed(3)}, {location.longitude?.toFixed(3)}{location.approximate ? " · approximate" : ""}</span></div></div>}
    </section><aside className="job-detail-column">
      <div className="card"><h3>Your JANCO contact</h3><p className="muted">{job.status === "completed" ? "This job is complete. Previous messages remain available to read." : "Your assigned professional and support options appear here once matching is complete."}</p><ActionRow count={2}>{job.janitor_id ? <Link className="btn ghost" href={`/portal/chat/${id}`}><MessageCircle size={15}/> {job.status === "completed" ? "Chat history" : "Chat"}</Link> : <button className="btn ghost" disabled><MessageCircle size={15}/> Chat</button>}<a className="btn ghost" href="mailto:support@janco.app"><Phone size={15}/> Support</a></ActionRow></div>
      {job.status === "completed" && profile?.role !== "janitor" && profile?.id === job.user_id && <div className="card"><h3>How was your clean?</h3><p className="muted">Leave a rating to help your JANCO professional build trust.</p><ActionRow count={1}><Link className="btn secondary" href={`/portal/rate/${id}`}><Star size={15}/> Rate service</Link></ActionRow></div>}
      {["pending", "confirmed"].includes(job.status) && profile?.id === job.user_id && <div className="card"><h3>Need to change plans?</h3><p className="muted">Cancellation policies may apply based on timing.</p><ActionRow count={1}><button className="btn danger" onClick={() => void cancel()}>Cancel booking</button></ActionRow></div>}
      <ToastMessage message={error}/>
    </aside></div>
  </main></div>;
}

export default function JobPage() { return <Protected><JobContent/></Protected>; }
