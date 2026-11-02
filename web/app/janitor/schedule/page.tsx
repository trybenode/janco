"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /janitor/schedule page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/types.ts.
 * Imported or linked from: web/app/janitor/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { ToastMessage } from "@/components/ToastProvider";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, RefreshCw } from "lucide-react";
import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { LoadingState } from "@/components/LoadingState";
import { api } from "@/lib/api";
import { label, money } from "@/lib/catalog";
import type { Job } from "@/lib/types";

const filters = [{ label: "All", value: "all" }, { label: "New", value: "pending" }, { label: "Confirmed", value: "confirmed" }, { label: "Active", value: "in_progress" }, { label: "Done", value: "completed" }] as const;
function ScheduleContent() { const [jobs, setJobs] = useState<Job[]>([]); const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all"); const [error, setError] = useState(""); const [loading, setLoading] = useState(true); const load = async () => { setError(""); const result = await api.assigned(); if (result.data) setJobs(result.data.jobs ?? []); else setError(result.error ?? "We could not load your schedule. Please retry."); setLoading(false); }; useEffect(() => { void load(); }, []); const visible = useMemo(() => filter === "all" ? jobs : jobs.filter((job) => job.status === filter), [filter, jobs]); const grouped = useMemo(() => visible.reduce<Record<string, Job[]>>((all, job) => { const date = job.scheduled_date || "Unscheduled"; (all[date] ??= []).push(job); return all; }, {}), [visible]); return <div className="shell"><SiteNav portal/><main className="mobile-canvas"><MobileHeader title="Schedule"><button className="icon-button" aria-label="Refresh schedule" onClick={() => void load()}><RefreshCw size={18}/></button></MobileHeader><div className="toolbar" style={{ marginTop: 18 }}><div><div className="eyebrow">Janitor schedule</div><h2>Plan the day ahead.</h2></div><CalendarDays size={26}/></div><div className="filter-row" role="group" aria-label="Filter jobs" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "18px 0" }}>{filters.map((item) => <button className={`btn ${filter === item.value ? "secondary" : "ghost"}`} key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div>{loading && <LoadingState label="Loading your schedule…"/>} <ToastMessage message={error}/>{error && <button className="btn ghost" onClick={() => void load()}>Retry schedule</button>}{!loading && Object.entries(grouped).map(([date, dayJobs]) => <section key={date} style={{ marginTop: 22 }}><h3>{date === "Unscheduled" ? date : new Date(date).toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" })}</h3><div className="card-stack">{dayJobs.map((job) => <Link className="card job" href={`/portal/jobs/${job.id}`} key={job.id}><div><strong>{label(job.service_type)}</strong><div className="muted small">{job.scheduled_time || "Time pending"} · {job.address || "Address pending"}</div><div className="muted small">{job.price ? money(job.price) : "Price pending"}</div></div><span className={`status ${job.status}`}>{label(job.status)}</span></Link>)}</div></section>)}{!loading && !visible.length && <div className="card" style={{ marginTop: 20, textAlign: "center" }}><CalendarDays size={24}/><p className="muted">No jobs match this filter.</p></div>}</main></div>; }
export default function JanitorSchedulePage() { return <RoleProtected role="janitor"><ScheduleContent/></RoleProtected>; }
