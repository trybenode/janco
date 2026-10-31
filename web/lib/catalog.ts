/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines PWA catalog display fallbacks, service lookup, and currency formatting.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: web/lib/types.ts.
 * Imported or linked from: web/app/book/page.tsx, web/app/janitor/page.tsx, web/app/janitor/schedule/page.tsx, web/app/portal/bookings/page.tsx, web/app/portal/jobs/[id]/page.tsx, web/app/portal/page.tsx, web/app/price-estimate/page.tsx, web/app/pricing/page.tsx; 3 more in docs/file-inventory.md.
 */

import type { CatalogExtra, Service } from "./types";

const extra = (key: string, label: string, price: number, pricing_mode: CatalogExtra["pricing_mode"] = "flat"): CatalogExtra => ({ key, label, price, pricing_mode, available: price > 0 });

export const SERVICES: Service[] = [
  { id: "house_cleaning", name: "Standard cleaning", description: "A dependable reset for bedrooms, bathrooms, kitchen, and living areas.", priceFrom: 5000, duration: "About 3 hours", inclusions: ["Dusting and mopping", "Bathroom and kitchen surfaces", "Beds, mirrors, and cobwebs"], exclusions: ["Exterior windows", "Heavy lifting", "Hazardous materials"], recommendedSupplies: ["Bin liners", "Fresh towels", "Surface-safe disinfectant"], extras: [extra("kitchen", "Kitchen", 2000), extra("living_room", "Living room", 1500), extra("window_cleaning", "Window cleaning", 1000), extra("ceiling_fan", "Ceiling fan", 500), extra("carpet_cleaning", "Carpet cleaning", 2000), extra("refrigerator", "Refrigerator", 2500), extra("oven", "Oven", 2500)], color: "#d5ef75" },
  { id: "deep_cleaning", name: "Deep cleaning", description: "A more thorough clean for homes that need extra attention and detail.", priceFrom: 12000, duration: "About 5 hours", inclusions: ["Everything in Standard", "Cabinets and appliances", "Hard-to-reach areas"], exclusions: ["Pest treatment", "Biohazard cleanup", "Exterior building work"], recommendedSupplies: ["Microfibre cloths", "Degreaser", "Soft scrub pads"], extras: [extra("oven", "Oven", 2500), extra("balcony", "Balcony", 1500), extra("exterior_windows", "Exterior windows", 2000), extra("wall_cleaning", "Wall cleaning", 2000)], color: "#c9d8fa" },
  { id: "move_in_cleaning", name: "Move-in cleaning", description: "Start fresh in a new space with a detailed top-to-bottom clean.", priceFrom: 22000, duration: "About 7 hours", inclusions: ["Empty-home deep clean", "Fixtures and fittings", "Kitchen and bathroom detail"], exclusions: ["Construction repairs", "Waste haulage", "Pest treatment"], recommendedSupplies: ["Dust masks", "Heavy-duty bin liners", "Floor protection"], extras: [extra("post_renovation_dust", "Post-renovation dust", 3000), extra("interior_windows", "Interior windows", 1500), extra("refrigerator", "Refrigerator", 2500), extra("oven", "Oven", 2500)], color: "#f7c3a8" },
  { id: "laundry", name: "Laundry & ironing", description: "Keep clothes moving with convenient laundry or ironing support.", priceFrom: 3500, duration: "Scheduled with your janitor", inclusions: ["Sorting and folding", "Careful handling", "Ironing by item count"], exclusions: ["Dry cleaning", "Stain removal guarantee"], recommendedSupplies: ["Laundry bags", "Care labels", "Hangers"], extras: [extra("ironing", "Ironing", 500, "per_item"), extra("delicates", "Delicates", 100, "per_item"), extra("express_turnaround", "Express turnaround", 1000), extra("wardrobe_organization", "Wardrobe organization", 2500)], color: "#e5d8fa" },
  { id: "post_construction", name: "Post-construction cleaning", description: "Clear dust, debris, and finishing mess after building or renovation work.", priceFrom: 18000, duration: "About 6 hours", inclusions: ["Fine dust removal", "Floors and surfaces", "Post-work bathroom and kitchen clean"], exclusions: ["Construction repairs", "Waste haulage", "Hazardous materials"], recommendedSupplies: ["Dust masks", "Heavy-duty bin liners", "Protective floor covers"], extras: [extra("interior_windows", "Interior windows", 1500), extra("paint_speck_removal", "Paint-speck removal", 3000), extra("cabinet_interiors", "Cabinet interiors", 1500)], color: "#d5ef75" },
];

export const serviceById = (id?: string) => SERVICES.find((service) => service.id === id) ?? SERVICES[0];
export const backendServiceType = (id: string) => id;
export const money = (value?: number) => `₦${Math.max(0, Number(value ?? 0)).toLocaleString("en-NG")}`;
export const label = (value?: string) => (value ?? "").replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
