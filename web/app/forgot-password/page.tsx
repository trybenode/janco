"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /forgot-password page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/login/page.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/public/logo.png.
 * Imported or linked from: web/app/login/page.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { ToastMessage } from "@/components/ToastProvider";
import { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await api.requestPasswordReset(email.trim().toLowerCase());
    if (result.data) setSent(true);
    else setError(result.error ?? "We could not send the reset link yet.");
    setBusy(false);
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
        <h1>Reset Your Password</h1>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <ToastMessage message={error} />
          <button className="btn primary auth-submit" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
        {sent && (
          <p className="success" role="status">
            If an account exists for this email, a reset link has been sent.
          </p>
        )}
        <Link
          className="text-button"
          href="/login"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          Back to login
        </Link>
      </main>
    </div>
  );
}
