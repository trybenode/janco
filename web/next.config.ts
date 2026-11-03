/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Configures or provides next config functionality for the customer and janitor PWA.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 */

import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";
const scriptSources = `'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`;
const localApiSources = isDevelopment
  ? " http://localhost:8000 http://127.0.0.1:8000 ws://localhost:8000 ws://127.0.0.1:8000"
  : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  typedRoutes: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://checkout.paystack.com https://paystack.com; script-src ${scriptSources}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:${localApiSources}; worker-src 'self'; manifest-src 'self'; frame-src 'self' https://checkout.paystack.com https://paystack.com;` },
      ],
    }];
  },
};

export default nextConfig;
