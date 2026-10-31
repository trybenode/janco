"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Renders shared customer and janitor account details, editing, location, and account actions.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/app/janitor/page.tsx, web/app/janitor/register/page.tsx, web/app/janitor/verification/page.tsx, web/app/legal/terms/page.tsx, web/app/login/page.tsx, web/app/portal/bookings/page.tsx, web/app/update-password/page.tsx, web/components/ActionRow.tsx; 5 more in docs/file-inventory.md.
 * Imported or linked from: web/app/janitor/profile/page.tsx, web/app/portal/profile/page.tsx.
 */

import { ToastMessage } from "@/components/ToastProvider";
/* eslint-disable @next/next/no-img-element -- avatar URLs are user-configured and may be hosted outside Next image config. */

import Link from "next/link";
import { Check, ChevronDown, LocateFixed, LogOut, MapPin, ShieldCheck, Star, UserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ActionRow } from "@/components/ActionRow";
import { api } from "@/lib/api";
import { toggleTheme } from "@/components/WebTheme";
import type { Janitor } from "@/lib/types";

export function ProfileScreen({ janitor }: { janitor?: Janitor | null }) {
  const { profile, refresh, signOut } = useAuth();
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [landmark, setLandmark] = useState(profile?.landmark ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const save = async () => {
    setBusy(true);
    const result = await api.updateProfile({ full_name: name.trim(), phone: phone.trim(), address: address.trim(), landmark: landmark.trim() });
    setMessage(result.data ? "Profile saved." : result.error ?? "We could not save your profile. Please retry.");
    if (result.data) { await refresh(); setEditorOpen(false); }
    setBusy(false);
  };

  const cancelEdit = () => {
    setName(profile?.full_name ?? ""); setPhone(profile?.phone ?? ""); setAddress(profile?.address ?? ""); setLandmark(profile?.landmark ?? ""); setEditorOpen(false);
  };

  const locate = () => {
    if (!navigator.geolocation) { setMessage("Location is not available in this browser."); return; }
    setMessage("Checking your location…");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const result = await api.updateProfile({ lat: position.coords.latitude, lng: position.coords.longitude });
      setMessage(result.data ? "Location updated." : result.error ?? "We could not update your location.");
      if (result.data) await refresh();
    }, () => setMessage("Location permission was not granted. You can enter your address manually."), { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
  };

  const logout = async () => { await signOut(); router.replace("/login"); };
  const displayName = profile?.full_name || "Your profile";

  return <div className="card-stack">
    <section className="card profile-identity-card">
      {profile?.avatar_url && !avatarBroken ? <img className="profile-avatar-image" src={profile.avatar_url} alt="" onError={() => setAvatarBroken(true)}/> : <div className="avatar profile-avatar-fallback" aria-hidden="true"><UserRound size={36}/></div>}
      <h1 className="page-title">{displayName}</h1><p className="muted">{profile?.email}</p>
    </section>

    <section className="card profile-editor-card">
      <button type="button" className="profile-editor-toggle" aria-expanded={editorOpen} aria-controls="profile-editor-fields" onClick={() => setEditorOpen((open) => !open)}><span>Edit profile details</span><ChevronDown size={20} aria-hidden="true"/></button>
      {editorOpen && <div id="profile-editor-fields" className="profile-editor-fields"><div className="form-grid"><div className="field full"><label htmlFor="profile-name">Full name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)}/></div><div className="field full"><label htmlFor="profile-phone">Phone</label><input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)}/></div><div className="field full"><label htmlFor="profile-address">Saved address</label><input id="profile-address" value={address} onChange={(event) => setAddress(event.target.value)}/></div><div className="field full"><label htmlFor="profile-landmark">Landmark</label><input id="profile-landmark" value={landmark} onChange={(event) => setLandmark(event.target.value)}/></div></div><ActionRow count={2}><button className="btn primary" disabled={busy} onClick={() => void save()}>{busy ? "Saving…" : "Save changes"}</button><button className="btn ghost" disabled={busy} onClick={cancelEdit}>Cancel</button></ActionRow></div>}
    </section>

    <section className="card profile-location-card"><div className="profile-card-heading"><MapPin size={21}/><h2>My location</h2></div><p className="muted small">{profile?.address || "Add a saved address for faster booking."}</p><ActionRow count={1}><button className="btn ghost" onClick={locate}><LocateFixed size={16}/> Update my location</button></ActionRow></section>

    {profile?.role === "janitor" && janitor && <section className="card"><h2>Professional profile</h2><div className="trust-row"><div className="card"><Star size={18}/><strong>{Number(janitor.avg_rating ?? 0).toFixed(1)}</strong><span className="muted small">Rating</span></div><div className="card"><ShieldCheck size={18}/><strong>{Math.round(Number(janitor.trust_score ?? 0))}</strong><span className="muted small">TrustScore · {janitor.trust_tier || "Pending"}</span></div></div><p className="muted small"><Check size={14}/> {janitor.is_verified ? "Identity verified" : "Verification pending"}</p></section>}

    <section className="card profile-actions-card"><h2>Account</h2><ActionRow count={2}>{profile?.role === "janitor" ? <><Link className="btn ghost" href="/janitor/verification"><ShieldCheck size={16}/> Verification</Link><Link className="btn ghost" href="/janitor"><UserRound size={16}/> Janitor dashboard</Link></> : <><Link className="btn ghost" href="/portal/bookings">My bookings</Link><Link className="btn ghost" href="/janitor/register">Become a janitor</Link></>}</ActionRow><ActionRow count={2}><button className="btn ghost" onClick={toggleTheme}>Switch theme</button><Link className="btn ghost" href="/update-password">Update password</Link></ActionRow><ActionRow count={1}><Link className="btn ghost" href="/legal/terms">Terms and privacy</Link></ActionRow><ActionRow count={1}><button className="btn danger" onClick={() => void logout()}><LogOut size={16}/> Log out</button></ActionRow><p className="muted small profile-version">JANCO v1.0.0</p></section>
    <ToastMessage message={message} kind={message.includes("saved") || message.includes("updated") ? "success" : "info"}/>
  </div>;
}
