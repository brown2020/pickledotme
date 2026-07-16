import "server-only";

import { cookies } from "next/headers";
import {
  getVerifiedSessionUid,
  SESSION_COOKIE_NAME,
} from "@/lib/authSession";

export async function requireAuthenticatedSessionUid(): Promise<string> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const uid = await getVerifiedSessionUid(sessionCookie);

  if (!uid) {
    throw new Error("Authentication required.");
  }

  return uid;
}
