"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /update-password page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/AuthProvider.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts.
 * Imported or linked from: web/components/ProfileScreen.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { useAuth } from "@/components/AuthProvider";
import { ToastMessage } from "@/components/ToastProvider";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";

function UpdatePasswordContent() { const router = useRouter(); const { profile } = useAuth(); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false); const submit=async(event:FormEvent)=>{event.preventDefault();setError("");if(password.length<8)return setError("Use at least 8 characters.");if(password!==confirm)return setError("Passwords do not match.");setBusy(true);const result=await api.updatePassword(password);if(result.data){setMessage("Password updated. Redirecting…");setTimeout(()=>router.push(profile?.role === "janitor" ? "/janitor/profile" : "/portal/profile"),700)}else setError(result.error??"Could not update password.");setBusy(false)};return <div className="shell"><SiteNav portal/><main className="container portal-main"><MobileHeader title="Update password"/><section className="card" style={{marginTop:18}}><div className="eyebrow">Security</div><h1 className="page-title">Update password</h1><form onSubmit={submit}><div className="field"><label htmlFor="password">New password</label><input id="password" type="password" value={password} onChange={event=>setPassword(event.target.value)} required/></div><div className="field"><label htmlFor="confirm">Confirm password</label><input id="confirm" type="password" value={confirm} onChange={event=>setConfirm(event.target.value)} required/></div><ToastMessage message={error}/><ToastMessage message={message} kind="success"/><button className="btn primary" disabled={busy}>{busy?"Updating…":"Update password"}</button></form></section></main></div>}
export default function UpdatePasswordPage(){return <Protected><UpdatePasswordContent/></Protected>}
