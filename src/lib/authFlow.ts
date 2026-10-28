/**
 * Sign-in attempts on /login, /signup, and /forgot-password.
 * "failed" must keep the page in place so the error stays visible.
 * Only an idle restored session may leave those pages.
 */
export type AuthFlow = "idle" | "pending" | "failed";

const AUTH_PAGE_PATHS = ["/login", "/signup", "/forgot-password"] as const;

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGE_PATHS.some((path) => pathname === path);
}

export function shouldLeaveAuthPage(
  pathname: string,
  flow: AuthFlow,
  hasUser: boolean
): boolean {
  return hasUser && flow === "idle" && isAuthPage(pathname);
}

/** Pending and failed attempts own the visible error. Idle sync may clear it. */
export function shouldPreserveAuthError(flow: AuthFlow): boolean {
  return flow !== "idle";
}
