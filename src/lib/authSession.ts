import "server-only";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { classifySessionVerificationError } from "@/lib/sessionPolicy";
import {
  DEV_SESSION_COOKIE_VALUE,
  SESSION_COOKIE_NAME_INSECURE,
  SESSION_COOKIE_NAME_SECURE,
} from "@/lib/sessionCookieNames";

export {
  DEV_SESSION_COOKIE_VALUE,
  SESSION_COOKIE_NAME_INSECURE,
  SESSION_COOKIE_NAME_SECURE,
} from "@/lib/sessionCookieNames";

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

export type SessionInspection =
  | { status: "missing" }
  | { status: "valid"; uid: string; emailVerified: boolean }
  | { status: "invalid" }
  | { status: "unavailable" };

export async function inspectSessionCookie(
  sessionCookie: string | undefined
): Promise<SessionInspection> {
  if (!sessionCookie) return { status: "missing" };
  if (isDevSessionCookie(sessionCookie)) {
    return {
      status: "valid",
      uid: DEV_SESSION_COOKIE_VALUE,
      emailVerified: true,
    };
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    return {
      status: "valid",
      uid: decodedToken.uid,
      emailVerified: decodedToken.email_verified === true,
    };
  } catch (error) {
    const status = classifySessionVerificationError(error);
    return { status };
  }
}

export async function getVerifiedSessionUid(
  sessionCookie: string | undefined
): Promise<string | null> {
  const inspection = await inspectSessionCookie(sessionCookie);
  return inspection.status === "valid" ? inspection.uid : null;
}

export async function getVerifiedAdviceSession(
  sessionCookie: string | undefined
): Promise<{ uid: string; emailVerified: boolean } | null> {
  const inspection = await inspectSessionCookie(sessionCookie);
  if (inspection.status !== "valid") return null;
  return { uid: inspection.uid, emailVerified: inspection.emailVerified };
}
