"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the site nav interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/app/book/page.tsx, web/app/login/page.tsx, web/components/AuthProvider.tsx, web/components/JanitorBottomNav.tsx.
 * Imported or linked from: web/app/about/page.tsx, web/app/book/page.tsx, web/app/forgot-password/page.tsx, web/app/janitor/page.tsx, web/app/janitor/profile/page.tsx, web/app/janitor/register/page.tsx, web/app/janitor/schedule/page.tsx, web/app/janitor/status/page.tsx; 17 more in docs/file-inventory.md.
 */

import Link from "next/link";
import { Bell, LayoutDashboard, Sparkles, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { JanitorBottomNav } from "@/components/JanitorBottomNav";

export function MobileBottomNav({ active = "Home" }: { active?: "Home" | "Book" | "Profile" }) {
  const tabs = [
    { name: "Home" as const, href: "/portal", icon: LayoutDashboard },
    { name: "Book" as const, href: "/book", icon: Sparkles },
    { name: "Profile" as const, href: "/portal/profile", icon: UserRound },
  ] as const;
  return <nav className="mobile-bottom-nav" aria-label="Primary navigation">{tabs.map(({ name, href, icon: Icon }) => <Link className={`mobile-tab ${active === name ? "active" : ""}`} href={href} key={name}><span className="pill"><Icon size={24}/></span><span>{name}</span></Link>)}</nav>;
}

export function SiteNav({ portal = false, active = "Home" }: { portal?: boolean; active?: "Home" | "Book" | "Profile" }) {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const publicPage = !portal && !profile;
  const janitor = profile?.role === "janitor";
  const dashboardHref = janitor ? "/janitor" : "/portal";
  return <>
    <header className={portal ? "portal-nav" : ""}>
      <div className="nav">
        <Link href={dashboardHref} className="logo" aria-label="JANCO home">JANCO</Link>
        <div className="actions">
          {publicPage ? <><Link className="btn ghost" href="/login">Log in</Link><Link className="btn primary" href="/book">Book</Link></> : <>
            <Link aria-label="Notifications" className="btn ghost" href={janitor ? "/janitor/notifications" : "/portal/notifications"} style={{minWidth:48,padding:0,border:0}}><Bell size={24}/></Link>
            <button className="btn ghost" onClick={() => void signOut()}>Sign out</button>
          </>}
        </div>
      </div>
    </header>
    {portal && (janitor ? <JanitorBottomNav/> : <MobileBottomNav active={pathname?.startsWith("/book") ? "Book" : pathname?.startsWith("/portal/profile") ? "Profile" : active}/>)} 
  </>;
}
