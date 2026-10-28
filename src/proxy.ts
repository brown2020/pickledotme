import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/contentSecurityPolicy";
import { safeInternalPath } from "@/lib/safeRedirect";
import {
  inspectSessionCookie,
  isSecureSessionRequest,
  readSessionCookieValue,
} from "@/lib/authSession";
import {
  sessionCookieClearAttributes,
  sessionCookieNames,
} from "@/lib/sessionPolicy";

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = ["/games", "/pickle", "/profile"];

/**
 * Routes that should redirect authenticated users away
 */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

function clearInvalidSessionCookies(
  response: NextResponse,
  requestIsSecure: boolean
) {
  for (const name of sessionCookieNames()) {
    response.cookies.set(
      name,
      "",
      sessionCookieClearAttributes(name, requestIsSecure)
    );
  }
}

function continueWithNonce(request: NextRequest, nonce: string, csp: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return addSecurityHeaders(response, csp);
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse, contentSecurityPolicy?: string) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (contentSecurityPolicy) {
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  }

  return response;
}

/**
 * Proxy for route protection and security headers
 * Uses server-issued Firebase session cookies
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = isDev
    ? undefined
    : buildContentSecurityPolicy(nonce, false);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const inspection =
    isProtectedRoute || isAuthRoute
      ? await inspectSessionCookie(readSessionCookieValue(request.cookies))
      : { status: "missing" as const };
  const isAuthenticated = inspection.status === "valid";

  // Redirect unauthenticated users from protected routes to sign-in.
  // Only a confirmed bad cookie is cleared. Transient verifier failures
  // stay logged-out for this request but keep the cookie for the next one.
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", safeInternalPath(pathname) ?? "/");
    const response = NextResponse.redirect(url);
    if (inspection.status === "invalid") {
      clearInvalidSessionCookies(
        response,
        isSecureSessionRequest(request.nextUrl.protocol)
      );
    }
    return addSecurityHeaders(response, contentSecurityPolicy);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return addSecurityHeaders(NextResponse.redirect(url), contentSecurityPolicy);
  }

  if (!isDev && contentSecurityPolicy) {
    return continueWithNonce(request, nonce, contentSecurityPolicy);
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
