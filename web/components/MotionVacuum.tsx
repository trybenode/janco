"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the motion vacuum interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/components/LandingPage.tsx.
 */


import { useEffect, useRef } from "react";

/** Decorative scroll-linked illustration. It never receives pointer or focus events. */
export function MotionVacuum() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
        const x = Math.sin(progress * Math.PI * 2.4) * 20;
        const y = progress * Math.min(260, window.innerHeight * 0.42);
        node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${progress * 8 - 4}deg)`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return <div ref={ref} className="motion-vacuum" aria-hidden="true">
    <svg viewBox="0 0 180 100" role="presentation">
      <path className="vacuum-hose" d="M99 22 C125 16 136 26 132 48 C129 64 143 68 158 63" />
      <rect className="vacuum-body" x="46" y="45" width="58" height="35" rx="16" />
      <circle className="vacuum-wheel" cx="60" cy="84" r="7" />
      <circle className="vacuum-wheel" cx="91" cy="84" r="7" />
      <path className="vacuum-handle" d="M68 46 L84 13 L99 13" />
      <path className="vacuum-head" d="M139 61 L173 61 L166 75 L141 75 Z" />
      <circle className="vacuum-dot" cx="78" cy="61" r="5" />
    </svg>
  </div>;
}
