/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the badge interface component for the admin application.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: janco-admin/lib/utils.ts.
 * Imported or linked from: janco-admin/app/dashboard/admins/page.tsx, janco-admin/app/dashboard/analytics/page.tsx, janco-admin/app/dashboard/broadcast/page.tsx, janco-admin/app/dashboard/customers/page.tsx, janco-admin/app/dashboard/janitors/page.tsx, janco-admin/app/dashboard/jobs/page.tsx, janco-admin/app/dashboard/page.tsx.
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        className
      )}
    >
      {label}
    </span>
  );
}
