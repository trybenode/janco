/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /offline page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/portal/page.tsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import Link from "next/link";
export default function OfflinePage() {
  return (
    <main className="container section">
      <div className="card">
        <div className="eyebrow">You’re offline</div>
        <h1 style={{ fontSize: 48 }}>JANCO is still here.</h1>
        <p className="lead">
          Previously opened pages and saved booking details may still be
          available. Reconnect before creating a booking or starting payment.
        </p>
        <Link className="btn primary" href="/portal">
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
