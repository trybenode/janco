/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Displays the customer's progress through the booking steps.
 * Why: Keeps the shared step labels and progress presentation together.
 * Uses: web/app/book/_lib/bookingConstants.ts.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { Check } from "lucide-react";
import { BOOKING_STEPS } from "../_lib/bookingConstants";

export function BookingProgress({ step }: { step: number }) {
  return <div className="stepper stepper-centered" aria-label="Booking progress">
    {BOOKING_STEPS.map((name, index) => <div className={`step ${index === step ? "active" : ""} ${index < step ? "done" : ""}`} key={name}>
      <b>{index < step ? <Check size={14}/> : index + 1}</b>{name}
    </div>)}
  </div>;
}
