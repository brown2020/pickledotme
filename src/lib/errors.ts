/**
 * Custom application error with user-friendly messaging
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Firebase-specific error codes
 */
export const ErrorCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  SAVE_FAILED: "SAVE_FAILED",
  FETCH_FAILED: "FETCH_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

/**
 * User-friendly error messages
 */
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.AUTH_REQUIRED]: "Please sign in to continue.",
  [ErrorCodes.SAVE_FAILED]: "Failed to save. Please try again.",
  [ErrorCodes.FETCH_FAILED]: "Failed to load data. Please refresh.",
  [ErrorCodes.NETWORK_ERROR]: "Network error. Check your connection.",
  [ErrorCodes.UNKNOWN]: "Something went wrong. Please try again.",
};

/**
 * Handle errors and return user-friendly message
 */
export function handleError(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    // Handle Firebase errors
    if (error.message.includes("permission-denied")) {
      return ErrorMessages[ErrorCodes.AUTH_REQUIRED];
    }
    if (error.message.includes("network")) {
      return ErrorMessages[ErrorCodes.NETWORK_ERROR];
    }
  }

  // Log unexpected errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("Unexpected error:", error);
  }

  return ErrorMessages[ErrorCodes.UNKNOWN];
}

/**
 * Create an AppError from a code
 */
export function createError(code: keyof typeof ErrorCodes, details?: string): AppError {
  const message = details || ErrorMessages[code];
  return new AppError(message, code, ErrorMessages[code]);
}




