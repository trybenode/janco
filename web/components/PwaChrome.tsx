"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Displays PWA network, install, and update controls and starts offline queue replay.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/offline.ts.
 * Imported or linked from: web/app/layout.tsx.
 */

import { useEffect, useState } from "react";
import { Download, WifiOff } from "lucide-react";
import { API_URL, session } from "@/lib/api";
import { flushSafeMutations } from "@/lib/offline";
import { useToast } from "@/components/ToastProvider";
export function NetworkStatus() { const [offline, setOffline] = useState(false); const { show } = useToast(); useEffect(() => { const update = () => { const isOffline = !navigator.onLine; setOffline(isOffline); if (!isOffline) void flushSafeMutations(session.access, API_URL); }; const conflict = (event: Event) => show((event as CustomEvent<string>).detail, "error"); update(); window.addEventListener("janco:queue-conflict", conflict); window.addEventListener("online", update); window.addEventListener("offline", update); return () => { window.removeEventListener("janco:queue-conflict", conflict); window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, [show]); return offline ? <div className="toast network-toast"><WifiOff size={15}/> You’re offline. Saved information remains available.</div> : null; }
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> };
export function InstallPrompt() { const [event, setEvent] = useState<InstallEvent | null>(null); const [visible, setVisible] = useState(false); const [update, setUpdate] = useState<ServiceWorkerRegistration | null>(null); useEffect(() => { const handler = (value: Event) => { value.preventDefault(); setEvent(value as InstallEvent); setVisible(true); }; const requested = () => { if (event) void event.prompt(); else window.dispatchEvent(new CustomEvent("janco:install-unavailable")); }; window.addEventListener("beforeinstallprompt", handler); window.addEventListener("janco:request-install", requested); navigator.serviceWorker?.getRegistration().then((registration) => { if (!registration) return; registration.addEventListener("updatefound", () => { const worker = registration.installing; worker?.addEventListener("statechange", () => { if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdate(registration); }); }); }); return () => { window.removeEventListener("beforeinstallprompt", handler); window.removeEventListener("janco:request-install", requested); }; }, [event]); if (update) return <div className="toast"><span>JANCO has an update ready.</span><button className="btn secondary" onClick={() => { update.waiting?.postMessage({ type: "SKIP_WAITING" }); window.location.reload(); }}>Update</button></div>; if (!visible || !event) return null; return <div className="toast"><Download size={15}/><span>Install JANCO for faster access.</span><button className="btn secondary" onClick={async () => { await event.prompt(); setVisible(false); }}>Install</button><button className="btn ghost" onClick={() => setVisible(false)}>Later</button></div>; }
