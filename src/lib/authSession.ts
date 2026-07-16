import "server-only";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-pickle-session"
    : "pickle-session";

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

export function isDevSessionCookie(value: string | undefined) {
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
