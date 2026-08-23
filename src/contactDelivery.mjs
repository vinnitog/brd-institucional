import { openExternalWindow } from "./externalLinks.mjs";

export function resolveContactEndpoint(endpoint, privacyPolicyUrl) {
  return endpoint && privacyPolicyUrl ? endpoint : "";
}

export async function deliverContact(
  { endpoint, payload, gmailComposeUrl },
  { fetchFn = globalThis.fetch, openWindow } = {},
) {
  if (endpoint) {
    if (typeof fetchFn !== "function") return { status: "error", reason: "network" };

    try {
      const response = await fetchFn(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return response.ok
        ? { status: "sent" }
        : { status: "error", reason: "network" };
    } catch {
      return { status: "error", reason: "network" };
    }
  }

  return openExternalWindow(gmailComposeUrl, openWindow)
    ? { status: "draft" }
    : { status: "error", reason: "popup" };
}
