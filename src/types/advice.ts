export type AdviceTone = "balanced" | "gentle" | "blunt" | "coach" | "funny";
export type AdviceRole = "user" | "assistant";

export interface AdviceThread {
  id: string;
  userId: string;
  title: string;
  tone: AdviceTone;
  modelName: string;
  createdAt: Date;
  updatedAt: Date;
  lastPreview: string;
}

export interface AdviceMessage {
  id: string;
  threadId: string;
  userId: string;
  role: AdviceRole;
  content: string;
  createdAt: Date;
}
