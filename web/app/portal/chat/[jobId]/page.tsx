"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Shows job messages and disables sending after a job is completed.
 * Why: It makes this interface available through the application router.
 * Uses or links to: web/components/MobileHeader.tsx, web/components/Protected.tsx, web/components/SiteNav.tsx, web/components/ToastProvider.tsx, web/lib/api.ts, web/lib/forms.ts, web/lib/offline.ts, web/lib/types.ts.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, WifiOff } from "lucide-react";
import { useParams } from "next/navigation";
import { Protected } from "@/components/Protected";
import { SiteNav } from "@/components/SiteNav";
import { MobileHeader } from "@/components/MobileHeader";
import { ToastMessage } from "@/components/ToastProvider";
import { api } from "@/lib/api";
import { enqueueSafeMutation } from "@/lib/offline";
import { normalizePlainText } from "@/lib/forms";
import type { ChatMessage } from "@/lib/types";

function ChatContent() {
  const { jobId } = useParams<{jobId: string}>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState(true);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [historyExpired, setHistoryExpired] = useState(false);
  const draftKey = `janco.chat.draft.${jobId}`;
  const bottom = useRef<HTMLDivElement>(null);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update); window.addEventListener("offline", update);
    const saved = window.localStorage.getItem(draftKey); if (saved) setContent(saved);
    void api.chat(jobId).then((result) => { if (result.data) setMessages(result.data.messages ?? []); else setError(result.error ?? "Messages are unavailable right now."); });
    const checkJob = () => { void api.booking(jobId).then((result) => { if (result.data) { setJobStatus(result.data.status); const expired = result.data.status === "completed" && !!result.data.completed_at && Date.now() >= Date.parse(result.data.completed_at) + 7 * 24 * 60 * 60 * 1000; setHistoryExpired(expired); if (expired) setMessages([]); } else setError(result.error ?? "Unable to check this booking."); }); };
    checkJob();
    const timer = window.setInterval(checkJob, 15000);
    const access = sessionStorage.getItem("janco.web.access");
    const wsUrl = `${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/v1").replace(/^http/, "ws")}/chat/ws/${jobId}`;
    if (access && navigator.onLine) {
      const live = new WebSocket(wsUrl); socket.current = live;
      live.addEventListener("open", () => live.send(JSON.stringify({ type: "auth", token: access })));
      live.addEventListener("message", (event) => { try { const payload = JSON.parse(event.data) as { type?: string; data?: ChatMessage }; if (payload.type === "message" && payload.data) setMessages((current) => current.some((item) => item.id === payload.data?.id) ? current : [...current, payload.data!]); } catch { /* Ignore malformed live events; HTTP remains the source of truth. */ } });
      live.addEventListener("error", () => setError("Live chat is reconnecting. Messages can still be sent securely."));
    }
    return () => { window.clearInterval(timer); window.removeEventListener("online", update); window.removeEventListener("offline", update); socket.current?.close(); socket.current = null; };
  }, [draftKey, jobId]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (content) window.localStorage.setItem(draftKey, content); else window.localStorage.removeItem(draftKey); }, [content, draftKey]);

  const send = async (event: FormEvent) => {
    event.preventDefault(); const safeContent = normalizePlainText(content, 1000, true); if (!safeContent || sending) return;
    if (jobStatus !== "confirmed" && jobStatus !== "in_progress" && jobStatus !== "pending") { setError("This job is complete. You can still read previous messages."); return; }
    if (!navigator.onLine) { enqueueSafeMutation({ path: `/chat/${jobId}/messages`, method: "POST", body: { content: safeContent } }); setContent(""); setError("You’re offline. The message is queued and will send when you reconnect."); return; }
    setSending(true); setError("");
    const latest = await api.booking(jobId);
    if (!latest.data || latest.data.status === "completed") { setJobStatus(latest.data?.status ?? null); setError(latest.data ? "This job is complete. You can still read previous messages." : "We could not check the job status. Your message is saved as a draft."); setSending(false); return; }
    const result = await api.sendMessage(jobId, safeContent);
    if (result.data?.message) { setMessages((current) => [...current, result.data!.message]); setContent(""); }
    else setError(result.error ?? "Message could not be sent.");
    setSending(false);
  };

  return <div className="shell">
    <SiteNav portal/>
    <main className="container portal-main">
      <MobileHeader title="Job chat"/>
      <p className="muted">Coordinate respectfully and keep personal details private.</p>
      {!online && <div className="banner"><WifiOff size={15}/> You are offline. Sending is paused; your draft is saved.</div>}
      <section className="card" style={{minHeight:420,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div className="job-list" aria-live="polite">
          {messages.map((message) => {
            const contentText = message.body || ((message as ChatMessage & { content?: string }).content ?? "");
            return <div className="check" key={message.id}><span><strong className="small">{message.sender_name || "JANCO contact"}</strong><br/>{contentText}<br/><span className="muted small">{message.created_at ? new Date(message.created_at).toLocaleString("en-NG") : ""}</span></span></div>;
          })}
          {!messages.length && <p className="muted">No messages yet. Say hello when your booking is confirmed.</p>}
          <div ref={bottom}/>
        </div>
        {jobStatus === "completed" && <p className="muted">{historyExpired ? "Chat history has expired and is no longer available." : "This job is complete. Chat history is read-only and is cleared seven days after completion."}</p>}
        <form onSubmit={send} style={{display:"flex",gap:8,marginTop:20}}>
          <label className="sr-only" htmlFor="message">Message</label>
          <input id="message" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write a message" maxLength={1000} disabled={jobStatus === "completed" || !jobStatus} style={{flex:1,minWidth:0,minHeight:48,border:"1px solid var(--outline)",borderRadius:8,padding:"8px 12px",background:"var(--surface)",color:"var(--on-surface)"}}/>
          <button aria-label="Send message" className="btn primary" style={{minWidth:48,padding:0}} disabled={sending || !online || !jobStatus || jobStatus === "completed"}><Send size={17}/></button>
        </form>
        <ToastMessage message={error}/>
      </section>
    </main>
  </div>;
}

export default function ChatPage() { return <Protected><ChatContent/></Protected>; }
