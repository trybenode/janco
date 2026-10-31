"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the web theme interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/layout.tsx, web/components/ProfileScreen.tsx.
 */

import { useEffect } from "react";
export function toggleTheme() { const current = document.documentElement.dataset.theme ?? "light"; const next = current === "dark" ? "light" : "dark"; localStorage.setItem("@janco_color_scheme", next); document.documentElement.dataset.theme = next; window.dispatchEvent(new CustomEvent("janco:theme-change")); }
export function WebTheme({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { const stored = localStorage.getItem("@janco_color_scheme"); document.documentElement.dataset.theme = stored === "light" || stored === "dark" ? stored : (media.matches ? "dark" : "light"); };
    apply(); media.addEventListener("change", apply); window.addEventListener("janco:theme-change", apply); return () => { media.removeEventListener("change", apply); window.removeEventListener("janco:theme-change", apply); };
  }, []);
  return <>{children}</>;
}
