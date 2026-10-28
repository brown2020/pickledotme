import "server-only";

import { cookies } from "next/headers";
import { assertVerifiedAdviceSession } from "@/lib/adviceAccess";
import {
  getVerifiedAdviceSession,
  getVerifiedSessionUid,
  readSessionCookieValue,
} from "@/lib/authSession";

async function readSessionCookie() {
  const cookieStore = await cookies();
  return readSessionCookieValue(cookieStore);
}

export async function requireAuthenticatedSessionUid(): Promise<string> {
  const uid = await getVerifiedSessionUid(await readSessionCookie());

  if (!uid) {
    throw new Error("Authentication required.");
  }

  return uid;
}

/** Advice calls the paid model APIs, so the account email must be verified. */
export async function requireVerifiedAdviceUid(): Promise<string> {
  return assertVerifiedAdviceSession(
    await getVerifiedAdviceSession(await readSessionCookie())
  );
}
