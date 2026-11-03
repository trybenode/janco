/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the / page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/LandingPage.tsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { LandingPage } from "@/components/LandingPage";

export default function HomePage() {
  return <LandingPage />;
}
