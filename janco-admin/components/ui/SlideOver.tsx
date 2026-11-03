"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the slide over interface component for the admin application.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: janco-admin/lib/utils.ts.
 * Imported or linked from: janco-admin/app/dashboard/admins/page.tsx, janco-admin/app/dashboard/broadcast/page.tsx, janco-admin/app/dashboard/customers/page.tsx, janco-admin/app/dashboard/finance/page.tsx, janco-admin/app/dashboard/janitors/page.tsx, janco-admin/app/dashboard/jobs/page.tsx.
 */


import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function SlideOver({ open, onClose, title, children, wide }: SlideOverProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col bg-surface border-l border-border shadow-2xl transition-transform duration-300",
          wide ? "w-full max-w-2xl" : "w-full max-w-lg",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold text-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}
