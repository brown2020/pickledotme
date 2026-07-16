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

export const assistantMessageRequestSchema = z.object({
  threadId: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(50000),
});

/**
 * Score submission validation
 */
export const scoreSubmissionSchema = z.object({
  gameId: z.enum(GAME_IDS),
  score: z.number().int().min(0).max(1000000),
});

export const gameIdSchema = z.enum(GAME_IDS);

export const threadRequestSchema = z.object({
  threadId: z.string().trim().min(1).max(200),
});

export const userMessageRequestSchema = threadRequestSchema.extend({
  content: z.string().trim().min(1).max(5000),
});

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
