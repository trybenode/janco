"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the janitor preview interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/lib/api.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 */

import { useEffect, useState } from "react";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { api } from "@/lib/api";
import type { Janitor } from "@/lib/types";
export function JanitorPreview({ serviceType }: { serviceType: string }) {
  const [janitors, setJanitors] = useState<Janitor[]>([]); const [message, setMessage] = useState("Allow location to see nearby available professionals.");
  useEffect(() => { if (!navigator.geolocation) { setMessage("JANCO will match you with the best available professional after confirmation."); return; } navigator.geolocation.getCurrentPosition(async ({ coords }) => { const result = await api.nearby(coords.latitude, coords.longitude, serviceType); if (result.data?.length) { setJanitors(result.data.slice(0, 3)); setMessage(""); } else setMessage("No nearby profiles are available yet. JANCO will keep matching after confirmation."); }, () => setMessage("Location was not shared. JANCO will match you after confirmation."), { timeout: 7000 }); }, [serviceType]);
  return <div className="card" style={{ marginTop: 18, background: "#f8faee" }}><h3>Available professionals</h3>{message && <p className="muted small">{message}</p>}<div className="job-list">{janitors.map((janitor) => { const id = janitor.janitor_id ?? janitor.id; if (!id) return null; return <button className="check" style={{ textAlign: "left", border: "1px solid var(--line)" }} key={id} onClick={() => { sessionStorage.setItem("janco.selectedJanitor", id); setMessage(`${janitor.full_name || "Professional"} selected.`); }}><div className="avatar">{(janitor.full_name || "J").slice(0, 1)}</div><span style={{ flex: 1 }}><strong>{janitor.full_name || "Verified JANCO professional"}</strong><br/><span className="muted small"><BadgeCheck size={13}/> {janitor.is_verified ? "Identity verified" : "JANCO screened"} · <Star size={13}/> {Number(janitor.avg_rating || 0).toFixed(1)} · <MapPin size={13}/> {janitor.distance_km ? `${janitor.distance_km.toFixed(1)} km` : "Nearby"}</span></span></button>; })}</div></div>;
}
