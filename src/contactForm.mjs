const REQUIRED_FIELDS = ["name", "email", "topic", "message"];

export function prepareContactForm(form, fieldLimits) {
  const cleaned = Object.fromEntries(
    Object.entries(fieldLimits).map(([field, limit]) => [
      field,
      String(form[field] ?? "").trim().slice(0, limit),
    ]),
  );

  return {
    cleaned,
    invalidFields: REQUIRED_FIELDS.filter((field) => !cleaned[field]),
  };
}
