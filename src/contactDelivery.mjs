import { openExternalWindow } from "./externalLinks.mjs";

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
