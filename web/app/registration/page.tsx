"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /registration page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/portal/page.tsx, web/components/AuthProvider.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/forms.ts.
 * Imported or linked from: web/app/login/page.tsx, web/components/Protected.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { ToastMessage } from "@/components/ToastProvider";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { normalizePlainText } from "@/lib/forms";

function RegistrationContent() {
  const { profile, refresh } = useAuth(); const router = useRouter();
  const [name, setName] = useState(profile?.full_name ?? ""); const [phone, setPhone] = useState(profile?.phone ?? ""); const [address, setAddress] = useState(profile?.address ?? ""); const [landmark, setLandmark] = useState(profile?.landmark ?? ""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(""); const result = await api.updateProfile({ full_name: normalizePlainText(name, 80), phone: normalizePlainText(phone, 20), address: normalizePlainText(address, 300), landmark: normalizePlainText(landmark, 200), is_registered: true }); if (!result.data) setError(result.error ?? "Could not save your profile."); else { await refresh(); router.replace("/portal"); } setBusy(false); };
  return <div className="shell"><SiteNav portal/><main className="container portal-main"><MobileHeader title="Complete profile"/><div className="card"><div className="eyebrow">One more step</div><h1 className="page-title">Tell us where to meet you.</h1><p className="muted">A complete profile makes booking faster and helps JANCO match the right professional.</p><form onSubmit={submit}><div className="field"><label htmlFor="name">Full name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} required/></div><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required/></div><div className="field"><label htmlFor="address">Default service address</label><input id="address" value={address} onChange={(event) => setAddress(event.target.value)} required/></div><div className="field"><label htmlFor="landmark">Nearby landmark</label><input id="landmark" value={landmark} onChange={(event) => setLandmark(event.target.value)}/></div><ToastMessage message={error}/><button className="btn primary auth-submit" disabled={busy}>{busy ? "Saving…" : "Continue"}</button></form></div></main></div>;
}

export default function RegistrationPage() { return <Protected allowUnregistered><RegistrationContent/></Protected>; }
