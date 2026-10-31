"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Displays dismissible, accessible success, error, and information toasts across the PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/book/page.tsx, web/app/forgot-password/page.tsx, web/app/janitor/page.tsx, web/app/janitor/register/page.tsx, web/app/janitor/schedule/page.tsx, web/app/janitor/verification/page.tsx, web/app/layout.tsx, web/app/login/page.tsx; 12 more in docs/file-inventory.md.
 */


import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Kind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: Kind };
type ToastContextValue = { show: (message: string, kind?: Kind) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const show = useCallback((message: string, kind: Kind = "info") => {
    if (!message.trim()) return;
    const id = ++nextId.current;
    setItems((current) => current.some((item) => item.message === message && item.kind === kind) ? current : [...current.slice(-3), { id, message, kind }]);
    timers.current.push(setTimeout(() => dismiss(id), kind === "error" ? 8000 : 5000));
  }, [dismiss]);
  useEffect(() => { const running = timers.current; return () => running.forEach(clearTimeout); }, []);
  return <ToastContext.Provider value={{ show }}>{children}<div className="feedback-toasts" aria-live="polite" aria-relevant="additions">{items.map((item) => <div className={`feedback-toast ${item.kind}`} role={item.kind === "error" ? "alert" : "status"} key={item.id}><span>{item.message}</span><button type="button" aria-label="Dismiss message" onClick={() => dismiss(item.id)}>×</button></div>)}</div></ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast requires ToastProvider");
  return context;
}

export function ToastMessage({ message, kind = "error" }: { message: string; kind?: Kind }) {
  const { show } = useToast();
  useEffect(() => { if (message) show(message, kind); }, [message, kind, show]);
  return null;
}
