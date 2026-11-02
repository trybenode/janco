"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /janitor/profile page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/AuthProvider.tsx, web/components/MobileHeader.tsx, web/components/ProfileScreen.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/lib/api.ts, web/lib/types.ts.
 * Imported or linked from: web/app/janitor/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { useEffect, useState } from "react";
import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { ProfileScreen } from "@/components/ProfileScreen";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import type { Janitor } from "@/lib/types";
function ProfilePage() { const { profile } = useAuth(); const [janitor, setJanitor] = useState<Janitor | null>(null); useEffect(() => { if (profile?.id) void api.janitor(profile.id).then((result) => setJanitor(result.data)); }, [profile?.id]); return <div className="shell"><SiteNav portal/><main className="mobile-canvas"><MobileHeader title="Profile"/><ProfileScreen janitor={janitor}/></main></div>; }
export default function JanitorProfile() { return <RoleProtected role="janitor"><ProfilePage/></RoleProtected>; }
