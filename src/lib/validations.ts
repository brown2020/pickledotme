import { z } from "zod";
import { GAME_IDS } from "@/config/games";

/**
 * Advice request validation
 */
const modelNameSchema = z
  .enum([
    "gpt-5.2-chat-latest",
    "claude-sonnet-4-5",
    "gemini-2.5-flash",
    "mistral-large-latest",
  ])
  .default("gpt-5.2-chat-latest");

export const adviceToneSchema = z
  .enum(["balanced", "gentle", "blunt", "coach", "funny"])
  .default("balanced");

export const adviceRequestSchema = z.object({
  dilemma: z
    .string()
    .min(10, "Please describe your situation in at least 10 characters")
    .max(5000, "Please keep your description under 5000 characters")
    .trim(),
  modelName: modelNameSchema.optional().default("gpt-5.2-chat-latest"),
  tone: adviceToneSchema.optional().default("balanced"),
});

export type AdviceRequest = z.infer<typeof adviceRequestSchema>;

/**
 * Advice chat request validation (supports follow-ups)
 */
export const adviceChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(5000).trim(),
});

export const adviceChatRequestSchema = z.object({
  messages: z.array(adviceChatMessageSchema).min(1).max(20),
  modelName: modelNameSchema.optional().default("gpt-5.2-chat-latest"),
  tone: adviceToneSchema.optional().default("balanced"),
});

export type AdviceChatRequest = z.infer<typeof adviceChatRequestSchema>;

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
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
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
