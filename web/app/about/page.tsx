/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /about page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/components/SiteNav.tsx.
 * Imported or linked from: web/components/LandingPage.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import Link from "next/link";
import { BadgeCheck, HeartHandshake, LockKeyhole } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
export default function AboutPage() { return <div className="shell"><SiteNav/><main className="container section"><div className="eyebrow">Trust & safety</div><h1>Service delivery should feel dependable.</h1><p className="lead">JANCO brings together identity-verified professionals, explainable pricing, smart matching, and responsive support so customers and janitors can work with confidence.</p><div className="grid" style={{marginTop:36}}><div className="card"><BadgeCheck size={24}/><h2 style={{fontSize:25}}>Verified professionals</h2><p>Identity checks and trust signals help customers make informed choices while giving janitors a fair platform to build a reputation.</p></div><div className="card"><LockKeyhole size={24}/><h2 style={{fontSize:25}}>Secure by design</h2><p>Payments are handled through Paystack, authentication is token-based, and booking access is restricted to the people involved.</p></div><div className="card"><HeartHandshake size={24}/><h2 style={{fontSize:25}}>Human support</h2><p>From an active job, customers and janitors can see the status, communicate, and get help when plans change.</p></div></div><div className="card" style={{marginTop:18}}><h3>Need help before booking?</h3><p>Start with a live quote or sign in to access your existing jobs.</p><Link className="btn primary" href="/book">Book a service</Link></div></main></div>; }
