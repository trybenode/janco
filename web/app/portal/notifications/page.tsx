"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /portal/notifications page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/push.ts.
 * Imported or linked from: web/app/janitor/notifications/page.tsx, web/app/portal/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { ToastMessage } from "@/components/ToastProvider";
import { Bell, Check } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";

import { useEffect, useState } from "react";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { disableBrowserPush, enableBrowserPush } from "@/lib/push";

const items = [["booking", "Booking confirmations"], ["assignment", "Janitor assignment"], ["status", "Job status changes"], ["chat", "Chat messages"], ["payment", "Payment updates"], ["reminders", "Arrival reminders"]] as const;

function Preferences() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => { void api.notificationPreferences().then((result) => { if (result.data) setPreferences(result.data); else setMessage(result.error ?? "Could not load preferences"); }); }, []);

  const toggle = async (key: string) => {
    const next = !preferences[key];
    setPreferences((current) => ({ ...current, [key]: next }));
    const result = await api.updateNotificationPreferences({ [key]: next });
    if (!result.data) { setPreferences((current) => ({ ...current, [key]: !next })); setMessage(result.error ?? "Could not save preference"); }
  };

  const updatePush = async (enable: boolean) => {
    setPushBusy(true);
    const result = enable ? await enableBrowserPush() : await disableBrowserPush();
    setMessage(result.message);
    setPushBusy(false);
  };

  return <div className="shell"><SiteNav portal /><main className="container portal-main"><MobileHeader title="Notifications"/><section className="card" style={{ marginTop: 18 }}><div className="eyebrow">Notifications</div><h1 className="page-title">Stay in the loop.</h1><p className="muted">Choose which booking and support updates you want to receive.</p><div className="check-list">{items.map(([key, name]) => <button type="button" className="check choice-row" key={key} onClick={() => void toggle(key)}><span><Bell size={16} /> {name}</span><span aria-label={`${name} ${preferences[key] ? "enabled" : "disabled"}`} style={{ color: preferences[key] ? "var(--success)" : "var(--on-surface-variant)" }}>{preferences[key] ? <Check size={19} /> : "Off"}</span></button>)}</div><div className="card" style={{ marginTop: 20, background: "var(--surface-variant)", boxShadow: "none" }}><h2 style={{ fontSize: 22 }}>Browser notifications</h2><p className="muted small">Get assignment, status, chat, payment, and reminder updates even when JANCO is not open.</p><div className="actions"><button className="btn primary" type="button" disabled={pushBusy} onClick={() => void updatePush(true)}>{pushBusy ? "Updating…" : "Enable notifications"}</button><button className="btn ghost" type="button" disabled={pushBusy} onClick={() => void updatePush(false)}>Disable</button></div></div><ToastMessage message={message} kind="info"/></section></main></div>;
}

export default function NotificationsPage() { return <Protected><Preferences /></Protected>; }
