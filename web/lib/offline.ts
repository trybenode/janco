import { getCookie } from "./security";

const PREFIX = "janco.web.cache.";
export function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(PREFIX + key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}
export function writeCache<T>(key: string, value: T) {
  if (typeof window !== "undefined")
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
}
export function clearSubjectCache(subject?: string | null) {
  if (typeof window === "undefined") return;
  const prefix = subject ? `${PREFIX}${subject}:` : PREFIX;
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(prefix) && key !== QUEUE_KEY)
      localStorage.removeItem(key);
  }
}

export function clearCachedChatHistory() {
  if (typeof window === "undefined") return;
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(PREFIX) && key.includes(":/chat/"))
      localStorage.removeItem(key);
  }
}

type QueuedMutation = {
  id: string;
  path: string;
  method: string;
  body: unknown;
  createdAt: string;
  subject?: string;
};
const QUEUE_KEY = PREFIX + "mutation-queue";
const MAX_QUEUE_ITEMS = 50;
const MAX_QUEUE_AGE_MS = 24 * 60 * 60 * 1000;
const SAFE_MUTATION = /^\/chat\/[A-Za-z0-9-]{20,64}\/messages$/;
export function enqueueSafeMutation(
  mutation: Omit<QueuedMutation, "id" | "createdAt" | "subject">,
) {
  if (typeof window === "undefined") return;
  if (
    mutation.method.toUpperCase() !== "POST" ||
    !SAFE_MUTATION.test(mutation.path)
  )
    return;
  if (
    !mutation.body ||
    typeof mutation.body !== "object" ||
    typeof (mutation.body as { content?: unknown }).content !== "string"
  )
    return;
  const content = String((mutation.body as { content: string }).content).trim();
  if (!content || content.length > 1000) return;
  const queue = readCache<QueuedMutation[]>("mutation-queue") ?? [];
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
  const fresh = queue.filter(
    (item) => Date.now() - Date.parse(item.createdAt) <= MAX_QUEUE_AGE_MS,
  );
  const subject = localStorage.getItem("janco.web.subject");
  if (!subject) return;
  fresh.push({
    ...mutation,
    body: { content },
    id,
    createdAt: new Date().toISOString(),
    subject,
  });
  localStorage.setItem(
    QUEUE_KEY,
    JSON.stringify(fresh.slice(-MAX_QUEUE_ITEMS)),
  );
}
export function readMutationQueue() {
  return (readCache<QueuedMutation[]>("mutation-queue") ?? []).filter(
    (item) => Date.now() - Date.parse(item.createdAt) <= MAX_QUEUE_AGE_MS,
  );
}
export function clearMutationQueue() {
  if (typeof window !== "undefined") localStorage.removeItem(QUEUE_KEY);
}

export async function flushSafeMutations(
  accessToken: string | null,
  apiUrl: string,
) {
  if (typeof window === "undefined" || !accessToken || !navigator.onLine)
    return;
  const queue = readMutationQueue();
  const subject = localStorage.getItem("janco.web.subject");
  const remaining: QueuedMutation[] = [];
  for (const mutation of queue) {
    try {
      if (!subject || mutation.subject !== subject) {
        remaining.push(mutation);
        continue;
      }
      if (
        !SAFE_MUTATION.test(mutation.path) ||
        mutation.method.toUpperCase() !== "POST"
      )
        continue;
      const csrf = getCookie("janco_csrf");
      const response = await fetch(`${apiUrl}${mutation.path}`, {
        method: mutation.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...(csrf ? { "X-CSRF-Token": csrf } : {}),
        },
        body: JSON.stringify(mutation.body),
      });
      if (response.status === 409) {
        const jobId = mutation.path.split("/")[2];
        const key = `janco.chat.draft.${jobId}`;
        const existing = localStorage.getItem(key);
        const content = (mutation.body as { content?: string }).content;
        if (content)
          localStorage.setItem(
            key,
            [existing, content].filter(Boolean).join("\n"),
          );
        window.dispatchEvent(
          new CustomEvent("janco:queue-conflict", {
            detail:
              "A saved message was not sent because the job is complete. You can still view its chat history.",
          }),
        );
        continue;
      }
      if (
        !response.ok &&
        (response.status === 408 ||
          response.status === 429 ||
          response.status >= 500)
      )
        remaining.push(mutation);
    } catch {
      remaining.push(mutation);
    }
  }
  if (remaining.length)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  else clearMutationQueue();
}
