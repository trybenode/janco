import { api } from "./api";

function urlBase64ToUint8Array(value: string): Uint8Array {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const decoded = atob(
    `${value.replace(/-/g, "+").replace(/_/g, "/")}${padding}`,
  );
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

export async function enableBrowserPush(): Promise<{
  ok: boolean;
  message: string;
}> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey)
    return {
      ok: false,
      message: "Browser notifications are not configured for this environment.",
    };
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return {
      ok: false,
      message: "This browser does not support push notifications.",
    };
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted")
    return { ok: false, message: "Notification permission was not granted." };
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      publicKey,
    ) as unknown as BufferSource,
  });
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth)
    return {
      ok: false,
      message: "The browser returned an incomplete push subscription.",
    };
  const result = await api.registerWebPushSubscription({
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    user_agent: navigator.userAgent,
  });
  return result.data
    ? { ok: true, message: "Browser notifications enabled." }
    : {
        ok: false,
        message: result.error ?? "Could not register browser notifications.",
      };
}

export async function disableBrowserPush(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!("serviceWorker" in navigator))
    return { ok: false, message: "Service workers are unavailable." };
  const subscription = await (
    await navigator.serviceWorker.ready
  ).pushManager.getSubscription();
  if (!subscription)
    return { ok: true, message: "Browser notifications are already disabled." };
  const endpoint = subscription.endpoint;
  const result = await api.deleteWebPushSubscription(endpoint);
  if (!result.data)
    return {
      ok: false,
      message: result.error ?? "Could not disable browser notifications.",
    };
  await subscription.unsubscribe();
  return { ok: true, message: "Browser notifications disabled." };
}
