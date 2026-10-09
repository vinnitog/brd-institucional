export function shouldCloseMenuOnEscape(key, hasOpenContactPanel) {
  return key === "Escape" && !hasOpenContactPanel;
}

export function getDialogFocusDestination(key, shiftKey, activeIndex, focusableCount) {
  if (key !== "Tab" || focusableCount === 0) return null;
  if (shiftKey && activeIndex <= 0) return focusableCount - 1;
  if (!shiftKey && activeIndex === focusableCount - 1) return 0;
  return null;
}
