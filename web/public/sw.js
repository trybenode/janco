/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the PWA service worker for offline assets, updates, and browser notifications.
 * Why: It supports the installable application when network or notification events occur.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Browser service worker entry point.
 */

const CACHE = "janco-web-v4-chat-retention";
const SHELL = ["/", "/portal", "/book", "/portal/bookings", "/services", "/pricing", "/offline", "/manifest.webmanifest", "/logo.png", "/icon.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("janco-web-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("/chat/") || url.pathname.includes("/verification") || url.pathname.startsWith("/v1/") || url.pathname.startsWith("/api/")) return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/offline"))));
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json?.() ?? {};
  } catch {
    payload = { body: event.data?.text?.() };
  }
  const title = payload.title || "JANCO update";
  const options = {
    body: payload.body || "You have a new update from JANCO.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: payload.tag || "janco-update",
    data: payload.data || { url: "/portal" },
    requireInteraction: Boolean(payload.requireInteraction),
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const candidate = event.notification.data?.url;
  const target = typeof candidate === "string" && candidate.startsWith("/") && !candidate.startsWith("//") && !/[\u0000-\u001f\u007f]/.test(candidate)
    ? candidate
    : "/portal";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client);
      if (existing) {
        existing.navigate(target);
        return existing.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});
