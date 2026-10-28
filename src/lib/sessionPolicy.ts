import {
  SESSION_COOKIE_NAME_INSECURE,
  SESSION_COOKIE_NAME_SECURE,
} from "@/lib/sessionCookieNames";

/** Firebase Auth codes that mean the cookie itself is bad and should be cleared. */
const INVALID_SESSION_CODES = new Set([
  "auth/session-cookie-expired",
  "auth/session-cookie-revoked",
  "auth/argument-error",
  "auth/invalid-argument",
  "auth/invalid-session-cookie",
  "auth/user-disabled",
  "auth/user-not-found",
  "auth/id-token-expired",
  "auth/id-token-revoked",
  "auth/invalid-user-token",
  "auth/invalid-id-token",
]);

export type SessionRejection = "invalid" | "unavailable";

export function classifySessionVerificationError(
  error: unknown
): SessionRejection {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";
  if (INVALID_SESSION_CODES.has(code)) return "invalid";
  return "unavailable";
}

/**
 * Attributes required to actually delete a session cookie.
 * `__Host-` cookies are ignored unless `Secure` is set and `Domain` is omitted.
 */
export function sessionCookieClearAttributes(
  name: string,
  requestIsSecure: boolean
) {
  return {
    httpOnly: true as const,
    secure: name === SESSION_COOKIE_NAME_SECURE || requestIsSecure,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };
}

export function sessionCookieNames() {
  return [SESSION_COOKIE_NAME_SECURE, SESSION_COOKIE_NAME_INSECURE] as const;
}
