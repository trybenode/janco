"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /janitor/register page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/janitor/status/page.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/forms.ts.
 * Imported or linked from: web/components/LandingPage.tsx, web/components/ProfileScreen.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { ToastMessage } from "@/components/ToastProvider";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { normalizePlainText } from "@/lib/forms";

function RegisterContent(){const router=useRouter();const [phone,setPhone]=useState("");const [address,setAddress]=useState("");const [experience,setExperience]=useState("");const [bio,setBio]=useState("");const [skills,setSkills]=useState("house_cleaning,deep_cleaning");const [error,setError]=useState("");const [message,setMessage]=useState("");const submit=async(event:FormEvent)=>{event.preventDefault();setError("");const result=await api.registerJanitor({phone:normalizePlainText(phone,20),address:normalizePlainText(address,300),experience:normalizePlainText(experience,1000,true),bio:normalizePlainText(bio,1000,true),service_types:skills.split(",").map(value=>normalizePlainText(value,50).toLowerCase()).filter(Boolean)});if(result.data){setMessage(result.data.message);setTimeout(()=>router.push("/janitor/status"),600)}else setError(result.error??"Registration could not be submitted.")};return <div className="shell"><SiteNav/><main className="container portal-main"><MobileHeader title="Janitor registration"/><section className="card"><div className="eyebrow">Join the janitor network</div><h1 className="page-title">Create a trust-first work profile.</h1><p className="muted">Your account remains pending until JANCO completes verification and approval.</p><form onSubmit={submit}><div className="field"><label htmlFor="phone">Phone</label><input id="phone" value={phone} onChange={event=>setPhone(event.target.value)} required/></div><div className="field"><label htmlFor="address">Service area / address</label><input id="address" value={address} onChange={event=>setAddress(event.target.value)} required/></div><div className="field"><label htmlFor="skills">Service types</label><input id="skills" value={skills} onChange={event=>setSkills(event.target.value)} /><span className="muted small">Comma-separated, for example house_cleaning, deep_cleaning, laundry.</span></div><div className="field"><label htmlFor="experience">Experience</label><input id="experience" value={experience} onChange={event=>setExperience(event.target.value)} /></div><div className="field"><label htmlFor="bio">Short bio</label><textarea id="bio" value={bio} onChange={event=>setBio(event.target.value)} maxLength={500}/></div><ToastMessage message={error}/><ToastMessage message={message} kind="success"/><button className="btn primary">Submit registration</button></form></section></main></div>}
export default function JanitorRegisterPage(){return <Protected><RegisterContent/></Protected>}
