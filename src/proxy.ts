import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Cookie name for auth state synchronization
 */
export const AUTH_COOKIE_NAME = "pickle-auth-state";

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = ["/games", "/pickle", "/profile"];

/**
 * Routes that should redirect authenticated users away
 */
const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://api.openai.com https://api.anthropic.com https://api.mistral.ai https://api.fireworks.ai;"
    );
  }

  return response;
}

/**
 * Proxy for route protection and security headers
 * Uses cookie-based auth state synced from client-side Firebase Auth
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth state from cookie (synced by AuthProvider on auth state change)
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = authCookie?.value === "true";

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to home
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname);
    return addSecurityHeaders(NextResponse.redirect(url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return addSecurityHeaders(NextResponse.redirect(url));
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
