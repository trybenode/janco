"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the legal document interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/components/AuthProvider.tsx, web/components/LoadingState.tsx, web/components/MobileHeader.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts.
 * Imported or linked from: web/app/legal/privacy/page.tsx, web/app/legal/terms/page.tsx.
 */


import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { useAuth } from "@/components/AuthProvider";
import { ToastMessage } from "@/components/ToastProvider";

function MarkdownText({ content }: { content: string }) {
  return <div className="legal-copy">{content.split(/\r?\n/).map((line, index) => { const text = line.replace(/^#{1,6}\s*/, "").replace(/^[-*]\s+/, ""); if (!text.trim()) return <div aria-hidden="true" style={{ height: 10 }} key={index}/>; if (line.startsWith("# ")) return <h1 key={index}>{text}</h1>; if (line.startsWith("## ")) return <h2 key={index}>{text}</h2>; if (line.startsWith("### ")) return <h3 key={index}>{text}</h3>; if (/^[-*]\s+/.test(line)) return <li key={index}>{text}</li>; return <p key={index}>{text}</p>; })}</div>;
}

export function LegalDocument({ type, title }: { type: "terms" | "privacy"; title: string }) {
  const { profile } = useAuth();
  const [document, setDocument] = useState<{ version: string; content_md: string } | null>(null); const [error, setError] = useState("");
  const load = async () => { setError(""); const result = await api.legal(type); if (result.data) setDocument(result.data); else setError(result.error ?? "We could not load this document. Please retry."); };
  // The loader is intentionally scoped to the selected document type.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [type]);
  return <div className="shell"><SiteNav portal={Boolean(profile)}/><main className="container section">{profile && <MobileHeader title={title}/>}<div className="card">{!document && !error && <LoadingState label="Loading legal document…"/>} {error && <><ToastMessage message={error}/><button className="btn ghost" style={{ marginTop: 12 }} onClick={() => void load()}>Retry</button></>}{document && <><div className="eyebrow">Legal · Version {document.version}</div><h1>{title}</h1><MarkdownText content={document.content_md}/></>}</div></main></div>;
}
