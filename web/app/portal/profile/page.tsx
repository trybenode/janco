"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /portal/profile page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/MobileHeader.tsx, web/components/ProfileScreen.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx.
 * Imported or linked from: web/app/portal/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { ProfileScreen } from "@/components/ProfileScreen";
function ProfilePage() { return <div className="shell"><SiteNav portal active="Profile"/><main className="mobile-canvas"><MobileHeader title="Profile"/><ProfileScreen/></main></div>; }
export default function PortalProfile() { return <RoleProtected role="customer"><ProfilePage/></RoleProtected>; }
