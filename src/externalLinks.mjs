export function openExternalWindow(url, openWindow = globalThis.window?.open?.bind(globalThis.window)) {
  if (typeof openWindow !== "function") return false;

  const newWindow = openWindow("", "_blank");
  if (!newWindow) return false;

  try {
    newWindow.opener = null;
    newWindow.location.replace(url);
    return true;
  } catch {
    newWindow.close?.();
    return false;
  }
}
