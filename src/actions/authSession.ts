"use server";

import { cookies } from "next/headers";
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

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const idTokenSchema = z.string().min(1);

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };
}

export async function syncAuthSession(idToken: string | null): Promise<void> {
  const cookieStore = await cookies();
  if (idToken === null) {
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      ...cookieOptions(),
      maxAge: 0,
    });
    return;
  }

  const validatedToken = idTokenSchema.parse(idToken);
  let sessionCookie: string;
  if (hasFirebaseAdminConfig()) {
    sessionCookie = await getFirebaseAdminAuth().createSessionCookie(
      validatedToken,
      { expiresIn: SESSION_MAX_AGE_SECONDS * 1000 }
    );
  } else {
    if (
      process.env.NODE_ENV === "production" ||
      !isInsecureDevAuthEnabled()
    ) {
      throw new Error("Firebase Admin is not configured.");
    }
    sessionCookie = DEV_SESSION_COOKIE_VALUE;
  }

  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    ...cookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}
