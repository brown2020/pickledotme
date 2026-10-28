/** Prefer Host-prefixed cookie on HTTPS; plain name on HTTP (local next start). */
export const SESSION_COOKIE_NAME_SECURE = "__Host-pickle-session";
export const SESSION_COOKIE_NAME_INSECURE = "pickle-session";

/**
 * Dev-only cookie value used when Firebase Admin isn't configured locally.
 * This is intentionally not secure and MUST NOT be used in production.
 */
export const DEV_SESSION_COOKIE_VALUE = "dev";
