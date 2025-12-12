"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { ModelMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";
import { adviceChatRequestSchema, validateOrThrow } from "@/lib/validations";

type ModelName =
  | "gpt-5.2-chat-latest"
  | "claude-sonnet-4-5"
  | "gemini-2.5-flash"
  | "mistral-large-latest";

/**
 * Get the AI model based on the model name
 */
async function getModel(modelName: ModelName) {
  const models = {
    "gpt-5.2-chat-latest": () => openai("gpt-5.2-chat-latest"),
    "claude-sonnet-4-5": () => anthropic("claude-sonnet-4-5"),
    "gemini-2.5-flash": () => google("gemini-2.5-flash"),
    "mistral-large-latest": () => mistral("mistral-large-latest"),
  };

  const modelFactory = models[modelName];
  if (!modelFactory) {
    throw new Error(`Unsupported model name: ${modelName}`);
  }

  return modelFactory();
}

/**
 * Generate a streaming response from the selected AI model
 */
async function generateResponse(
  systemPrompt: string,
  messages: ModelMessage[],
  modelName: ModelName
) {
  const model = await getModel(modelName);

  const fullMessages: ModelMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const result = streamText({
    model,
    messages: fullMessages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

function getSystemPrompt(tone: string) {
  const toneGuidance: Record<string, string> = {
    balanced: "Be clear, empathetic, and practical.",
    gentle: "Be extra empathetic, validating, and non-judgmental.",
    blunt: "Be direct and candid, but not cruel.",
    coach:
      "Be motivating, structured, and action-oriented. Use accountability.",
    funny: "Be playful and witty while still giving solid advice.",
  };

  const toneLine = toneGuidance[tone] ?? toneGuidance.balanced;

  return `You are an expert at helping people solve dilemmas.
Provide thoughtful, actionable advice to help the user out of their pickle.

Guidelines:
- Be empathetic and understanding
- Offer practical, step-by-step suggestions
- Consider multiple perspectives
- Keep advice concise but comprehensive
- End with encouragement

Tone:
- ${toneLine}

Output format:
- Use short headings and bullet points where helpful
- End with a short “Next 3 actions” section`;
}

/**
 * Server action to generate streaming AI advice (supports follow-ups)
 */
export async function getAdvice(input: unknown) {
  const { messages, modelName, tone } = validateOrThrow(
    adviceChatRequestSchema,
    input
  );

  return generateResponse(
    getSystemPrompt(tone),
    messages as ModelMessage[],
    modelName as ModelName
  );
}
