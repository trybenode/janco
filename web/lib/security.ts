const PAYSTACK_HOSTS = new Set(["paystack.com", "checkout.paystack.com"]);
const INTERNAL_PATH =
  /^\/(?:portal|book|services|pricing|janitor|login|support|offline)(?:[/?#].*)?$/;

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : null;
}

export function isSafeInternalPath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    INTERNAL_PATH.test(value) &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

export function isSafePaystackUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (PAYSTACK_HOSTS.has(url.hostname.toLowerCase()) ||
        url.hostname.toLowerCase().endsWith(".paystack.com"))
    );
  } catch {
    return false;
  }
}

export function safeCallbackUrl(): string {
  if (typeof window === "undefined") return "/payment/callback";
  return `${window.location.origin}/payment/callback`;
}
