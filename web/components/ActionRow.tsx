/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the action row interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/book/page.tsx, web/app/janitor/page.tsx, web/app/janitor/verification/page.tsx, web/app/portal/jobs/[id]/page.tsx, web/components/ProfileScreen.tsx.
 */

export function ActionRow({ children, count }: { children: React.ReactNode; count?: number }) {
  return <div className={`action-row ${count === 1 ? "count-1" : count === 2 ? "count-2" : ""}`}>{children}</div>;
}
