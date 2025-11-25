"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { ModelMessage, streamText } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";

const fireworks = createOpenAI({
  apiKey: process.env.FIREWORKS_API_KEY ?? "",
  baseURL: "https://api.fireworks.ai/inference/v1",
});

type ModelName =
  | "gpt-4.1"
  | "gemini-1.5-pro"
  | "mistral-large"
  | "claude-3-5-sonnet"
  | "llama-v3p1-405b";

/**
 * Get the AI model based on the model name
 */
async function getModel(modelName: ModelName) {
  const models = {
    "gpt-4.1": () => openai("gpt-4.1"),
    "gemini-1.5-pro": () => google("models/gemini-1.5-pro-latest"),
    "mistral-large": () => mistral("mistral-large-latest"),
    "claude-3-5-sonnet": () => anthropic("claude-3-5-sonnet-20240620"),
    "llama-v3p1-405b": () =>
      fireworks("accounts/fireworks/models/llama-v3p1-405b-instruct"),
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
  userPrompt: string,
  modelName: ModelName
) {
  const model = await getModel(modelName);

  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const result = streamText({
    model,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

const SYSTEM_PROMPT = `You are an expert at helping people solve dilemmas. 
Provide thoughtful, actionable advice to help the user out of their pickle.

Guidelines:
- Be empathetic and understanding
- Offer practical, step-by-step suggestions
- Consider multiple perspectives
- Keep advice concise but comprehensive
- End with encouragement`;

/**
 * Server action to generate AI advice for a user's dilemma
 */
export async function getAdvice(
  dilemma: string,
  userId: string,
  modelName: ModelName = "gpt-4.1"
) {
  if (!dilemma?.trim()) {
    throw new Error("Dilemma is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const userPrompt = `The user is facing the following dilemma:\n\n${dilemma}`;

  return generateResponse(SYSTEM_PROMPT, userPrompt, modelName);
}
