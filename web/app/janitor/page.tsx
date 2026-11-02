"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CircleAlert,
  MessageCircle,
  Power,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { RoleProtected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { api } from "@/lib/api";
import { label, money } from "@/lib/catalog";
import type { Job } from "@/lib/types";

function JanitorDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    const result = await api.assigned();
    if (result.data) setJobs(result.data.jobs ?? []);
    else setError(result.error ?? "Could not load assigned jobs");
  };
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const active = jobs.filter((job) =>
      ["confirmed", "in_progress"].includes(job.status),
    );
    if (!active.length) return;
    const publish = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          void Promise.all(
            active.map((job) =>
              api.updateJobLocation(
                job.id,
                position.coords.latitude,
                position.coords.longitude,
              ),
            ),
          );
        },
        () => undefined,
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 },
      );
    };
    publish();
    const timer = window.setInterval(publish, 30000);
    return () => window.clearInterval(timer);
  }, [jobs]);
  const toggle = async () => {
    setBusy(true);
    setError("");
    let coordinates: { latitude: number; longitude: number } | undefined;
    if (navigator.geolocation) {
      try {
        coordinates = await new Promise((resolve) =>
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            () => resolve(undefined),
            { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 },
          ),
        );
      } catch {
        coordinates = undefined;
      }
    }
    const result = await api.availability(
      !online,
      coordinates?.latitude,
      coordinates?.longitude,
    );
    if (result.data) setOnline(!online);
    else setError(result.error ?? "Availability could not be updated.");
    setBusy(false);
  };
  const update = async (id: string, status: string) => {
    setError("");
    const result = await api.status(id, status);
    if (result.data?.job)
      setJobs((current) =>
        current.map((job) => (job.id === id ? result.data!.job : job)),
      );
    else setError(result.error ?? "Could not update job");
  };
  const accept = async (id: string) => {
    const result = await api.accept(id);
    if (result.data?.job)
      setJobs((current) =>
        current.map((job) => (job.id === id ? result.data!.job : job)),
      );
    else setError(result.error ?? "Could not accept job");
  };
  const reject = async (id: string) => {
    const result = await api.reject(id);
    if (result.data?.job)
      setJobs((current) => current.filter((job) => job.id !== id));
    else setError(result.error ?? "Could not decline job");
  };
  return (
    <div className="shell">
      <SiteNav portal />
      <main className="container portal-main">
        <div className="toolbar">
          <div>
            <div className="eyebrow">Janitor workspace</div>
            <h1 className="page-title">Your workday, with less friction.</h1>
            <p className="muted">
              See assignments, accept the next job, and keep customers updated.
            </p>
          </div>
          <button
            className={`btn ${online ? "secondary" : "primary"}`}
            onClick={() => void toggle()}
            disabled={busy}
          >
            <Power size={16} />
            {busy ? "Updating…" : online ? "You’re online" : "Go online"}
          </button>
        </div>
        <div className="grid">
          <div className="card">
            <RefreshCw size={21} />
            <h3>Assigned jobs</h3>
            <strong style={{ fontSize: 32 }}>{jobs.length}</strong>
            <p className="muted">Pending and active work assigned to you.</p>
            <Link className="btn ghost" href="/janitor/schedule">
              <CalendarDays size={15} /> Schedule
            </Link>
          </div>
          <div className="card">
            <ShieldCheck size={21} />
            <h3>Trust profile</h3>
            <p className="muted">
              Keep your skills, verification, and availability current.
            </p>
            <Link className="btn ghost" href="/janitor/profile">
              View profile
            </Link>
          </div>
          <div className="card">
            <CircleAlert size={21} />
            <h3>Verification</h3>
            <p className="muted">
              Verified identity helps customers choose with confidence.
            </p>
            <Link className="btn ghost" href="/janitor/verification">
              Manage verification
            </Link>
          </div>
        </div>
        {error && (
          <div className="error" style={{ marginTop: 20 }} role="alert">
            {error}
          </div>
        )}
        <section style={{ marginTop: 36 }}>
          <div className="toolbar">
            <h2>Assigned jobs</h2>
            <button className="btn ghost" onClick={() => void load()}>
              Refresh
            </button>
          </div>
          <div className="job-list">
            {jobs.map((job) => (
              <div className="card" key={job.id}>
                <div className="toolbar" style={{ marginBottom: 8 }}>
                  <div>
                    <h3>{label(job.service_type)}</h3>
                    <p className="muted small">
                      {job.customer_name || "Customer"} ·{" "}
                      {job.scheduled_date
                        ? new Date(job.scheduled_date).toLocaleDateString(
                            "en-NG",
                          )
                        : "Date pending"}
                    </p>
                    <p className="muted small">
                      {job.address || "Address pending"} ·{" "}
                      {job.price ? money(job.price) : "Price pending"}
                    </p>
                  </div>
                  <span className={`status ${job.status}`}>
                    {label(job.status)}
                  </span>
                </div>
                <div className="actions">
                  {job.status === "pending" && (
                    <>
                      <button
                        className="btn secondary"
                        onClick={() => void accept(job.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn ghost"
                        onClick={() => void reject(job.id)}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {job.status === "confirmed" && (
                    <button
                      className="btn primary"
                      onClick={() => void update(job.id, "in_progress")}
                    >
                      Start job
                    </button>
                  )}
                  {job.status === "in_progress" && (
                    <button
                      className="btn secondary"
                      onClick={() => void update(job.id, "completed")}
                    >
                      Complete
                    </button>
                  )}
                  <Link className="btn ghost" href={`/portal/chat/${job.id}`}>
                    <MessageCircle size={15} /> Chat
                  </Link>
                </div>
              </div>
            ))}
            {!jobs.length && (
              <div className="card">
                <p className="muted">
                  No assignments yet. Going online helps dispatch find you when
                  work is available.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function JanitorPage() {
  return (
    <RoleProtected role="janitor">
      <JanitorDashboard />
    </RoleProtected>
  );
}
