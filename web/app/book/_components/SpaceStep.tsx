/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Collects room, scan, laundry, and extra details for a booking.
 * Why: Isolates the space step while keeping the server as the pricing source.
 * Uses: web/lib/catalog.ts and the booking controller contract.
 * Used by: web/app/book/page.tsx and web/tests/booking-components.test.mjs.
 */
import { ScanLine } from "lucide-react";
import { money } from "@/lib/catalog";
import type { BookingController } from "../_hooks/useBooking";

type SpaceStepProps = {
  booking: Pick<BookingController,
    | "entryMode" | "setEntryMode" | "scanArea" | "setScanArea" | "serviceId"
    | "clothesCount" | "setClothesCount" | "bedrooms" | "setBedrooms" | "toilets" | "setToilets"
    | "livingRooms" | "setLivingRooms" | "kitchens" | "setKitchens" | "service" | "extras" | "setExtras"
  >;
};

export function SpaceStep({ booking }: SpaceStepProps) {
  const {
    entryMode, setEntryMode, scanArea, setScanArea, serviceId, clothesCount, setClothesCount,
    bedrooms, setBedrooms, toilets, setToilets, livingRooms, setLivingRooms, kitchens, setKitchens,
    service, extras, setExtras,
  } = booking;

  return <>
    <h2>Tell us about your space</h2>
    <p className="muted">Manual details work everywhere. If you have used JANCO Room Scan, bring the measured area into this quote.</p>
    <div className="option-grid" style={{ marginBottom: 18 }}>
      <button type="button" className={`option ${entryMode === "manual" ? "selected" : ""}`} onClick={() => setEntryMode("manual")}>
        <strong>Manual entry</strong><span className="muted small">Fast and reliable on any device.</span>
      </button>
      <button type="button" className={`option ${entryMode === "scan" ? "selected" : ""}`} onClick={() => setEntryMode("scan")}>
        <strong><ScanLine size={15}/> Room scan</strong><span className="muted small">Use the mobile app or enter its result.</span>
      </button>
    </div>
    {entryMode === "scan" && <div className="info-callout" style={{ marginBottom: 18 }}>
      <ScanLine size={20}/>
      <div>
        <strong>AI-assisted measurement</strong>
        <div className="small">The scan informs the quote; JANCO never charges from an unexplainable estimate.</div>
        <label className="field" style={{ marginTop: 10, marginBottom: 0 }} htmlFor="area">
          <span>Measured area (m²)</span>
          <input id="area" type="number" min={1} value={scanArea || ""} onChange={(event) => setScanArea(Number(event.target.value))}/>
        </label>
      </div>
    </div>}
    {serviceId === "laundry" ? <div className="form-grid">
      <div className="field full"><label htmlFor="clothes">Laundry items</label><input id="clothes" type="number" min={1} value={clothesCount} onChange={(event) => setClothesCount(Number(event.target.value))}/></div>
    </div> : <div className="form-grid">
      <div className="field"><label htmlFor="bedrooms">Bedrooms</label><input id="bedrooms" type="number" min={0} value={bedrooms} onChange={(event) => setBedrooms(Number(event.target.value))}/></div>
      <div className="field"><label htmlFor="toilets">Bathrooms / toilets</label><input id="toilets" type="number" min={0} value={toilets} onChange={(event) => setToilets(Number(event.target.value))}/></div>
      <div className="field"><label htmlFor="living">Living rooms</label><input id="living" type="number" min={0} value={livingRooms} onChange={(event) => setLivingRooms(Number(event.target.value))}/></div>
      <div className="field"><label htmlFor="kitchen">Kitchens</label><input id="kitchen" type="number" min={0} value={kitchens} onChange={(event) => setKitchens(Number(event.target.value))}/></div>
    </div>}
    <h3 style={{ marginTop: 24 }}>Add extras</h3>
    <div className="check-list">{service.extras.filter((item) => item.available).map((item) => <label className="check choice-row" key={item.key}>
      <span>{item.label}<small className="muted" style={{ display: "block" }}>+ {money(item.price)}{item.pricing_mode === "per_item" ? " per item" : ""}</small></span>
      <input type="checkbox" checked={Boolean(extras[item.key])} onChange={(event) => setExtras((current) => ({ ...current, [item.key]: event.target.checked }))}/>
    </label>)}</div>
  </>;
}
