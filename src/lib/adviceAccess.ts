export const EMAIL_VERIFICATION_REQUIRED =
  "Verify your email before requesting advice.";

export const ADVICE_UNAVAILABLE =
  "The advice service is unavailable. Please try again.";

export class RateLimitError extends Error {
  constructor(message = "Too many requests. Please wait and try again.") {
    super(message);
    this.name = "RateLimitError";
  }
}

export function assertVerifiedAdviceSession(
  session: { uid: string; emailVerified: boolean } | null
): string {
  if (!session) {
    throw new Error("Authentication required.");
  }
  if (!session.emailVerified) {
    throw new Error(EMAIL_VERIFICATION_REQUIRED);
  }
  return session.uid;
}

/** Messages safe to show to the user. Provider errors stay on the server. */
export function toPublicAdviceError(error: unknown): Error {
  if (error instanceof RateLimitError) {
    return new RateLimitError(error.message);
  }
  if (
    error instanceof Error &&
    error.message === EMAIL_VERIFICATION_REQUIRED
  ) {
    return new Error(EMAIL_VERIFICATION_REQUIRED);
  }
  return new Error(ADVICE_UNAVAILABLE);
}
