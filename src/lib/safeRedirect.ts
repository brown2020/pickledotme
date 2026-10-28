const APP_ORIGIN = "https://pickle.me";

/**
 * Accept only same-origin paths. Reject protocol-relative URLs, backslashes,
 * and control characters, which browsers normalize into off-site navigations.
 */
export function safeInternalPath(
  value: string | null | undefined
): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("\\") || /[\u0000-\u001F]/.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value, APP_ORIGIN);
  } catch {
    return null;
  }

  if (url.origin !== APP_ORIGIN) return null;
  if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function withSafeRedirect(
  base: string,
  redirect: string | null | undefined
): string {
  const safe = safeInternalPath(redirect);
  if (!safe) return base;
  return `${base}?redirect=${encodeURIComponent(safe)}`;
}
