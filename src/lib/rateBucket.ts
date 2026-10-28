import { RateLimitError } from "@/lib/adviceAccess";

export type RateBucket = { count: number; windowStartMs: number };

/** Human advice sessions, not a script hammering provider APIs. */
export const ADVICE_LIMIT = 20;
export const ADVICE_WINDOW_MS = 60 * 60 * 1000;

/** Completed games per hour. Short games can be replayed; scripts cannot flood writes. */
export const SCORE_LIMIT = 40;
export const SCORE_WINDOW_MS = 60 * 60 * 1000;

export function nextRateBucket(
  current: RateBucket | undefined,
  now: number,
  limit: number,
  windowMs: number
): RateBucket {
  const expired =
    !current ||
    now - current.windowStartMs >= windowMs ||
    now < current.windowStartMs;
  const count = expired ? 0 : current.count;
  const windowStartMs = expired ? now : current.windowStartMs;
  if (count >= limit) {
    throw new RateLimitError();
  }
  return { count: count + 1, windowStartMs };
}
