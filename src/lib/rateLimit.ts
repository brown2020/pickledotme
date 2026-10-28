import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebaseAdmin";
import {
  ADVICE_LIMIT,
  ADVICE_WINDOW_MS,
  nextRateBucket,
  SCORE_LIMIT,
  SCORE_WINDOW_MS,
  type RateBucket,
} from "@/lib/rateBucket";

export type RateLimitKind = "advice" | "score";

export {
  ADVICE_LIMIT,
  ADVICE_WINDOW_MS,
  nextRateBucket,
  SCORE_LIMIT,
  SCORE_WINDOW_MS,
};

const LIMITS: Record<RateLimitKind, { limit: number; windowMs: number }> = {
  advice: { limit: ADVICE_LIMIT, windowMs: ADVICE_WINDOW_MS },
  score: { limit: SCORE_LIMIT, windowMs: SCORE_WINDOW_MS },
};

export async function consumeRateLimit(
  uid: string,
  kind: RateLimitKind,
  now = Date.now()
): Promise<void> {
  const { limit, windowMs } = LIMITS[kind];
  const db = getFirebaseAdminFirestore();
  const ref = db.collection("rateLimits").doc(uid);
  const field = kind === "advice" ? "adviceBucket" : "scoreBucket";

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data() as Record<string, unknown> | undefined;
    const raw = data?.[field];
    const current =
      raw &&
      typeof raw === "object" &&
      typeof (raw as RateBucket).count === "number" &&
      typeof (raw as RateBucket).windowStartMs === "number"
        ? (raw as RateBucket)
        : undefined;
    const next = nextRateBucket(current, now, limit, windowMs);
    transaction.set(ref, { [field]: next }, { merge: true });
  });
}
