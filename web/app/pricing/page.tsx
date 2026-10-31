"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /pricing page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/components/SiteNav.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { SERVICES, money } from "@/lib/catalog";
import type { Service } from "@/lib/types";

export default function PricingPage() { const [services,setServices]=useState<Service[]>(SERVICES); useEffect(()=>{void api.services().then(result=>{if(result.data?.length)setServices(result.data)});},[]); return <div className="shell"><SiteNav/><main className="container section"><div className="eyebrow">Transparent pricing</div><h1>Know the cost before you book.</h1><p className="lead">JANCO calculates your quote from service type, space details, optional extras, distance, and schedule. The server remains the source of truth.</p><div className="grid" style={{marginTop:36}}>{services.map((service) => <div className="card" key={service.id}><h2 style={{fontSize:25}}>{service.name}</h2><p>{service.duration}</p><div className="price">{money(service.priceFrom)}+</div><p className="small">Final quotes can include space size, extras, transport, and applicable schedule adjustments.</p></div>)}</div><div className="card" style={{marginTop:18}}><h3>What your quote explains</h3><p>Base service, space or area inputs, optional extras, transport fee, estimated duration, worker count, and the pricing version used. Paystack checkout is only opened after JANCO has created one idempotent booking.</p><p className="muted small">Available Paystack methods depend on your account and location, and may include card, bank transfer, USSD, and supported wallet options.</p><Link className="btn secondary" href="/book">Get a live quote</Link></div></main></div>; }
