"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /services page for the customer and janitor PWA.
 * Why: It keeps business workflows separate from HTTP handlers.
 * Uses or links to: web/components/SiteNav.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { SERVICES, money } from "@/lib/catalog";
import type { Service } from "@/lib/types";

export default function ServicesPage() { const [services,setServices]=useState<Service[]>(SERVICES); useEffect(()=>{void api.services().then(result=>{if(result.data?.length)setServices(result.data)});},[]); return <div className="shell"><SiteNav/><main className="container section"><div className="eyebrow">Services</div><h1>Pick the kind of help your space needs.</h1><p className="lead">Every package includes a clear scope, an estimated duration, and a transparent price before you confirm.</p><div className="grid" style={{marginTop:36}}>{services.map((service) => <article className="card" key={service.id}><div className="service-icon" style={{background:service.color}}><ArrowRight size={22}/></div><h2 style={{fontSize:26}}>{service.name}</h2><p>{service.description}</p><p className="small"><strong>From {money(service.priceFrom)}</strong> · {service.duration}</p><h3 style={{marginTop:20}}>Included</h3><div className="check-list">{service.inclusions.map((item) => <div className="check" key={item}><Check size={15}/>{item}</div>)}</div>{service.exclusions?.length>0&&<p className="muted small">Not included: {service.exclusions.join(" · ")}</p>}<Link className="btn primary" href={`/book?service=${service.id}`} style={{marginTop:20}}>Book this service <ArrowRight size={15}/></Link></article>)}</div></main></div>; }
