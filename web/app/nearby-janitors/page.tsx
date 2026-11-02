"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /nearby-janitors page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/book/page.tsx, web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/lib/api.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import type { Janitor } from "@/lib/types";

function NearbyContent() {
  const [janitors, setJanitors] = useState<Janitor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Location is unavailable. You can continue with intelligent dispatch.",
      );
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const result = await api.nearby(
          position.coords.latitude,
          position.coords.longitude,
          "house_cleaning",
        );
        if (result.data) setJanitors(result.data);
        else setError(result.error ?? "No nearby janitors found");
        setLoading(false);
      },
      () => {
        setError("Location permission was not granted.");
        setLoading(false);
      },
    );
  }, []);
  return (
    <div className="shell">
      <SiteNav portal />
      <main className="container portal-main">
        <MobileHeader title="Nearby janitors" />
        <div className="toolbar" style={{ marginTop: 20 }}>
          <div>
            <div className="eyebrow">Trust before booking</div>
            <h1 className="page-title">Nearby JANCO janitors</h1>
          </div>
          <MapPin size={24} />
        </div>
        {loading && (
          <div className="card">Finding verified professionals near you…</div>
        )}
        {error && (
          <div className="info-callout">
            <ShieldCheck size={20} />
            <span>
              {error}{" "}
              <Link href="/book" style={{ textDecoration: "underline" }}>
                Continue to dispatch
              </Link>
            </span>
          </div>
        )}
        <div className="job-list" style={{ marginTop: 16 }}>
          {janitors.map((janitor) => (
            <article
              className="card trust-card"
              key={janitor.janitor_id ?? janitor.id}
            >
              <div className="avatar">
                {janitor.full_name?.slice(0, 1) ?? "J"}
              </div>
              <div style={{ flex: 1 }}>
                <h3>{janitor.full_name || "Verified JANCO janitor"}</h3>
                <div className="rating">
                  <Star size={14} fill="currentColor" />{" "}
                  {Number(janitor.avg_rating ?? 0).toFixed(1)} · TrustScore{" "}
                  {Math.round(Number(janitor.trust_score ?? 0))}
                </div>
                <p className="muted small">
                  {janitor.is_verified ? "Identity verified" : "Eligible"} ·{" "}
                  {janitor.distance_km?.toFixed(1) ?? "—"} km away
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
export default function NearbyJanitorsPage() {
  return (
    <Protected>
      <NearbyContent />
    </Protected>
  );
}
