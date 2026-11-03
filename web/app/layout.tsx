/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the / shared layout for the customer and janitor PWA.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/app/globals.css, web/components/AuthProvider.tsx, web/components/PwaChrome.tsx, web/components/ServiceWorkerRegister.tsx, web/components/ToastProvider.tsx, web/components/WebTheme.tsx.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { InstallPrompt, NetworkStatus } from "@/components/PwaChrome";
import { WebTheme } from "@/components/WebTheme";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: { default: "JANCO | Clean spaces, happy faces", template: "%s | JANCO" },
  description: "Trusted, transparent home and office cleaning across Nigeria.",
  applicationName: "JANCO",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/logo.png" },
  appleWebApp: { capable: true, title: "JANCO", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#cddc39",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <WebTheme><AuthProvider><ToastProvider>
          {children}
          <NetworkStatus />
          <InstallPrompt />
        </ToastProvider></AuthProvider></WebTheme>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
