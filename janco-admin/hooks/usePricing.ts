/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the use pricing React hook for the admin application.
 * Why: It shares stateful behavior across interface components.
 * Uses or links to: janco-admin/lib/api.ts.
 * Imported or linked from: janco-admin/app/dashboard/pricing/page.tsx.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PricingConfig, type PricingResponse } from "@/lib/api";
import { toast } from "sonner";

export function usePricing() {
  return useQuery<PricingConfig>({
    queryKey: ["pricing"],
    // API returns { config: { room_rate: 1000, ... } } — unwrap to flat dict
    queryFn: () =>
      api.get<PricingResponse>("/v1/admin/pricing").then((r) => r.config),
  });
}

export function useUpdatePricing() {
  const qc = useQueryClient();
  return useMutation({
    // Backend expects { updates: { "room_rate": 1200, ... } }
    mutationFn: (updates: PricingConfig) =>
      api.patch("/v1/admin/pricing", { updates }),
    onSuccess: () => {
      toast.success("Pricing updated");
      qc.invalidateQueries({ queryKey: ["pricing"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
