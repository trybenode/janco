"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides the waitlist modal interface component for the customer and janitor PWA.
 * Why: It keeps shared interface behavior reusable and consistent.
 * Uses or links to: web/lib/api.ts.
 * Imported or linked from: web/components/LandingPage.tsx.
 */


import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { api } from "@/lib/api";

type WaitlistType = "customer" | "janitor";
type WaitlistForm = {
  first_name: string; last_name: string; email: string; phone: string; state_of_origin: string;
  lga: string; residential_address: string; service_types: string[]; experience_range: string;
  bio: string; has_own_equipment: "yes" | "no" | ""; consent: boolean;
};

const initialForm: WaitlistForm = {
  first_name: "", last_name: "", email: "", phone: "", state_of_origin: "", lga: "",
  residential_address: "", service_types: [], experience_range: "", bio: "", has_own_equipment: "", consent: false,
};
const states = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Edo", "Enugu", "Kaduna", "Delta", "Ogun", "Other"];
const services = [
  ["house_cleaning", "House cleaning"], ["deep_cleaning", "Deep cleaning"],
  ["post_construction", "Post-construction cleaning"], ["laundry", "Laundry"],
] as const;
const experience = [
  ["less_than_one_year", "Less than one year"], ["one_to_two_years", "1–2 years"],
  ["one_to_three_years", "1–3 years"], ["three_to_five_years", "3–5 years"],
  ["five_to_ten_years", "5–10 years"], ["ten_plus_years", "10+ years"], ["none", "None"],
] as const;

function normalize(value: string) {
  return value.normalize("NFKC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().replace(/\s+/g, " ");
}
function idempotencyKey() {
  return `waitlist-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

export function WaitlistModal({ type, onClose }: { type: WaitlistType; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WaitlistForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>("button, input, select, textarea"));
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setField = (key: keyof WaitlistForm, value: string | boolean | string[]) => setForm((current) => ({ ...current, [key]: value }));
  const required = (keys: string[]) => keys.reduce<Record<string, string>>((result, key) => {
    const value = form[key as keyof WaitlistForm];
    if ((typeof value === "string" && !value.trim()) || (Array.isArray(value) && value.length === 0) || value === false || value === "") result[key] = "Required";
    return result;
  }, {});

  const next = () => {
    const stepErrors = required(["first_name", "last_name", "state_of_origin", "lga", "residential_address", "phone"]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) { setStep(2); setMessage(""); }
    else setMessage("Please complete the required fields before continuing.");
  };

  const submit = async () => {
    const keys = type === "customer" ? ["email", "consent"] : ["email", "service_types", "experience_range", "bio", "has_own_equipment", "consent"];
    const nextErrors = required(keys);
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setMessage("Please complete the required fields before submitting."); return; }
    setBusy(true); setMessage("");
    const payload = {
      first_name: normalize(form.first_name), last_name: normalize(form.last_name), email: normalize(form.email).toLowerCase(),
      phone: normalize(form.phone), state_of_origin: normalize(form.state_of_origin), lga: normalize(form.lga),
      residential_address: normalize(form.residential_address), service_types: type === "janitor" ? form.service_types : [],
      experience_range: type === "janitor" ? form.experience_range : null, bio: type === "janitor" ? normalize(form.bio) : null,
      has_own_equipment: type === "janitor" ? form.has_own_equipment === "yes" : null, consent: form.consent,
      consent_version: "waitlist-v1", source: "landing_page",
    };
    const result = await api.submitWaitlist(type, payload, idempotencyKey());
    if (result.data) { setSubmitted(true); setMessage(result.data.message); }
    else setMessage(result.error ?? "We could not save your details. Please try again.");
    setBusy(false);
  };

  const fieldError = (key: string) => errors[key] ? <span className="form-error">{errors[key]}</span> : null;
  const label = (text: string, id: string) => <label htmlFor={id}>{text} <span aria-hidden="true">*</span><span className="sr-only">required</span></label>;

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className="waitlist-dialog" role="dialog" aria-modal="true" aria-labelledby="waitlist-title" aria-describedby="waitlist-description">
      <button className="modal-close" onClick={onClose} aria-label="Close waitlist form"><X size={20}/></button>
      {submitted ? <div className="waitlist-success"><div className="success-icon"><Check size={28}/></div><div className="eyebrow">You’re on the list</div><h2 id="waitlist-title">We’ll keep you posted.</h2><p id="waitlist-description">{message}</p><button className="btn primary" onClick={onClose}>Done</button></div> : <>
        <div className="waitlist-dialog-head"><div><div className="eyebrow">{type === "customer" ? "EARLY ACCESS" : "CLEAN TEAM"}</div><h2 id="waitlist-title">Join the waitlist</h2><p id="waitlist-description">{type === "customer" ? "Be first to know when JANCO opens in your area." : "Tell us a little about your cleaning experience."}</p></div><div className="form-progress" aria-label={`Step ${step} of 2`}><span className={step === 1 ? "active" : "done"}/><span className={step === 2 ? "active" : ""}/></div></div>
        <p className="required-legend"><span aria-hidden="true">*</span> Required</p>
        <div className="waitlist-scroll" aria-live="polite">
          {step === 1 ? <div className="modal-form-grid">
            <div className="field">{label("First name", "wait-first-name")}<input id="wait-first-name" value={form.first_name} onChange={(e) => setField("first_name", e.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.first_name)}/>{fieldError("first_name")}</div>
            <div className="field">{label("Last name", "wait-last-name")}<input id="wait-last-name" value={form.last_name} onChange={(e) => setField("last_name", e.target.value)} autoComplete="family-name" aria-invalid={Boolean(errors.last_name)}/>{fieldError("last_name")}</div>
            <div className="field">{label("State of origin", "wait-state")}<select id="wait-state" value={form.state_of_origin} onChange={(e) => setField("state_of_origin", e.target.value)}><option value="">Select state</option>{states.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("state_of_origin")}</div>
            <div className="field">{label("Local Government Area", "wait-lga")}<input id="wait-lga" list="wait-lga-options" value={form.lga} onChange={(e) => setField("lga", e.target.value)} placeholder="Enter LGA"/>{fieldError("lga")}<datalist id="wait-lga-options"><option value="Ikeja"/><option value="Lekki"/><option value="Yaba"/><option value="Port Harcourt"/><option value="Surulere"/></datalist></div>
            <div className="field full">{label("Current residential address", "wait-address")}<input id="wait-address" value={form.residential_address} onChange={(e) => setField("residential_address", e.target.value)} autoComplete="street-address" placeholder="Input text" aria-invalid={Boolean(errors.residential_address)}/>{fieldError("residential_address")}</div>
            <div className="field full">{label("Phone number", "wait-phone")}<input id="wait-phone" type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} autoComplete="tel" placeholder="Input text" aria-invalid={Boolean(errors.phone)}/>{fieldError("phone")}</div>
          </div> : <div className="modal-form-grid">
            <div className="field full">{label("Email address", "wait-email")}<input id="wait-email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} autoComplete="email" placeholder="name@example.com" aria-invalid={Boolean(errors.email)}/>{fieldError("email")}</div>
            {type === "janitor" && <>
              <fieldset className="field full"><legend>Services <span aria-hidden="true">*</span></legend><div className="choice-list">{services.map(([value, text]) => <label className={`choice ${form.service_types.includes(value) ? "selected" : ""}`} key={value}><input type="checkbox" checked={form.service_types.includes(value)} onChange={() => setField("service_types", form.service_types.includes(value) ? form.service_types.filter((item) => item !== value) : [...form.service_types, value])}/><span>{text}</span></label>)}</div>{fieldError("service_types")}</fieldset>
              <div className="field full">{label("Cleaning experience", "wait-experience")}<select id="wait-experience" value={form.experience_range} onChange={(e) => setField("experience_range", e.target.value)}><option value="">Select experience</option>{experience.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>{fieldError("experience_range")}</div>
              <div className="field full">{label("Write about yourself", "wait-bio")}<textarea id="wait-bio" value={form.bio} onChange={(e) => setField("bio", e.target.value)} placeholder="Tell us about your experience" rows={4}/>{fieldError("bio")}</div>
              <fieldset className="field full"><legend>Do you have your own cleaning equipment? <span aria-hidden="true">*</span></legend><div className="radio-row">{[["yes", "Yes"], ["no", "No"]].map(([value, text]) => <label className={`radio-choice ${form.has_own_equipment === value ? "selected" : ""}`} key={value}><input type="radio" name="equipment" value={value} checked={form.has_own_equipment === value} onChange={() => setField("has_own_equipment", value)}/>{text}</label>)}</div>{fieldError("has_own_equipment")}</fieldset>
            </>}
            <label className="consent full"><input type="checkbox" checked={form.consent} onChange={(e) => setField("consent", e.target.checked)}/><span>I agree to receive JANCO launch updates and understand I can opt out at any time. <span aria-hidden="true">*</span></span></label>{fieldError("consent")}
          </div>}
        </div>
        {message && !submitted && <p className="form-status" role="alert">{message}</p>}
        <div className="modal-actions">{step === 2 && <button className="btn ghost" onClick={() => { setStep(1); setErrors({}); setMessage(""); }}><ArrowLeft size={16}/> Back</button>}{step === 1 ? <button className="btn primary" onClick={next}>Next <ArrowRight size={16}/></button> : <button className="btn primary" onClick={() => void submit()} disabled={busy}>{busy ? "Submitting…" : "Join the waitlist"}</button>}</div>
      </>}
    </div>
  </div>;
}
