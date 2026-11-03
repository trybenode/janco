/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the use stats React hook for the admin application.
 * Why: It shares stateful behavior across interface components.
 * Uses or links to: janco-admin/lib/api.ts.
 * Imported or linked from: janco-admin/app/dashboard/analytics/page.tsx, janco-admin/app/dashboard/page.tsx.
 */

import { useQuery } from "@tanstack/react-query";
import { api, type AdminStats, type GrowthMetrics, type RevenueData, type AlertsResponse } from "@/lib/api";

export function useStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/v1/admin/stats"),
    refetchInterval: 60_000,
  });
}

export function useGrowthMetrics() {
  return useQuery<GrowthMetrics>({
    queryKey: ["growth-metrics"],
    queryFn: () => api.get("/v1/admin/growth-metrics"),
    refetchInterval: 120_000,
  });
}

export function useRevenueData(days: number = 14) {
  return useQuery<RevenueData>({
    queryKey: ["revenue", days],
    queryFn: () => api.get(`/v1/admin/revenue/daily?days=${days}`),
    refetchInterval: 120_000,
  });
}

export function useAlerts() {
  return useQuery<AlertsResponse>({
    queryKey: ["alerts"],
    queryFn: () => api.get("/v1/admin/alerts"),
    refetchInterval: 60_000,
  });
}
