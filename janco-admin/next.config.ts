/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Configures or provides next config functionality for the admin application.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the "multiple lockfiles" workspace root warning
    root: __dirname,
  },
};

export default nextConfig;
