"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the loading state interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/janitor/page.tsx, web/app/janitor/schedule/page.tsx, web/app/janitor/verification/page.tsx, web/app/portal/jobs/[id]/page.tsx, web/app/portal/page.tsx, web/app/portal/rate/[id]/page.tsx, web/components/LegalDocument.tsx, web/components/Protected.tsx.
 */


const BRAND_NAME = "JANCO";

export function LoadingState({ label = "Loading your JANCO workspace…" }: { label?: string }) {
  return <div className="loading-state" role="status" aria-live="polite" aria-busy="true" aria-label={`Loading JANCO workspace. ${label}`}>
    <div className="loading-brand" aria-hidden="true">
      {Array.from(BRAND_NAME).map((letter, index) => <span className="loading-letter" style={{ "--letter-index": index } as React.CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}
      <span className="loading-cursor" />
    </div>
    <span className="loading-label" aria-hidden="true">{label}</span>
  </div>;
}
