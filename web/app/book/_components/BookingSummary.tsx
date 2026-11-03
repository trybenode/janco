/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Displays the server quote, booking navigation, and feedback.
 * Why: Keeps quote and action presentation separate from workflow logic.
 * Uses: Shared action and toast components, the booking controller contract, and catalog formatting.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { ArrowLeft, ArrowRight, CircleHelp } from "lucide-react";
import { ActionRow } from "@/components/ActionRow";
import { ToastMessage } from "@/components/ToastProvider";
import { money } from "@/lib/catalog";
import type { BookingController } from "../_hooks/useBooking";
import { BOOKING_STEPS } from "../_lib/bookingConstants";

type BookingSummaryProps = {
  booking: Pick<BookingController, "quote" | "service" | "step" | "setStep" | "loading" | "next" | "submit" | "error" | "message">;
};

export function BookingSummary({ booking }: BookingSummaryProps) {
  const { quote, service, step, setStep, loading, next, submit, error, message } = booking;

  return <aside className="card summary booking-summary">
    <div className="eyebrow">Live estimate</div>
    <h2 style={{ fontSize: 32 }}>{quote ? money(quote.total) : "—"}</h2>
    <p className="muted small">Calculated by JANCO’s server-side pricing engine.</p>
    <div className="summary-row"><span>Service base</span><strong>{money(quote?.base_amount ?? 0)}</strong></div>
    <div className="summary-row"><span>Extras</span><strong>{money(quote?.extras_total ?? 0)}</strong></div>
    <div className="summary-row"><span>Transport</span><strong>{money(quote?.transport_fee ?? 0)}</strong></div>
    <div className="summary-row"><span>Discount</span><strong>{quote?.discount ? `-${money(quote.discount)}` : money(0)}</strong></div>
    {quote?.price_adjustment ? <div className="summary-row"><span>Pricing adjustment</span><strong>{quote.price_adjustment > 0 ? money(quote.price_adjustment) : `-${money(Math.abs(quote.price_adjustment))}`}</strong></div> : null}
    <div className="summary-row"><span>Estimated duration</span><strong>{quote?.duration_hours ? `${quote.duration_hours} hrs` : service.duration}</strong></div>
    <div className="summary-row"><span>Worker count</span><strong>{quote?.workers ?? 1}</strong></div>
    <div className="summary-total"><span>Total</span><span>{quote ? money(quote.total) : "—"}</span></div>
    {quote?.breakdown?.length ? <details className="quote-breakdown"><summary>How this was calculated</summary><div className="check-list">
      {quote.breakdown.map((item, index) => <div className="check" key={`${item}-${index}`}>{item}</div>)}
    </div></details> : null}
    {quote?.expires_at && <p className="muted small">Estimate valid until {new Date(quote.expires_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.</p>}
    <div className="sticky-actions"><ActionRow count={step === 0 ? 1 : 2}>
      {step > 0 && <button className="btn ghost" disabled={loading} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={15}/> Back</button>}
      {step < BOOKING_STEPS.length - 1 ? <button className="btn primary" disabled={loading} onClick={next}>Continue <ArrowRight size={15}/></button> : <button className="btn secondary" disabled={loading || !quote} onClick={() => void submit()}>{loading ? "Securing…" : "Confirm & pay"}</button>}
    </ActionRow></div>
    <ToastMessage message={error}/><ToastMessage message={message} kind="success"/>
    <p className="muted small" style={{ marginBottom: 0 }}><CircleHelp size={14}/> Need help? <a href="mailto:support@janco.app" style={{ textDecoration: "underline" }}>Contact support</a></p>
  </aside>;
}
