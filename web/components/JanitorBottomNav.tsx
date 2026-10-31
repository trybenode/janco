"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the janitor bottom nav interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/components/SiteNav.tsx.
 */


import Link from "next/link";
import { CalendarDays, LayoutDashboard, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

export function JanitorBottomNav() {
  const path = usePathname();
  const tabs = [{ name: "Dashboard", href: "/janitor", Icon: LayoutDashboard }, { name: "Schedule", href: "/janitor/schedule", Icon: CalendarDays }, { name: "Profile", href: "/janitor/profile", Icon: UserRound }] as const;
  return <nav className="mobile-bottom-nav" aria-label="Janitor navigation">{tabs.map(({ name, href, Icon }) => <Link className={`mobile-tab ${path === href || (name === "Profile" && path.startsWith("/janitor/profile")) ? "active" : ""}`} href={href} key={name}><span className="pill"><Icon size={22}/></span><span>{name}</span></Link>)}</nav>;
}
