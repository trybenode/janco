/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides authenticated browser requests, session refresh, error messages, and PWA API contracts.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: web/lib/catalog.ts, web/lib/offline.ts, web/lib/security.ts, web/lib/types.ts.
 * Imported or linked from: web/app/book/page.tsx, web/app/forgot-password/page.tsx, web/app/janitor/page.tsx, web/app/janitor/profile/page.tsx, web/app/janitor/register/page.tsx, web/app/janitor/schedule/page.tsx, web/app/janitor/verification/page.tsx, web/app/login/page.tsx; 22 more in docs/file-inventory.md.
 * Backend API routes: backend/app/routes/auth_routes.py, backend/app/routes/booking_routes.py, backend/app/routes/chat_routes.py, backend/app/routes/janitor_routes.py, backend/app/routes/location_routes.py, backend/app/routes/payment_routes.py, backend/app/routes/pricing_routes.py, backend/app/routes/rating_routes.py; 4 more in docs/file-inventory.md.
 */

import type { CatalogExtra, ChatMessage, Job, Janitor, JanitorEarnings, Profile, Quote, RatingSummary, ScanResult, ScanSession, Service } from "./types";
import { readCache, writeCache } from "./offline";
import { SERVICES } from "./catalog";
import { clearSubjectCache } from "./offline";
import { getCookie } from "./security";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/v1").replace(/\/$/, "");
const ACCESS_KEY = "janco.web.access";
const SUBJECT_KEY = "janco.web.subject";

export type Result<T> = { data: T | null; error: string | null };

function friendlyError(status: number, body: unknown): string {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have access to this action.";
  if (status === 409) return "This booking has changed. Refresh to see the latest status.";
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "JANCO is having trouble completing that request. Please try again.";
  if (status >= 400) return "Check the highlighted fields and try again.";
  void body;
  return "We could not complete that request. Please try again.";
}

export const session = {
  get access() { return typeof window === "undefined" ? null : sessionStorage.getItem(ACCESS_KEY); },
  get refresh() { return null; },
  set(access: string, _refresh?: string) { void _refresh; sessionStorage.setItem(ACCESS_KEY, access); try { const payload = JSON.parse(atob(access.split(".")[1] ?? "")); if (payload.sub) localStorage.setItem(SUBJECT_KEY, String(payload.sub)); } catch { /* The API will validate the token. */ } },
  clear() { const subject = typeof window === "undefined" ? null : localStorage.getItem(SUBJECT_KEY); sessionStorage.removeItem(ACCESS_KEY); localStorage.removeItem(SUBJECT_KEY); if (typeof window !== "undefined") { localStorage.removeItem("janco.booking.draft"); localStorage.removeItem("janco.booking.idempotency"); sessionStorage.removeItem("janco.selectedJanitor"); } clearSubjectCache(subject); },
};

function cacheKey(path: string) { const subject = typeof window === "undefined" ? "server" : (localStorage.getItem(SUBJECT_KEY) ?? "anonymous"); return `${subject}:${path}`; }

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<Result<T>> {
  try {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    const access = session.access;
    if (access) headers.set("Authorization", `Bearer ${access}`);
    const method = (init.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      const csrf = getCookie("janco_csrf");
      if (csrf) headers.set("X-CSRF-Token", csrf);
    }
    const response = await fetch(`${API_URL}${path}`, { ...init, method, headers, credentials: "include", cache: "no-store" });
    if (response.status === 401 && retry && await refreshSession()) {
      return request<T>(path, init, false);
    }
    if (response.status === 401 && retry) {
      session.clear();
    }
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      if (path.startsWith("/verification/")) {
        if (response.status === 400 || response.status === 422) return { data: null, error: "We could not verify your identity and selfie. Check your details and try again." };
        if (response.status === 409) return { data: null, error: "Verification cannot continue. Check your status or contact support." };
        if (response.status >= 500) return { data: null, error: "Identity verification is unavailable right now. Please try again later or contact support." };
      }
      return { data: null, error: friendlyError(response.status, body) };
    }
    if (method === "GET" && !path.startsWith("/chat/")) writeCache(cacheKey(path), body);
    return { data: body as T, error: null };
  } catch {
    if ((init.method ?? "GET").toUpperCase() === "GET" && !path.startsWith("/chat/")) {
      const cached = readCache<T>(cacheKey(path));
      if (cached) return { data: cached, error: null };
    }
    return { data: null, error: "We could not reach JANCO. Check your connection and retry." };
  }
}

async function refreshSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const headers = new Headers({ "Content-Type": "application/json" });
  const csrf = getCookie("janco_csrf");
  if (csrf) headers.set("X-CSRF-Token", csrf);
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, { method: "POST", headers, credentials: "include", body: "{}", cache: "no-store" });
    if (!response.ok) return false;
    const body = await response.json();
    if (!body?.access_token) return false;
    session.set(body.access_token);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  login: (email: string, password: string) => request<{ access_token: string; refresh_token: string; user: Profile }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  signup: (email: string, password: string, full_name: string) => request<{ access_token: string; refresh_token: string; user: Profile }>("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, full_name, accepted_terms: true }) }),
  me: () => request<Profile>("/auth/me"),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  updateProfile: (body: Partial<Profile>) => request<{ message: string; profile: Profile }>("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
  requestPasswordReset: (email: string) => request<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) }),
  confirmPasswordReset: (token: string, new_password: string) => request<{ message: string }>("/auth/reset-password/confirm", { method: "POST", body: JSON.stringify({ token, new_password }) }),
  updatePassword: (password: string) => request<{ message: string }>("/auth/update-password", { method: "POST", body: JSON.stringify({ password }) }),
  services: async () => {
    const result = await request<{ services: Array<Record<string, unknown>> }>("/services/catalog");
    if (!result.data) return { data: SERVICES, error: result.error } as Result<Service[]>;
    const services = (result.data.services ?? []).map((item) => ({
      id: String(item.id), name: String(item.name), description: String(item.description ?? ""),
      priceFrom: Number(item.price_from ?? item.priceFrom ?? 0), duration: String(item.duration_label ?? item.duration ?? ""),
      inclusions: Array.isArray(item.inclusions) ? item.inclusions.map(String) : [],
      exclusions: Array.isArray(item.exclusions) ? item.exclusions.map(String) : [],
      recommendedSupplies: Array.isArray(item.recommended_supplies) ? item.recommended_supplies.map(String) : [],
      extras: Array.isArray(item.extras) ? item.extras.map((value) => typeof value === "object" && value ? ({ key: String((value as Record<string, unknown>).key), label: String((value as Record<string, unknown>).label), pricing_mode: ((value as Record<string, unknown>).pricing_mode === "per_item" ? "per_item" : "flat"), price: Number((value as Record<string, unknown>).price ?? 0), available: (value as Record<string, unknown>).available !== false } satisfies CatalogExtra) : ({ key: String(value).toLowerCase().replaceAll(" ", "_"), label: String(value), pricing_mode: "flat", price: 0, available: false } satisfies CatalogExtra)) : [], color: String(item.color ?? "#d5ef75"),
      available: item.available !== false,
    }));
    return { data: services, error: null } as Result<Service[]>;
  },
  submitWaitlist: (type: "customer" | "janitor", body: Record<string, unknown>, idempotencyKey: string) => request<{ entry_id: string; status: string; message: string; request_id?: string }>(`/waitlist/${type}`, { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify(body) }),
  quote: (body: Record<string, unknown>) => request<Quote>("/pricing/estimate", { method: "POST", body: JSON.stringify(body) }),
  createBooking: (body: Record<string, unknown>, idempotencyKey: string) => request<{ job: Job }>("/bookings", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ ...body, janitor_id: body.janitor_id ?? (typeof window !== "undefined" ? sessionStorage.getItem("janco.selectedJanitor") : null) }) }),
  bookings: () => request<{ jobs: Job[] }>("/bookings"),
  booking: (id: string) => request<Job>(`/bookings/${id}`),
  rebook: (id: string) => request<Record<string, unknown>>(`/bookings/${id}/rebook`),
  jobLocation: (id: string) => request<{ available: boolean; latitude?: number; longitude?: number; updated_at?: string; approximate?: boolean }>(`/bookings/${id}/location`),
  updateJobLocation: (id: string, latitude: number, longitude: number) => request<Job>(`/bookings/${id}/location`, { method: "PATCH", body: JSON.stringify({ latitude, longitude }) }),
  cancel: (id: string) => request<{ job: Job }>(`/bookings/${id}/cancel`, { method: "POST" }),
  assigned: () => request<{ jobs: Job[] }>("/bookings/assigned"),
  accept: (id: string) => request<{ job: Job }>(`/bookings/${id}/accept`, { method: "POST" }),
  reject: (id: string) => request<{ job: Job }>(`/bookings/${id}/reject`, { method: "POST" }),
  status: (id: string, new_status: string) => request<{ job: Job }>(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ new_status }) }),
  nearby: (lat: number, lng: number, service_type: string) => request<Janitor[]>(`/janitors/nearby?lat=${lat}&lng=${lng}&service_type=${encodeURIComponent(service_type)}`),
  janitor: (id: string) => request<Janitor>(`/janitors/${id}`),
  registerJanitor: (body: Record<string, unknown>) => request<{ message: string; janitor: Janitor }>("/janitors/register", { method: "POST", body: JSON.stringify(body) }),
  availability: (available: boolean, lat?: number, lng?: number) => request<Janitor>(`/janitors/me/availability?available=${available}${lat == null || lng == null ? "" : `&lat=${lat}&lng=${lng}`}`, { method: "PATCH" }),
  janitorEarnings: () => request<JanitorEarnings>("/janitors/me/earnings"),
  pay: (job_id: string, callback_url: string, idempotencyKey?: string) => request<{ authorization_url: string; reference: string; replayed?: boolean }>("/payments/initialize", { method: "POST", headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined, body: JSON.stringify({ job_id, callback_url }) }),
  verifyPayment: (reference: string) => request<{ status: string; job_id?: string }>(`/payments/${encodeURIComponent(reference)}/verify`),
  chat: (jobId: string) => request<{ messages: ChatMessage[] }>(`/chat/${jobId}/messages`),
  sendMessage: async (jobId: string, body: string) => {
    const result = await request<{ message: string; data: ChatMessage }>(`/chat/${jobId}/messages`, { method: "POST", body: JSON.stringify({ content: body }) });
    return result.data ? { data: { message: result.data.data }, error: null } : { data: null, error: result.error };
  },
  rate: (jobId: string, score: number, comment: string) => request<{ rating: Record<string, unknown> }>("/ratings", { method: "POST", body: JSON.stringify({ job_id: jobId, score, comment }) }),
  ratings: (janitorId: string) => request<RatingSummary>(`/ratings/janitor/${janitorId}`),
  pushToken: (push_token: string) => request<{ message: string }>("/auth/push-token", { method: "POST", body: JSON.stringify({ push_token }) }),
  registerWebPushSubscription: (body: { endpoint: string; keys: { p256dh: string; auth: string }; user_agent?: string }) => request<{ message: string }>("/auth/web-push-subscriptions", { method: "POST", body: JSON.stringify(body) }),
  deleteWebPushSubscription: (endpoint: string) => request<{ message: string }>(`/auth/web-push-subscriptions?endpoint=${encodeURIComponent(endpoint)}`, { method: "DELETE" }),
  notificationPreferences: () => request<Record<string, boolean>>("/auth/notification-preferences"),
  updateNotificationPreferences: (body: Record<string, boolean>) => request<Record<string, boolean>>("/auth/notification-preferences", { method: "PATCH", body: JSON.stringify(body) }),
  legal: (type: "terms" | "privacy") => request<{ doc_type: string; version: string; content_md: string }>(`/legal/${type}`),
  verificationStatus: () => request<{ status: string; verified_at?: string; retries_left?: number }>("/verification/status"),
  initiateVerification: (id_type: string, id_number: string) => request<{ status: string; message: string }>("/verification/initiate", { method: "POST", body: JSON.stringify({ id_type, id_number }) }),
  completeVerification: (id_type: "nin" | "bvn", id_number: string, image_base64: string) => request<{ status: string; message: string }>("/verification/complete", { method: "POST", body: JSON.stringify({ id_type, id_number, image_base64 }) }),
  resolveLocation: (address: string, landmark?: string) => request<{ address: string; landmark?: string; latitude?: number; longitude?: number; distance_km?: number; status: string }>("/locations/resolve", { method: "POST", body: JSON.stringify({ address, landmark: landmark || null }) }),
  createScanSession: (body: { service_type: string; room_label?: string; capture_mode?: "live" | "photo" | "manual"; client?: "web" | "expo" }) => request<ScanSession>("/scan/sessions", { method: "POST", body: JSON.stringify(body) }),
  finalizeScanSession: (sessionId: string, body: { consent: boolean; frames: Array<{ image_base64: string; width: number; height: number; orientation: "portrait" | "landscape" | "square"; captured_at?: string }>; manual_area_m2?: number; manual_clutter_level?: string }) => request<ScanResult>(`/scan/sessions/${encodeURIComponent(sessionId)}/finalize`, { method: "POST", body: JSON.stringify(body) }),
  cancelScanSession: (sessionId: string) => request<{ status: string }>(`/scan/sessions/${encodeURIComponent(sessionId)}/cancel`, { method: "POST" }),
  recurringSeries: () => request<Array<Record<string, unknown>>>("/recurring-series"),
  updateRecurringSeries: (id: string, status: string) => request<Record<string, unknown>>(`/recurring-series/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export function isAuthenticated() { return Boolean(session.access); }
