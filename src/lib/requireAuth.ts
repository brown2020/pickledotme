import "server-only";

import { cookies } from "next/headers";
import {
  getVerifiedSessionUid,
  readSessionCookieValue,
} from "@/lib/authSession";

export async function requireAuthenticatedSessionUid(): Promise<string> {
  const cookieStore = await cookies();
  const sessionCookie = readSessionCookieValue(cookieStore);
  const uid = await getVerifiedSessionUid(sessionCookie);

  if (!uid) {
    throw new Error("Authentication required.");
  }

  return uid;
}
