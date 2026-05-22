function buildQuery(params) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  return query.toString();
}

export function buildGmailComposeUrl(email, subject = "", body = "") {
  const query = buildQuery({
    view: "cm",
    fs: "1",
    to: email,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${query}`;
}

export function buildOutlookComposeUrl(email, subject = "", body = "") {
  const query = buildQuery({
    to: email,
    subject,
    body,
  });

  return `https://outlook.live.com/mail/0/deeplink/compose?${query}`;
}
