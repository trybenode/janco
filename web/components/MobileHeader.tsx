"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Renders the shared mobile title bar and role-aware back navigation.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/components/AuthProvider.tsx.
 * Imported or linked from: web/app/book/page.tsx, web/app/janitor/page.tsx, web/app/janitor/profile/page.tsx, web/app/janitor/register/page.tsx, web/app/janitor/schedule/page.tsx, web/app/janitor/status/page.tsx, web/app/janitor/verification/page.tsx, web/app/nearby-janitors/page.tsx; 13 more in docs/file-inventory.md.
 */


import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function MobileHeader({ title, back = true, children }: { title: string; back?: boolean; children?: React.ReactNode }) {
  const router = useRouter();
  const { profile } = useAuth();
  const goBack = () => {
    const referrer = document.referrer;
    if (referrer && new URL(referrer).origin === window.location.origin && window.history.length > 1) router.back();
    else router.replace(profile?.role === "janitor" ? "/janitor" : "/portal");
  };
  return <header className="mobile-header">
    <div className="mobile-header-side">{back && <button className="icon-button" aria-label="Go back" onClick={goBack}><ArrowLeft size={20}/></button>}</div>
    <h1>{title}</h1><div className="mobile-header-side right">{children}</div>
  </header>;
}
