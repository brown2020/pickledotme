import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

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

const COLLECTIONS = {
  threads: "adviceThreads",
  messages: "messages",
} as const;

function toDate(ts: unknown): Date {
  if (ts instanceof Timestamp) return ts.toDate();
  return new Date(0);
}

function makeTitle(dilemma: string): string {
  const trimmed = dilemma.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function makePreview(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
}

export const adviceService = {
  async createThread(params: {
    userId: string;
    dilemma: string;
    tone: AdviceTone;
    modelName: string;
  }): Promise<string> {
    try {
      const { userId, dilemma, tone, modelName } = params;

      const threadRef = await addDoc(collection(db, COLLECTIONS.threads), {
        userId,
        title: makeTitle(dilemma),
        tone,
        modelName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastPreview: "",
      });

      await addDoc(
        collection(db, COLLECTIONS.threads, threadRef.id, COLLECTIONS.messages),
        {
          userId,
          threadId: threadRef.id,
          role: "user" satisfies AdviceRole,
          content: dilemma,
          createdAt: Timestamp.now(),
        }
      );

      return threadRef.id;
    } catch (error) {
      console.error("Failed to create thread:", error);
      throw new Error("Failed to start conversation. Please try again.");
    }
  },

  async addAssistantMessage(params: {
    userId: string;
    threadId: string;
    content: string;
  }): Promise<void> {
    try {
      const { userId, threadId, content } = params;

      await addDoc(
        collection(db, COLLECTIONS.threads, threadId, COLLECTIONS.messages),
        {
          userId,
          threadId,
          role: "assistant" satisfies AdviceRole,
          content,
          createdAt: Timestamp.now(),
        }
      );

      await updateDoc(doc(db, COLLECTIONS.threads, threadId), {
        updatedAt: Timestamp.now(),
        lastPreview: makePreview(content),
      });
    } catch (error) {
      console.error("Failed to add assistant message:", error);
      throw new Error("Failed to save response. Please try again.");
    }
  },

  async addUserMessage(params: {
    userId: string;
    threadId: string;
    content: string;
  }): Promise<void> {
    try {
      const { userId, threadId, content } = params;

      await addDoc(
        collection(db, COLLECTIONS.threads, threadId, COLLECTIONS.messages),
        {
          userId,
          threadId,
          role: "user" satisfies AdviceRole,
          content,
          createdAt: Timestamp.now(),
        }
      );

      await updateDoc(doc(db, COLLECTIONS.threads, threadId), {
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Failed to add user message:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  },

  async listThreads(userId: string, limitCount = 20): Promise<AdviceThread[]> {
    try {
      // Avoid composite-index requirement (where + orderBy).
      // We filter server-side and sort client-side.
      const snapshot = await getDocs(
        query(collection(db, COLLECTIONS.threads), where("userId", "==", userId))
      );

      const threads = snapshot.docs.map((d) => {
        const data = d.data() as {
          userId: string;
          title: string;
          tone: AdviceTone;
          modelName: string;
          createdAt: Timestamp;
          updatedAt: Timestamp;
          lastPreview?: string;
        };

        return {
          id: d.id,
          userId: data.userId,
          title: data.title,
          tone: data.tone,
          modelName: data.modelName,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastPreview: data.lastPreview ?? "",
        };
      });

      threads.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      return threads.slice(0, limitCount);
    } catch (error) {
      console.error("Failed to list threads:", error);
      throw new Error("Failed to load conversations. Please try again.");
    }
  },

  async getThreadMessages(params: {
    userId: string;
    threadId: string;
    limitCount?: number;
  }): Promise<AdviceMessage[]> {
    try {
      const { userId, threadId, limitCount = 50 } = params;

      // Avoid composite-index requirement (where + orderBy).
      // Security rules ensure only the owner of the thread can read messages.
      // We intentionally do NOT filter by userId here.
      const q = query(
        collection(db, COLLECTIONS.threads, threadId, COLLECTIONS.messages),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((d) => {
        const data = d.data() as {
          userId: string;
          threadId: string;
          role: AdviceRole;
          content: string;
          createdAt: Timestamp;
        };

        return {
          id: d.id,
          userId: data.userId,
          threadId: data.threadId,
          role: data.role,
          content: data.content,
          createdAt: toDate(data.createdAt),
        };
      });

      // Ensure strict chronological order, even when timestamps tie.
      messages.sort((a, b) => {
        const t = a.createdAt.getTime() - b.createdAt.getTime();
        if (t !== 0) return t;
        return a.id.localeCompare(b.id);
      });

      // Enforce limit client-side since we removed server-side limit.
      // Keep the most recent N messages while preserving chronological order.
      void userId;
      if (messages.length <= limitCount) return messages;
      return messages.slice(-limitCount);
    } catch (error) {
      console.error("Failed to get thread messages:", error);
      throw new Error("Failed to load messages. Please try again.");
    }
  },

  async deleteThread(params: {
    userId: string;
    threadId: string;
  }): Promise<void> {
    try {
      const { userId, threadId } = params;

      // Minimal delete: delete the thread doc. (Messages subcollection will remain;
      // if you want hard-delete later, do it via a Cloud Function.)
      await deleteDoc(doc(db, COLLECTIONS.threads, threadId));

      // Best-effort: if the thread doc didn't belong to user (rules should prevent),
      // we still keep client logic simple.
      void userId;
    } catch (error) {
      console.error("Failed to delete thread:", error);
      throw new Error("Failed to delete conversation. Please try again.");
    }
  },
};
