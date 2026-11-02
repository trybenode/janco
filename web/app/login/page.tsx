"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /login page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/forgot-password/page.tsx, web/app/registration/page.tsx, web/components/AuthProvider.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/public/logo.png.
 * Imported or linked from: web/app/forgot-password/page.tsx, web/components/LandingPage.tsx, web/components/ProfileScreen.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { ToastMessage } from "@/components/ToastProvider";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { signIn, signUp, profile, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!loading && profile)
      router.replace(
        profile.is_registered === false
          ? "/registration"
          : profile.role === "janitor"
            ? "/janitor"
            : "/portal",
      );
  }, [loading, profile, router]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password, name);
    if (result) {
      setError(result);
      setBusy(false);
      return;
    }
    const me = await api.me();
    setBusy(false);
    if (me.data?.is_registered === false) {
      router.push("/registration");
      return;
    }
    router.push(me.data?.role === "janitor" ? "/janitor" : "/portal");
  };
  return (
    <div className="shell">
      <SiteNav />
      <main className="auth-screen">
        <div className="auth-logo">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="JANCO"
            priority
          />
        </div>
        <h1>
          {mode === "login" ? "Login to Get Started" : "Create Your Account"}
        </h1>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span className="muted small">
              Minimum 8 characters, one uppercase letter, and one number.
            </span>
          </div>
          <ToastMessage message={error} />
          {mode === "login" && (
            <Link className="text-button" href="/forgot-password">
              Forgot password?
            </Link>
          )}
          <button className="btn primary auth-submit" disabled={busy}>
            {busy ? "Loading…" : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="auth-links">
          <span className="muted">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            className="text-button"
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </div>
      </main>
    </div>
  );
}
