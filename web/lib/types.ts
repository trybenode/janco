/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines TypeScript contracts for profiles, bookings, quotes, janitors, chat, and PWA services.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: web/app/book/page.tsx, web/app/janitor/page.tsx, web/app/janitor/profile/page.tsx, web/app/janitor/schedule/page.tsx, web/app/nearby-janitors/page.tsx, web/app/portal/bookings/page.tsx, web/app/portal/chat/[jobId]/page.tsx, web/app/portal/jobs/[id]/page.tsx; 11 more in docs/file-inventory.md.
 */

export type Profile = {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  address?: string;
  landmark?: string;
  is_registered?: boolean;
  avatar_url?: string;
  lat?: number;
  lng?: number;
  trust_score?: number;
  trust_tier?: string;
  avg_rating?: number;
  is_verified?: boolean;
  service_types?: string[];
  experience?: string;
  bio?: string;
};

export type Job = {
  id: string;
  user_id?: string;
  service_type: string;
  status: string;
  payment_status: string;
  scheduled_date?: string;
  scheduled_time?: string;
  address?: string;
  landmark?: string;
  price?: number;
  transport_fee?: number;
  rooms?: number;
  toilets?: number;
  notes?: string;
  janitor_id?: string;
  created_at?: string;
  completed_at?: string;
  status_timestamps?: Record<string, string>;
  payment_reference?: string;
  frequency?: string;
  series_id?: string;
  occurrence_index?: number;
  scan_id?: string;
  extras?: Record<string, boolean>;
  area_m2?: number;
  worker_count?: number;
  duration_hours?: number;
  customer_name?: string;
  customer_phone?: string;
  is_gift?: boolean;
  gift_recipient_name?: string;
  gift_recipient_phone?: string;
};

export type Janitor = {
  id?: string;
  janitor_id?: string;
  full_name?: string;
  avatar_url?: string;
  avg_rating?: number;
  trust_score?: number;
  trust_tier?: string;
  is_verified?: boolean;
  service_types?: string[];
  skills?: string[];
  distance_km?: number;
  completed_jobs?: number;
  availability?: boolean;
  bio?: string;
};

export type Quote = {
  total: number;
  breakdown: string[];
  mode: string;
  surge_multiplier: number;
  transport_fee: number;
  duration_hours?: number;
  workers?: number;
  pricing_version?: string;
  base_amount?: number;
  extras_total?: number;
  discount?: number;
  price_adjustment?: number;
  expires_at?: string;
  distance_km?: number;
  location_status?: "resolved" | "unresolved" | "not_provided";
  location_address?: string;
};

export type ScanSession = {
  id: string;
  status: "active" | "finalized" | "cancelled" | "expired";
  expires_at: string;
};

export type ScanResult = {
  estimated_area: number;
  room_size: string;
  clutter_level: string;
  clutter_score: number;
  price_modifier: number;
  confidence: number;
  analysis_mode: string;
  details: string[];
  scan_id?: string;
  session_id?: string;
  warnings?: string[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  recommendedSupplies: string[];
  extras: CatalogExtra[];
  color: string;
  available?: boolean;
};

export type CatalogExtra = {
  key: string;
  label: string;
  pricing_mode: "flat" | "per_item";
  price: number;
  available: boolean;
};

export type EarningsPeriod = {
  completed_paid_jobs: number;
  gross_value: number;
  estimated_earnings: number;
  pending_jobs: number;
  pending_value: number;
};

export type JanitorEarnings = {
  currency: "NGN" | string;
  commission_rate: number;
  this_month: EarningsPeriod;
  lifetime: EarningsPeriod;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  job_id?: string;
  sender_id?: string;
  body: string;
  created_at?: string;
  sender_name?: string;
};

export type RatingSummary = {
  janitor_id: string;
  avg_rating: number;
  total_ratings: number;
  ratings: Array<Record<string, unknown>>;
};
