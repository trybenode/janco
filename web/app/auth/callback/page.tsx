"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /auth/callback page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/AuthProvider.tsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AuthCallbackPage() { const router = useRouter(); const { profile, loading } = useAuth(); useEffect(() => { if (!loading) router.replace(profile ? (profile.is_registered === false ? "/registration" : "/portal") : "/login"); }, [loading, profile, router]); return <main className="container section"><div className="card"><h1>Finishing sign in…</h1><p className="lead">Your secure JANCO session is being restored.</p></div></main>; }
