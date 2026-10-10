import { openExternalWindow } from "./externalLinks.mjs";

export const CONTACT_TIMEOUT_MS = 12_000;

export function resolveSecureUrl(value) {
  if (typeof value !== "string") return "";

  const candidate = value.trim();

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && !url.username && !url.password ? candidate : "";
  } catch {
    return "";
  }
}

export function resolveContactEndpoint(endpoint, privacyPolicyUrl) {
  const secureEndpoint = resolveSecureUrl(endpoint);
  return secureEndpoint && resolveSecureUrl(privacyPolicyUrl) ? secureEndpoint : "";
}

export async function deliverContact(
  { endpoint, payload, gmailComposeUrl },
  { fetchFn = globalThis.fetch, openWindow } = {},
) {
  if (endpoint) {
    if (typeof fetchFn !== "function") return { status: "error", reason: "network" };

    const controller = new AbortController();
    const deadline = Date.now() + CONTACT_TIMEOUT_MS;
    const timeoutResult = { status: "error", reason: "timeout" };
    let expired = false;
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => {
        expired = true;
        // Resolver antes do abort mantém o motivo timeout, mesmo se fetch rejeitar.
        resolve(timeoutResult);
        controller.abort();
      }, CONTACT_TIMEOUT_MS);
    });

    try {
      const request = (async () => {
        try {
          const response = await fetchFn(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          if (expired || Date.now() >= deadline) return timeoutResult;
          return response.ok
            ? { status: "sent" }
            : { status: "error", reason: "network" };
        } catch {
          return expired || Date.now() >= deadline
            ? timeoutResult
            : { status: "error", reason: "network" };
        }
      })();
      // Abort é best effort; o race encerra a espera mesmo se o transporte ignorá-lo.
      const result = await Promise.race([request, timeout]);
      if (result.reason === "timeout" && !controller.signal.aborted) controller.abort();
      return result;
    } finally {
      clearTimeout(timer);
    }
  }

  return openExternalWindow(gmailComposeUrl, openWindow)
    ? { status: "draft" }
    : { status: "error", reason: "popup" };
}
