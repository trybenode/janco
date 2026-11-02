/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the /legal/terms page for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/LegalDocument.tsx.
 * Imported or linked from: web/components/ProfileScreen.tsx.
 * Entry point: Framework-discovered Next.js entry point.
 */

import { LegalDocument } from "@/components/LegalDocument";
export default function Terms() {
  return <LegalDocument type="terms" title="Terms of service" />;
}
