/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the skeleton interface component for the admin application.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: janco-admin/lib/utils.ts.
 * Imported or linked from: janco-admin/app/dashboard/admins/page.tsx, janco-admin/app/dashboard/analytics/page.tsx, janco-admin/app/dashboard/broadcast/page.tsx, janco-admin/app/dashboard/customers/page.tsx, janco-admin/app/dashboard/finance/page.tsx, janco-admin/app/dashboard/janitors/page.tsx, janco-admin/app/dashboard/jobs/page.tsx, janco-admin/app/dashboard/page.tsx; 2 more in docs/file-inventory.md.
 */

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-surface-2", className)}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
