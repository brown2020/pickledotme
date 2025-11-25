import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = ["/games", "/pickle", "/profile"];

/**
 * Routes that should redirect authenticated users
 */
const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Proxy middleware for auth protection and security headers
 * Note: Firebase Auth state is client-side, so we use a cookie-based approach
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth state from cookie (set by client on auth state change)
  const authCookie = request.cookies.get("auth-state");
  const isAuthenticated = authCookie?.value === "authenticated";

  // Check if trying to access protected route without auth
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if trying to access auth routes while authenticated
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // For protected routes, if no auth cookie exists, let the client handle it
  // The AuthGuard component will redirect appropriately
  // This proxy primarily adds security headers

  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Add CSP header for production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://api.openai.com https://api.anthropic.com https://api.mistral.ai https://api.fireworks.ai;"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};

