"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /janitor/status page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/janitor/verification/page.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx.
 * Imported or linked from: web/app/janitor/register/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";

import Link from "next/link";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";

export default function JanitorStatusPage(){return <Protected><div className="shell"><SiteNav/><main className="container portal-main"><MobileHeader title="Application status"/><section className="card"><div className="eyebrow">Application status</div><h1 className="page-title">Your application is with JANCO.</h1><p className="lead">Verification and approval protect both customers and janitors. You can return here to see progress and update missing information.</p><div className="check-list"><div className="check"><span className="status pending">Pending review</span><span>Identity and profile checks</span></div><div className="check"><span className="status">Next</span><span>Complete Dojah verification when requested</span></div></div><Link className="btn primary" href="/janitor/verification" style={{marginTop:20}}>View verification</Link></section></main></div></Protected>}
