"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Shows the customer home, available services, gift booking entry, and bookings.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/app/portal/notifications/page.tsx, web/app/portal/profile/page.tsx, web/components/AuthProvider.tsx, web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx; 4 more in docs/file-inventory.md.
 * Imported or linked from: web/app/offline/page.tsx, web/app/payment/callback/page.tsx, web/app/registration/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { ToastMessage } from "@/components/ToastProvider";

import Link from "next/link";
import { Bell, CalendarDays, ChevronRight, Gift, Home, WashingMachine } from "lucide-react";
import { useEffect, useState } from "react";
import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { label, money } from "@/lib/catalog";
import type { Job, Service } from "@/lib/types";

const serviceIcons = { house_cleaning: Home, laundry: WashingMachine };

function PortalContent() {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    void Promise.all([api.services(), api.bookings()]).then(([catalog, bookings]) => {
      if (!mounted) return;
      if (catalog.data) setServices(catalog.data);
      else setError(catalog.error ?? "We could not load services. Please retry.");
      if (bookings.data) setJobs(bookings.data.jobs ?? []);
      else if (!catalog.data) setError(bookings.error ?? "We could not load your bookings. Please retry.");
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);
  const active = jobs.find((job) => !["completed", "cancelled"].includes(job.status));
  if (loading) return <div className="shell"><SiteNav portal/><main className="mobile-canvas"><LoadingState label="Loading your home…"/></main></div>;
  return <div className="shell"><SiteNav portal/><main className="mobile-canvas" aria-label="Customer home"><MobileHeader title="Home" back={false}/>
    <div className="toolbar" style={{ alignItems: "center" }}><div><p className="muted small" style={{ margin: 0 }}>Welcome back</p><h1 className="page-title" style={{ marginTop: 4 }}>Hi, {profile?.full_name?.split(" ")[0] || "there"}!</h1></div><Link className="icon-button" href="/portal/notifications" aria-label="Notifications"><Bell size={22}/></Link></div>
    <div className="card" style={{ marginTop: 16 }}><div className="muted small">Your saved address</div><strong>{profile?.address || "Add your service address"}</strong>{profile?.landmark && <div className="muted small">{profile.landmark}</div>}<Link className="text-button" href="/portal/profile">Update address</Link></div>
    <section style={{ marginTop: 28 }} aria-labelledby="chore-heading"><h2 id="chore-heading" style={{ textAlign: "center" }}>What Chore?</h2><p className="muted" style={{ textAlign: "center" }}>Choose a service for your space.</p><ToastMessage message={error}/><div className="service-grid-mobile" style={{ marginTop: 16 }}>{services.filter((service) => service.id === "house_cleaning" || service.id === "laundry").map((service) => { const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Home; return <Link className="card service-tile" href={`/book?service=${service.id}`} key={service.id}><span className="service-icon"><Icon size={26}/></span><h3>{service.name}</h3><small>From {money(service.priceFrom)}</small></Link>; })}</div></section>
    <section className="card gift-booking-card" aria-labelledby="gift-booking-title"><div className="gift-booking-copy"><Gift size={24}/><div><h3 id="gift-booking-title">Gift a friend a booking</h3><p className="muted small">Pay for a JANCO service at a friend’s address and give them more time back.</p></div></div><Link className="btn primary" href="/book?gift=true">Book a service</Link></section>
    <Link className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, textDecoration: "none", color: "inherit" }} href={active ? `/portal/jobs/${active.id}` : "/portal/bookings"}><span><strong>Bookings</strong><span className="muted small" style={{ display: "block", marginTop: 4 }}>{active ? `${label(active.status)} · ${active.scheduled_date ? new Date(active.scheduled_date).toLocaleDateString("en-NG") : "Date pending"}` : `${jobs.length} booking${jobs.length === 1 ? "" : "s"}`}</span></span><ChevronRight size={20}/></Link>
    {!jobs.length && <div className="card" style={{ marginTop: 16, textAlign: "center" }}><CalendarDays size={26}/><h3>Ready when you are</h3><p className="muted">Book a verified JANCO professional for your next clean.</p><Link className="btn primary" href="/book">Book a service</Link></div>}
  </main></div>;
}

export default function PortalPage() { return <RoleProtected role="customer"><PortalContent/></RoleProtected>; }
