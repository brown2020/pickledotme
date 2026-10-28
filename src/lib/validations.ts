import { z } from "zod";
import { GAME_IDS, type GameId } from "@/config/games";

export const ADVICE_MODEL_NAMES = [
  "gpt-5.2",
  "claude-sonnet-4-5",
  "gemini-2.5-flash",
  "mistral-large-latest",
] as const;

export const ADVICE_TONES = [
  "balanced",
  "gentle",
  "blunt",
  "coach",
  "funny",
] as const;

export type AdviceModelName = (typeof ADVICE_MODEL_NAMES)[number];
export type AdviceToneName = (typeof ADVICE_TONES)[number];

export function coerceAdviceModel(
  value: string | null | undefined
): AdviceModelName {
  return (ADVICE_MODEL_NAMES as readonly string[]).includes(value ?? "")
    ? (value as AdviceModelName)
    : "gpt-5.2";
}

export function coerceAdviceTone(
  value: string | null | undefined
): AdviceToneName {
  return (ADVICE_TONES as readonly string[]).includes(value ?? "")
    ? (value as AdviceToneName)
    : "balanced";
}

/**
 * Client-reported ceilings. Reaction and matching match the game rules.
 * The others are generous caps so a client cannot submit the old 1,000,000 ceiling.
 */
export const MAX_CLIENT_SCORE: Record<GameId, number> = {
  "reaction-pickle": 1000,
  "matching-pickles": 800,
  "word-pickle": 50_000,
  "sequence-pickle": 100_000,
  "speed-pickle": 100_000,
  "pickle-pop": 100_000,
};

/**
 * Advice request validation
 */
const modelNameSchema = z.enum(ADVICE_MODEL_NAMES).default("gpt-5.2");

const adviceToneSchema = z.enum(ADVICE_TONES).default("balanced");

export const adviceRequestSchema = z.object({
  dilemma: z
    .string()
    .min(10, "Please describe your situation in at least 10 characters")
    .max(5000, "Please keep your description under 5000 characters")
    .trim(),
  modelName: modelNameSchema.optional().default("gpt-5.2"),
  tone: adviceToneSchema.optional().default("balanced"),
});

/**
 * Advice chat request validation (supports follow-ups)
 */
const adviceChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(5000).trim(),
});

export const adviceChatRequestSchema = z.object({
  messages: z.array(adviceChatMessageSchema).min(1).max(20),
  modelName: modelNameSchema.optional().default("gpt-5.2"),
  tone: adviceToneSchema.optional().default("balanced"),
});

export const assistantMessageRequestSchema = z.object({
  threadId: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(50000),
});

/**
 * Score submission validation
 */
export const scoreSubmissionSchema = z
  .object({
    gameId: z.enum(GAME_IDS),
    score: z.number().int().min(0).max(100_000),
  })
  .superRefine((value, ctx) => {
    const max = MAX_CLIENT_SCORE[value.gameId];
    if (value.score > max) {
      ctx.addIssue({
        code: "custom",
        message: "Score is outside the allowed range for this game.",
        path: ["score"],
      });
    }
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
