/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Presents service selection and package inclusions for booking.
 * Why: Keeps the service step independent from booking workflow state.
 * Uses: web/lib/catalog.ts and the booking controller contract.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { Check } from "lucide-react";
import { money } from "@/lib/catalog";
import type { BookingController } from "../_hooks/useBooking";

type ServiceStepProps = {
  booking: Pick<BookingController, "displayedServices" | "serviceId" | "setServiceId" | "service">;
};

export function ServiceStep({ booking }: ServiceStepProps) {
  const { displayedServices, serviceId, setServiceId, service } = booking;

  return <>
    <h2>What would you like help with?</h2>
    <p className="muted">Choose a package. You can add extras after you tell us about the space.</p>
    <div className="option-grid">
      {displayedServices.map((item) => <button
        type="button"
        key={item.id}
        className={`option ${serviceId === item.id ? "selected" : ""}`}
        onClick={() => setServiceId(item.id)}
      >
        <strong>{item.name}</strong>
        <span className="muted small">{item.description}</span>
        <span className="small" style={{ display: "block", marginTop: 10 }}>Starting from {money(item.priceFrom)} · {item.duration}</span>
      </button>)}
    </div>
    <div className="card included-card">
      <h3>What is included</h3>
      <div className="check-list">{service.inclusions.map((item) => <div className="check" key={item}><Check size={15}/>{item}</div>)}</div>
      {service.exclusions.length > 0 && <p className="muted small" style={{ marginBottom: 0 }}>Not included: {service.exclusions.join(" · ")}</p>}
    </div>
  </>;
}
