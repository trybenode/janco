"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Composes the customer booking flow and its protected route.
 * Why: Keeps the route entry point focused on layout and step composition.
 * Uses: Shared navigation, the booking controller, and booking step components.
 * Used by: Next.js routing and booking links throughout the PWA.
 */

import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { BookingProgress } from "./_components/BookingProgress";
import { BookingSummary } from "./_components/BookingSummary";
import { ReviewStep } from "./_components/ReviewStep";
import { ScheduleStep } from "./_components/ScheduleStep";
import { ServiceStep } from "./_components/ServiceStep";
import { SpaceStep } from "./_components/SpaceStep";
import { useBooking } from "./_hooks/useBooking";

function BookingContent() {
  const booking = useBooking();

  return <div className="shell">
    <SiteNav portal active="Book"/>
    <main className="container portal-main">
      <MobileHeader title={booking.isGift ? "Gift a booking" : "Book a Service"}/>
      <div className="eyebrow booking-eyebrow">{booking.isGift ? "Gift a booking" : "Book a service"}</div>
      <h1 className="page-title">A cleaner space, without the guesswork.</h1>
      <p className="muted">Your quote stays visible while you choose the details that matter.</p>
      <BookingProgress step={booking.step}/>
      <div className="portal-grid booking-layout">
        <section className="card booking-selection-card">
          {booking.step === 0 && <ServiceStep booking={booking}/>}
          {booking.step === 1 && <SpaceStep booking={booking}/>}
          {booking.step === 2 && <ScheduleStep booking={booking}/>}
          {booking.step === 3 && <ReviewStep booking={booking}/>}
        </section>
        <BookingSummary booking={booking}/>
      </div>
    </main>
  </div>;
}

export default function BookingPage() {
  return <Protected><BookingContent/></Protected>;
}
