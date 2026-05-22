export function buildEmailComposerUrl(email, subject = "", body = "") {
  const params = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }

  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
}
