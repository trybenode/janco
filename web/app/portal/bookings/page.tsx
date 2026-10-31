"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /portal/bookings page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/types.ts.
 * Imported or linked from: web/components/ProfileScreen.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { api } from "@/lib/api";
import { label, money } from "@/lib/catalog";
import type { Job } from "@/lib/types";
function Bookings(){const [jobs,setJobs]=useState<Job[]>([]);useEffect(()=>{void api.bookings().then(r=>setJobs(r.data?.jobs??[]));},[]);return <div className="shell"><SiteNav portal/><main className="container portal-main"><MobileHeader title="Booking history"/><div className="toolbar" style={{marginTop:16}}><div><div className="eyebrow">History</div><h1 className="page-title">Your bookings</h1></div><Link className="btn primary" href="/book">Book again</Link></div><div className="job-list">{jobs.map(job=><div className="card job" key={job.id}><Link href={`/portal/jobs/${job.id}`} style={{flex:1}}><h3>{label(job.service_type)}</h3><p className="muted small">{job.scheduled_date?new Date(job.scheduled_date).toLocaleDateString("en-NG"):"Date pending"} · {job.address||"Address pending"}</p><span className={`status ${job.status}`}>{label(job.status)}</span><strong style={{display:"block",marginTop:6}}>{job.price?money(job.price):"Quote pending"}</strong></Link>{job.status === "completed" && <Link className="btn ghost" href={`/book?rebook=${encodeURIComponent(job.id)}`}>Book again</Link>}</div>)}</div></main></div>}
export default function BookingsPage(){return <Protected><Bookings/></Protected>}
