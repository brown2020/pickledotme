"use server";

import { createStreamableValue } from '@ai-sdk/rsc';
import { ModelMessage, streamText } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";

const fireworks = createOpenAI({
  apiKey: process.env.FIREWORKS_API_KEY ?? "",
  baseURL: "https://api.fireworks.ai/inference/v1",
});

// Configure the models (you can expand this list with additional models)
async function getModel(modelName: string) {
  switch (modelName) {
    case "gpt-4.1":
      return openai("gpt-4.1");
    case "gemini-1.5-pro":
      return google("models/gemini-1.5-pro-latest");
    case "mistral-large":
      return mistral("mistral-large-latest");
    case "claude-3-5-sonnet":
      return anthropic("claude-3-5-sonnet-20240620");
    case "llama-v3p1-405b":
      return fireworks("accounts/fireworks/models/llama-v3p1-405b-instruct");

    default:
      throw new Error(`Unsupported model name: ${modelName}`);
  }
}

// Function to generate a response from the selected model
async function generateResponse(
  systemPrompt: string,
  userPrompt: string,
  modelName: string
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

// Export the server action to generate advice for a user’s pickle
export async function getAdvice(
  dilemma: string,
  userId: string,
  modelName: string = "gpt-4.1"
) {
  console.log("getAdvice: ", dilemma, userId, modelName);
  const systemPrompt =
    "You are an expert at helping people solve dilemmas. Provide thoughtful, actionable advice to help the user out of their pickle.";
  const userPrompt = `The user is facing the following dilemma: ${dilemma}`;

  return generateResponse(systemPrompt, userPrompt, modelName);
}
