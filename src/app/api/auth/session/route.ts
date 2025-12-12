import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getFirebaseAdminAuth,
  hasFirebaseAdminConfig,
} from "@/lib/firebaseAdmin";
import {
  DEV_SESSION_COOKIE_VALUE,
  isInsecureDevAuthEnabled,
  SESSION_COOKIE_NAME,
} from "@/lib/authSession";

export const runtime = "nodejs";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const createSessionSchema = z.object({
  idToken: z.string().min(1),
});

function isSecureRequest(request: NextRequest) {
  return (
    request.nextUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = createSessionSchema.parse(body);

    let sessionCookie: string;

    if (hasFirebaseAdminConfig()) {
      const adminAuth = getFirebaseAdminAuth();
      const expiresInMs = SESSION_MAX_AGE_SECONDS * 1000;
      sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: expiresInMs,
      });
    } else {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Firebase Admin is not configured in production.");
      }
      // Dev fallback is opt-in only.
      if (!isInsecureDevAuthEnabled()) {
        throw new Error(
          "Firebase Admin is not configured. For local dev, either set FIREBASE_ADMIN_* env vars or set ALLOW_INSECURE_DEV_AUTH=true."
        );
      }
      sessionCookie = DEV_SESSION_COOKIE_VALUE;
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: isSecureRequest(request),
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Failed to create session cookie:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create session" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
