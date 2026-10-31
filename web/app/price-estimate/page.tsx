"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /price-estimate page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { ToastMessage } from "@/components/ToastProvider";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, Check } from "lucide-react";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { money, SERVICES } from "@/lib/catalog";
import type { Quote, Service } from "@/lib/types";

function EstimateContent(){const [services,setServices]=useState<Service[]>(SERVICES);const [service,setService]=useState("house_cleaning");const [rooms,setRooms]=useState(2);const [toilets,setToilets]=useState(1);const [quote,setQuote]=useState<Quote|null>(null);const [error,setError]=useState("");useEffect(()=>{void api.services().then(result=>{if(result.data)setServices(result.data)})},[]);const calculate=async()=>{const result=await api.quote({service_type:service,rooms,toilets,clothes_count:0,extras:{},use_fixed:true,surge:"normal",distance_km:null,use_scan:false,area_m2:null});if(result.data)setQuote(result.data);else setError(result.error??"Could not calculate estimate")};return <div className="shell"><SiteNav portal/><main className="container portal-main"><MobileHeader title="Price estimate"/><section className="card" style={{marginTop:18}}><div className="eyebrow">Price estimate</div><h1 className="page-title">See the numbers before you commit.</h1><div className="form-grid"><div className="field full"><label htmlFor="service">Service</label><select id="service" value={service} onChange={event=>setService(event.target.value)}>{services.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="field"><label htmlFor="rooms">Rooms</label><input id="rooms" type="number" min={0} value={rooms} onChange={event=>setRooms(Number(event.target.value))}/></div><div className="field"><label htmlFor="toilets">Bathrooms / toilets</label><input id="toilets" type="number" min={0} value={toilets} onChange={event=>setToilets(Number(event.target.value))}/></div></div><button className="btn primary" onClick={()=>void calculate()}><Calculator size={16}/> Calculate</button><ToastMessage message={error}/>{quote&&<div className="card" style={{marginTop:20,background:"var(--surface-variant)",boxShadow:"none"}}><h2>{money(quote.total)}</h2>{quote.breakdown.map(item=><div className="check" key={item}><Check size={15}/>{item}</div>)}<p className="muted small">{quote.duration_hours} hours · {quote.workers} worker(s) · Quote expires {quote.expires_at?new Date(quote.expires_at).toLocaleTimeString("en-NG"):"shortly"}</p><Link className="btn secondary" href={`/book?service=${service}`}>Continue to booking</Link></div>}</section></main></div>}
export default function PriceEstimatePage(){return <Protected><EstimateContent/></Protected>}
