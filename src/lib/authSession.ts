import "server-only";

export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-pickle-session"
    : "pickle-session";

/**
 * Dev-only cookie value used when Firebase Admin isn't configured locally.
 * This is intentionally not secure and MUST NOT be used in production.
 */
export const DEV_SESSION_COOKIE_VALUE = "dev";

export function isDevSessionCookie(value: string | undefined) {
  return (
    process.env.NODE_ENV !== "production" && value === DEV_SESSION_COOKIE_VALUE
  );
}
