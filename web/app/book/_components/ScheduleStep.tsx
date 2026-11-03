/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Collects booking schedule, service location, and optional gift recipient details.
 * Why: Keeps the schedule form separate from persistence and booking submission.
 * Uses: The booking controller contract.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { Gift as GiftIcon } from "lucide-react";
import type { BookingController } from "../_hooks/useBooking";

type ScheduleStepProps = {
  booking: Pick<BookingController,
    | "isGift" | "giftRecipientName" | "setGiftRecipientName" | "giftRecipientPhone" | "setGiftRecipientPhone"
    | "frequency" | "setFrequency" | "occurrenceLimit" | "setOccurrenceLimit" | "date" | "setDate"
    | "time" | "setTime" | "address" | "setAddress" | "landmark" | "setLandmark"
    | "access" | "setAccess" | "notes" | "setNotes"
  >;
};

const today = () => new Date().toLocaleDateString("en-CA");

export function ScheduleStep({ booking }: ScheduleStepProps) {
  const {
    isGift, giftRecipientName, setGiftRecipientName, giftRecipientPhone, setGiftRecipientPhone,
    frequency, setFrequency, occurrenceLimit, setOccurrenceLimit, date, setDate, time, setTime,
    address, setAddress, landmark, setLandmark, access, setAccess, notes, setNotes,
  } = booking;

  return <>
    <h2>When and where?</h2>
    <p className="muted">A landmark and access note help your JANCO professional arrive prepared.</p>
    {isGift && <div className="gift-recipient-card">
      <div className="profile-card-heading"><GiftIcon/><h3>Gift recipient</h3></div>
      <p className="muted small">The purchaser pays for this booking. Your friend receives the service at the address below.</p>
      <div className="form-grid">
        <div className="field"><label htmlFor="gift-recipient-name">Friend’s name</label><input id="gift-recipient-name" value={giftRecipientName} onChange={(event) => setGiftRecipientName(event.target.value)} required/></div>
        <div className="field"><label htmlFor="gift-recipient-phone">Friend’s phone</label><input id="gift-recipient-phone" type="tel" value={giftRecipientPhone} onChange={(event) => setGiftRecipientPhone(event.target.value)} required/></div>
      </div>
    </div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="frequency">Frequency</label><select id="frequency" value={frequency} onChange={(event) => setFrequency(event.target.value)}>
        <option value="once">Once-off</option><option value="weekly">Weekly</option><option value="biweekly">Every two weeks</option><option value="monthly">Monthly</option>
      </select></div>
      {frequency !== "once" && <div className="field"><label htmlFor="occurrences">Number of visits</label><select id="occurrences" value={occurrenceLimit} onChange={(event) => setOccurrenceLimit(Number(event.target.value))}>
        <option value={2}>2 visits</option><option value={4}>4 visits</option><option value={8}>8 visits</option><option value={12}>12 visits</option>
      </select></div>}
      <div className="field"><label htmlFor="date">Date</label><input id="date" type="date" min={today()} value={date} onChange={(event) => setDate(event.target.value)}/></div>
      <div className="field"><label htmlFor="time">Arrival window</label><select id="time" value={time} onChange={(event) => setTime(event.target.value)}>
        <option value="09:00">9:00am – 12:00pm</option><option value="12:00">12:00pm – 3:00pm</option><option value="15:00">3:00pm – 6:00pm</option>
      </select></div>
      <div className="field full"><label htmlFor="address">{isGift ? "Friend’s service address" : "Service address"}</label><input id="address" placeholder="House number, street, area, city" value={address} onChange={(event) => setAddress(event.target.value)}/></div>
      <div className="field full"><label htmlFor="landmark">Nearby landmark</label><input id="landmark" placeholder="Gate colour, landmark, floor, call-on-arrival details" value={landmark} onChange={(event) => setLandmark(event.target.value)}/></div>
      <div className="field full"><label htmlFor="access">Access instructions</label><select id="access" value={access} onChange={(event) => setAccess(event.target.value)}>
        <option>No special access instructions</option><option>I’ll provide an access code</option><option>Please call the gate on arrival</option><option>I’ll meet the JANCO professional outside</option>
      </select></div>
      <div className="field full"><label htmlFor="notes">Anything else?</label><textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Fragile items, pets, preferences, or helpful context"/></div>
    </div>
  </>;
}
