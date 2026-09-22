import "server-only";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

/** Prefer Host-prefixed cookie on HTTPS; plain name on HTTP (local next start). */
export const SESSION_COOKIE_NAME_SECURE = "__Host-pickle-session";
export const SESSION_COOKIE_NAME_INSECURE = "pickle-session";

/** @deprecated Prefer readSessionCookieValue / cookie name helpers — kept for tests. */
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? SESSION_COOKIE_NAME_SECURE
    : SESSION_COOKIE_NAME_INSECURE;

/**
 * Dev-only cookie value used when Firebase Admin isn't configured locally.
 * This is intentionally not secure and MUST NOT be used in production.
 */
export const DEV_SESSION_COOKIE_VALUE = "dev";

export function isInsecureDevAuthEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_INSECURE_DEV_AUTH === "true"
  );
}

export function isSecureSessionRequest(protocol: string) {
  return protocol === "https:";
}

export function sessionCookieNameForRequest(secure: boolean) {
  return secure ? SESSION_COOKIE_NAME_SECURE : SESSION_COOKIE_NAME_INSECURE;
}

export function readSessionCookieValue(cookies: {
  get: (name: string) => { value: string } | undefined;
}): string | undefined {
  return (
    cookies.get(SESSION_COOKIE_NAME_SECURE)?.value ??
    cookies.get(SESSION_COOKIE_NAME_INSECURE)?.value
  );
}

function isDevSessionCookie(value: string | undefined) {
  return isInsecureDevAuthEnabled() && value === DEV_SESSION_COOKIE_VALUE;
}

export async function getVerifiedSessionUid(
  sessionCookie: string | undefined
): Promise<string | null> {
  if (!sessionCookie) return null;
  if (isDevSessionCookie(sessionCookie)) return DEV_SESSION_COOKIE_VALUE;

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    return decodedToken.uid;
  } catch {
    return null;
  }
}
