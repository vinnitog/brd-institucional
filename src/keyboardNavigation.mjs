export function shouldCloseMenuOnEscape(key, hasOpenContactPanel) {
  return key === "Escape" && !hasOpenContactPanel;
}
