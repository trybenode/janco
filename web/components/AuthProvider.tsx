"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Restores and shares authenticated session and profile state with PWA screens.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/lib/api.ts, web/lib/offline.ts, web/lib/types.ts.
 * Imported or linked from: web/app/auth/callback/page.tsx, web/app/book/_hooks/useBooking.ts, web/app/janitor/profile/page.tsx, web/app/layout.tsx, web/app/login/page.tsx, web/app/portal/jobs/[id]/page.tsx, web/app/portal/page.tsx, web/app/portal/rate/[id]/page.tsx; 7 more in docs/file-inventory.md.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, session } from "@/lib/api";
import type { Profile } from "@/lib/types";
import { clearCachedChatHistory } from "@/lib/offline";

type AuthContextValue = { profile: Profile | null; loading: boolean; signIn: (email: string, password: string) => Promise<string | null>; signUp: (email: string, password: string, name: string) => Promise<string | null>; signOut: () => Promise<void>; refresh: () => Promise<void>; };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null); const [loading, setLoading] = useState(true);
  const refresh = async () => { setLoading(true); const result = await api.me(); if (result.data) setProfile(result.data); else { session.clear(); setProfile(null); } setLoading(false); };
  useEffect(() => { clearCachedChatHistory(); void refresh(); }, []);
  const value = useMemo<AuthContextValue>(() => ({ profile, loading, refresh, signIn: async (email, password) => { const result = await api.login(email.trim().toLowerCase(), password); if (!result.data) return result.error; session.set(result.data.access_token, result.data.refresh_token); setProfile(result.data.user); return null; }, signUp: async (email, password, name) => { const result = await api.signup(email.trim().toLowerCase(), password, name.trim()); if (!result.data) return result.error; session.set(result.data.access_token, result.data.refresh_token); const profileResult = await api.me(); setProfile(profileResult.data); return null; }, signOut: async () => { await api.logout(); session.clear(); setProfile(null); } }), [profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
