/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Defines the booking flow's visible steps.
 * Why: Keeps step navigation and progress display in sync.
 * Used by: web/app/book/_hooks/useBooking.ts, web/app/book/_components/BookingProgress.tsx, and web/app/book/_components/BookingSummary.tsx.
 */
export const BOOKING_STEPS = ["Service", "Details", "Schedule", "Review"] as const;
