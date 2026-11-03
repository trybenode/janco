/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Displays the booking review and available janitor choices.
 * Why: Keeps review presentation separate from matching and submission logic.
 * Uses: The booking controller contract.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { Gift as GiftIcon, MapPin, ShieldCheck, Star, UserRound } from "lucide-react";
import type { BookingController } from "../_hooks/useBooking";

type ReviewStepProps = {
  booking: Pick<BookingController,
    | "service" | "rooms" | "toilets" | "address" | "date" | "time" | "frequency" | "access"
    | "isGift" | "giftRecipientName" | "giftRecipientPhone" | "findJanitors" | "findingJanitors"
    | "selected" | "janitors" | "selectedJanitor" | "selectJanitor"
  >;
};

export function ReviewStep({ booking }: ReviewStepProps) {
  const {
    service, rooms, toilets, address, date, time, frequency, access, isGift, giftRecipientName,
    giftRecipientPhone, findJanitors, findingJanitors, selected, janitors, selectedJanitor, selectJanitor,
  } = booking;

  return <>
    <h2>Review before you confirm</h2>
    <p className="muted">We create the booking on JANCO, then take you to secure Paystack checkout. Booking and payment are never completed while offline.</p>
    <div className="check-list">
      <div className="check"><ShieldCheck size={18}/><span><strong>{service.name}</strong><br/><span className="muted small">{rooms} space(s), {toilets} bathroom(s), {address || "Address pending"}</span></span></div>
      <div className="check"><MapPin size={18}/><span><strong>{date || "Date pending"} · {time}</strong><br/><span className="muted small">{frequency === "once" ? "Once-off" : `Repeats ${frequency}`} · {access}</span></span></div>
      {isGift && <div className="check"><GiftIcon size={18}/><span><strong>Gift for {giftRecipientName || "your friend"}</strong><br/><span className="muted small">{giftRecipientPhone || "Phone pending"} · Service at the recipient’s address</span></span></div>}
    </div>
    <div className="card review-matching-card">
      <div className="toolbar" style={{ marginBottom: 8 }}>
        <div><h3 style={{ marginBottom: 4 }}>Choose a verified janitor</h3><p className="muted small" style={{ margin: 0 }}>You can select one when location permission is available, or let intelligent dispatch match you fairly.</p></div>
        <UserRound size={22}/>
      </div>
      <button type="button" className="btn ghost" onClick={findJanitors} disabled={findingJanitors}>{findingJanitors ? "Finding…" : "Show available janitors"}</button>
      {selected && <div className="trust-card" style={{ marginTop: 14 }}>
        <div className="avatar">{selected.full_name?.slice(0, 1) ?? "J"}</div>
        <div><strong>{selected.full_name || "Verified JANCO janitor"}</strong>
          <div className="rating"><Star size={14} fill="currentColor"/> {Number(selected.avg_rating ?? 0).toFixed(1)} · TrustScore {Math.round(Number(selected.trust_score ?? 0))}</div>
          <div className="muted small">{selected.is_verified ? "Identity verified" : "Eligible for dispatch"} · {selected.distance_km ? `${selected.distance_km.toFixed(1)} km away` : "Availability confirmed"}</div>
        </div>
      </div>}
      {janitors.length > 0 && <div className="check-list" style={{ marginTop: 14 }}>{janitors.map((janitor) => {
        const id = janitor.janitor_id ?? janitor.id ?? "";
        return <label className="check choice-row" key={id}>
          <span className="trust-card"><span className="avatar">{janitor.full_name?.slice(0, 1) ?? "J"}</span><span><strong>{janitor.full_name || "Verified janitor"}</strong><br/><span className="muted small">{janitor.is_verified ? "Verified" : "Eligible"} · ★ {Number(janitor.avg_rating ?? 0).toFixed(1)} · {janitor.distance_km?.toFixed(1) ?? "—"} km</span></span></span>
          <input type="radio" name="janitor" checked={selectedJanitor === id} onChange={() => selectJanitor(id)}/>
        </label>;
      })}</div>}
    </div>
  </>;
}
