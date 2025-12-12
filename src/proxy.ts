import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { isDevSessionCookie, SESSION_COOKIE_NAME } from "@/lib/authSession";

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
 * Uses server-issued Firebase session cookies
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  let isAuthenticated = false;
  if (isProtectedRoute || isAuthRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (sessionCookie) {
      try {
        if (isDevSessionCookie(sessionCookie)) {
          isAuthenticated = true;
        } else {
          const adminAuth = getFirebaseAdminAuth();
          await adminAuth.verifySessionCookie(sessionCookie, true);
          isAuthenticated = true;
        }
      } catch {
        isAuthenticated = false;
      }
    }
  }

  // Redirect unauthenticated users from protected routes to home
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(url);
    // Clear any invalid session cookie.
    response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return addSecurityHeaders(response);
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
