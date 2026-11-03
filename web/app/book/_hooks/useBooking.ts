"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Manages booking draft state, server quotes, matching, and payment initiation.
 * Why: Keeps booking workflow and side effects separate from its presentation components.
 * Uses or links to: web/components/AuthProvider.tsx, web/lib/api.ts, web/lib/catalog.ts, web/lib/forms.ts, web/lib/security.ts, web/lib/types.ts.
 * Imported or linked from: web/app/book/page.tsx and booking presentation components.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { backendServiceType, serviceById, SERVICES } from "@/lib/catalog";
import { normalizePlainText } from "@/lib/forms";
import { isSafePaystackUrl, safeCallbackUrl } from "@/lib/security";
import type { Janitor, Quote, Service } from "@/lib/types";
import { BOOKING_STEPS } from "../_lib/bookingConstants";

type Draft = {
  serviceId: string;
  bedrooms: number;
  toilets: number;
  livingRooms: number;
  kitchens: number;
  clothesCount: number;
  extras: Record<string, boolean>;
  entryMode: "manual" | "scan";
  scanArea: number;
  scanId?: string;
  date: string;
  time: string;
  frequency: string;
  occurrenceLimit: number;
  address: string;
  landmark: string;
  access: string;
  notes: string;
  janitorId: string;
  isGift: boolean;
  giftRecipientName: string;
  giftRecipientPhone: string;
};

export function useBooking() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useAuth();
  const giftQuery = params.get("gift") === "true";
  const [isGift, setIsGift] = useState(giftQuery);
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [serviceId, setServiceId] = useState(
    params.get("service") ?? "house_cleaning",
  );
  const [bedrooms, setBedrooms] = useState(1);
  const [toilets, setToilets] = useState(1);
  const [livingRooms, setLivingRooms] = useState(1);
  const [kitchens, setKitchens] = useState(1);
  const [clothesCount, setClothesCount] = useState(10);
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [entryMode, setEntryMode] = useState<"manual" | "scan">("manual");
  const [scanArea, setScanArea] = useState(0);
  const [scanId, setScanId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [frequency, setFrequency] = useState("once");
  const [occurrenceLimit, setOccurrenceLimit] = useState(4);
  const [address, setAddress] = useState(
    isGift ? "" : (profile?.address ?? ""),
  );
  const [landmark, setLandmark] = useState(
    isGift ? "" : (profile?.landmark ?? ""),
  );
  const [access, setAccess] = useState("No special access instructions");
  const [notes, setNotes] = useState("");
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [giftRecipientPhone, setGiftRecipientPhone] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [janitors, setJanitors] = useState<Janitor[]>([]);
  const [selectedJanitor, setSelectedJanitor] = useState("");
  const [loading, setLoading] = useState(false);
  const [findingJanitors, setFindingJanitors] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const service = useMemo(
    () =>
      services.find((item) => item.id === serviceId) ?? serviceById(serviceId),
    [serviceId, services],
  );
  const rooms = bedrooms + livingRooms + kitchens;

  useEffect(() => {
    if (isGift) return;
    setAddress((current) => current || profile?.address || "");
    setLandmark((current) => current || profile?.landmark || "");
  }, [isGift, profile?.address, profile?.landmark]);

  useEffect(() => {
    void api.services().then((result) => {
      if (result.data?.length) setServices(result.data);
    });
    const saved = window.localStorage.getItem("janco.booking.draft");
    if (!saved) {
      setDraftReady(true);
      return;
    }
    try {
      const draft = JSON.parse(saved) as Partial<Draft>;
      if (draft.serviceId) setServiceId(draft.serviceId);
      if (draft.bedrooms != null) setBedrooms(draft.bedrooms);
      if (draft.toilets != null) setToilets(draft.toilets);
      if (draft.livingRooms != null) setLivingRooms(draft.livingRooms);
      if (draft.kitchens != null) setKitchens(draft.kitchens);
      if (draft.clothesCount != null) setClothesCount(draft.clothesCount);
      if (draft.extras) setExtras(draft.extras);
      if (draft.entryMode) setEntryMode(draft.entryMode);
      if (draft.scanArea != null) setScanArea(draft.scanArea);
      if (draft.scanId) setScanId(draft.scanId);
      if (draft.date) setDate(draft.date);
      if (draft.time) setTime(draft.time);
      if (draft.frequency) setFrequency(draft.frequency);
      if (draft.occurrenceLimit) setOccurrenceLimit(draft.occurrenceLimit);
      const draftMatchesMode =
        typeof draft.isGift !== "boolean" ? !isGift : draft.isGift === isGift;
      if (draft.address && draftMatchesMode) setAddress(draft.address);
      if (draft.landmark && draftMatchesMode) setLandmark(draft.landmark);
      if (draft.access) setAccess(draft.access);
      if (draft.notes) setNotes(draft.notes);
      if (draft.janitorId) setSelectedJanitor(draft.janitorId);
      if (draft.isGift === isGift) {
        if (draft.giftRecipientName)
          setGiftRecipientName(draft.giftRecipientName);
        if (draft.giftRecipientPhone)
          setGiftRecipientPhone(draft.giftRecipientPhone);
      }
      if (draft.isGift) setIsGift(true);
    } catch {
      window.localStorage.removeItem("janco.booking.draft");
    }
    setDraftReady(true);
  }, [isGift]);

  useEffect(() => {
    const rebookId = params.get("rebook");
    if (!rebookId) return;
    void api.rebook(rebookId).then((result) => {
      if (!result.data) return;
      const draft = result.data;
      if (typeof draft.service_type === "string")
        setServiceId(draft.service_type);
      if (typeof draft.rooms === "number")
        setBedrooms(Math.max(0, draft.rooms - livingRooms - kitchens));
      if (typeof draft.toilets === "number") setToilets(draft.toilets);
      if (draft.extras && typeof draft.extras === "object")
        setExtras(draft.extras as Record<string, boolean>);
      if (typeof draft.area_m2 === "number") {
        setEntryMode("scan");
        setScanArea(draft.area_m2);
      }
      if (typeof draft.address === "string" && draft.address)
        setAddress(draft.address);
      if (typeof draft.landmark === "string" && draft.landmark)
        setLandmark(draft.landmark);
      if (typeof draft.notes === "string") setNotes(draft.notes);
      if (isGift || draft.is_gift) {
        if (draft.is_gift) setIsGift(true);
        if (typeof draft.gift_recipient_name === "string")
          setGiftRecipientName(draft.gift_recipient_name);
        if (typeof draft.gift_recipient_phone === "string")
          setGiftRecipientPhone(draft.gift_recipient_phone);
      }
    });
  }, [isGift, kitchens, livingRooms, params]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("janco.scan.result");
    if (!stored) return;
    try {
      const scan = JSON.parse(stored) as { area_m2?: number; scan_id?: string };
      if (scan.area_m2 && scan.area_m2 > 0) {
        setEntryMode("scan");
        setScanArea(scan.area_m2);
      }
      if (scan.scan_id) setScanId(scan.scan_id);
    } catch {
      window.sessionStorage.removeItem("janco.scan.result");
    }
  }, []);

  useEffect(() => {
    const key =
      window.localStorage.getItem("janco.booking.idempotency") ??
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`);
    window.localStorage.setItem("janco.booking.idempotency", key);
    setDraftKey(key);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const draft: Draft = {
      serviceId,
      bedrooms,
      toilets,
      livingRooms,
      kitchens,
      clothesCount,
      extras,
      entryMode,
      scanArea,
      scanId,
      date,
      time,
      frequency,
      occurrenceLimit,
      address,
      landmark,
      access,
      notes,
      janitorId: selectedJanitor,
      isGift,
      giftRecipientName,
      giftRecipientPhone,
    };
    window.localStorage.setItem("janco.booking.draft", JSON.stringify(draft));
  }, [
    draftReady,
    serviceId,
    bedrooms,
    toilets,
    livingRooms,
    kitchens,
    clothesCount,
    extras,
    entryMode,
    scanArea,
    scanId,
    date,
    time,
    frequency,
    occurrenceLimit,
    address,
    landmark,
    access,
    notes,
    selectedJanitor,
    isGift,
    giftRecipientName,
    giftRecipientPhone,
  ]);

  const calculate = async () => {
    setLoading(true);
    setError("");
    const result = await api.quote({
      service_type: backendServiceType(serviceId),
      rooms,
      toilets,
      clothes_count: serviceId === "laundry" ? clothesCount : 0,
      extras: Object.fromEntries(
        Object.entries(extras).filter(([, enabled]) => enabled),
      ),
      use_fixed: true,
      surge: "normal",
      address: address || null,
      landmark: landmark || null,
      scan_id: scanId || null,
      use_scan: entryMode === "scan",
      area_m2: scanId ? null : scanArea || null,
    });
    if (result.data) setQuote(result.data);
    else
      setError(
        result.error ??
          "We could not calculate your quote. Check your details and retry.",
      );
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void calculate(), 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    serviceId,
    bedrooms,
    toilets,
    livingRooms,
    kitchens,
    clothesCount,
    extras,
    entryMode,
    scanArea,
    scanId,
    address,
    landmark,
  ]);

  const findJanitors = () => {
    setFindingJanitors(true);
    setError("");
    if (!navigator.geolocation) {
      setFindingJanitors(false);
      setError(
        "Location is unavailable. JANCO can still dispatch a verified janitor for you.",
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const result = await api.nearby(
          position.coords.latitude,
          position.coords.longitude,
          backendServiceType(serviceId),
        );
        if (result.data) setJanitors(result.data);
        else
          setError(
            result.error ?? "No janitors are available for this time yet.",
          );
        setFindingJanitors(false);
      },
      () => {
        setFindingJanitors(false);
        setError(
          "Location permission was not granted. JANCO can dispatch a verified janitor automatically.",
        );
      },
    );
  };

  const next = () => {
    setError("");
    if (step === 0 && !serviceId)
      return setError("Select a service to continue.");
    if (step === 1 && entryMode === "scan" && scanArea <= 0)
      return setError(
        "Enter the measured area or use the JANCO mobile room scan first.",
      );
    if (step === 2 && (!date || !address.trim()))
      return setError("Choose a date and provide the service address.");
    if (
      step === 2 &&
      isGift &&
      (!giftRecipientName.trim() || !giftRecipientPhone.trim())
    )
      return setError("Add your friend’s name and phone number to continue.");
    if (step < BOOKING_STEPS.length - 1) setStep((current) => current + 1);
  };

  const submit = async () => {
    if (!quote || !draftKey) return;
    if (!navigator.onLine) {
      setError(
        "Booking and payment require an internet connection. Your draft is saved on this device.",
      );
      return;
    }
    setLoading(true);
    setError("");
    const result = await api.createBooking(
      {
        service_type: backendServiceType(serviceId),
        scheduled_date: date,
        scheduled_time: time,
        frequency,
        recurrence:
          frequency === "once" ? null : { occurrence_limit: occurrenceLimit },
        address: normalizePlainText(address, 300),
        landmark: normalizePlainText(landmark, 200),
        scan_id: scanId || null,
        notes: normalizePlainText(
          `${notes}${notes ? "\n" : ""}Access: ${access}`,
          1000,
          true,
        ),
        rooms,
        toilets,
        clothes_count: clothesCount,
        extras: Object.fromEntries(
          Object.entries(extras).filter(([, enabled]) => enabled),
        ),
        janitor_id: selectedJanitor || null,
        is_gift: isGift,
        gift_recipient_name: isGift
          ? normalizePlainText(giftRecipientName, 80)
          : null,
        gift_recipient_phone: isGift
          ? normalizePlainText(giftRecipientPhone, 20)
          : null,
        use_scan: entryMode === "scan",
        area_m2: scanId ? null : entryMode === "scan" ? scanArea : null,
        latitude: null,
        longitude: null,
      },
      draftKey,
    );
    if (!result.data?.job) {
      setError(
        result.error ??
          "We could not create the booking. No payment was started.",
      );
      setLoading(false);
      return;
    }
    const payment = await api.pay(
      result.data.job.id,
      safeCallbackUrl(),
      `${draftKey}:payment`,
    );
    if (payment.data?.authorization_url) {
      if (!isSafePaystackUrl(payment.data.authorization_url)) {
        setError(
          "Payment could not be opened because the checkout address was not trusted.",
        );
        setLoading(false);
        return;
      }
      window.localStorage.removeItem("janco.booking.draft");
      window.localStorage.removeItem("janco.booking.idempotency");
      window.location.assign(payment.data.authorization_url);
      return;
    }
    setMessage(
      "Booking created. Payment confirmation is available from your job status page.",
    );
    window.localStorage.removeItem("janco.booking.draft");
    window.localStorage.removeItem("janco.booking.idempotency");
    router.push(`/portal/jobs/${result.data.job.id}`);
  };

  const selected = janitors.find(
    (janitor) => (janitor.janitor_id ?? janitor.id) === selectedJanitor,
  );
  const displayedServices = services.length ? services : SERVICES;

  const selectJanitor = (id: string) => {
    setSelectedJanitor(id);
    window.sessionStorage.setItem("janco.selectedJanitor", id);
  };

  return {
    step,
    setStep,
    isGift,
    displayedServices,
    serviceId,
    setServiceId,
    service,
    entryMode,
    setEntryMode,
    scanArea,
    setScanArea,
    clothesCount,
    setClothesCount,
    bedrooms,
    setBedrooms,
    toilets,
    setToilets,
    livingRooms,
    setLivingRooms,
    kitchens,
    setKitchens,
    extras,
    setExtras,
    giftRecipientName,
    setGiftRecipientName,
    giftRecipientPhone,
    setGiftRecipientPhone,
    frequency,
    setFrequency,
    occurrenceLimit,
    setOccurrenceLimit,
    date,
    setDate,
    time,
    setTime,
    address,
    setAddress,
    landmark,
    setLandmark,
    access,
    setAccess,
    notes,
    setNotes,
    rooms,
    quote,
    selected,
    janitors,
    selectedJanitor,
    selectJanitor,
    loading,
    findingJanitors,
    findJanitors,
    error,
    message,
    next,
    submit,
  };
}

export type BookingController = ReturnType<typeof useBooking>;
