/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /legal/privacy page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/LegalDocument.tsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { LegalDocument } from "@/components/LegalDocument";
export default function Privacy() {
  return <LegalDocument type="privacy" title="Privacy policy" />;
}
