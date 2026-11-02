"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /payment/callback page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/portal/page.tsx, web/components/MobileHeader.tsx, web/lib/api.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { MobileHeader } from "@/components/MobileHeader";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
export default function PaymentCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your payment securely…");
  useEffect(() => {
    const ref = params.get("reference") || params.get("trxref");
    if (!ref) {
      setMessage(
        "No payment reference was found. Your booking is still available from the dashboard.",
      );
      return;
    }
    void api.verifyPayment(ref).then((result) => {
      if (result.data?.job_id)
        router.replace(`/portal/jobs/${result.data.job_id}`);
      else
        setMessage(
          result.error ??
            "Payment confirmation is taking longer than expected. Refresh shortly.",
        );
    });
  }, [params, router]);
  return (
    <main className="container section" style={{ maxWidth: 620 }}>
      <MobileHeader title="Payment status" />
      <div className="card">
        <div className="eyebrow">Payment status</div>
        <h1 style={{ fontSize: 45 }}>Almost there.</h1>
        <p className="lead">{message}</p>
        <Link className="btn primary" href="/portal">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
