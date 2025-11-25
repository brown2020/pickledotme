import { z } from "zod";
import { GAME_IDS } from "@/config/games";

/**
 * Advice request validation
 */
export const adviceRequestSchema = z.object({
  dilemma: z
    .string()
    .min(10, "Please describe your situation in at least 10 characters")
    .max(5000, "Please keep your description under 5000 characters")
    .trim(),
  modelName: z
    .enum(["gpt-4.1", "gemini-1.5-pro", "mistral-large", "claude-3-5-sonnet", "llama-v3p1-405b"])
    .optional()
    .default("gpt-4.1"),
});

export type AdviceRequest = z.infer<typeof adviceRequestSchema>;

/**
 * Score submission validation
 */
export const scoreSubmissionSchema = z.object({
  gameId: z.enum(GAME_IDS),
  score: z.number().int().min(0).max(1000000),
});

export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>;

/**
 * Game ID validation
 */
export const gameIdSchema = z.enum(GAME_IDS);

/**
 * User profile validation
 */
export const userProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Validate and parse data with proper error handling
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(", ");
    throw new Error(errors);
  }
  return result.data;
}

/**
 * Validate and return result with errors
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}
