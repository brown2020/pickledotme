"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebaseAdmin";
import { requireAuthenticatedSessionUid } from "@/lib/requireAuth";
import {
  adviceRequestSchema,
  assistantMessageRequestSchema,
  threadRequestSchema,
  userMessageRequestSchema,
  validateOrThrow,
} from "@/lib/validations";
import type {
  AdviceMessage,
  AdviceRole,
  AdviceThread,
  AdviceTone,
} from "@/types/advice";

const COLLECTIONS = {
  threads: "adviceThreads",
  messages: "messages",
} as const;

function toDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date(0);
}

function makeTitle(dilemma: string): string {
  const trimmed = dilemma.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function makePreview(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
}

async function getOwnedThread(threadId: string, uid: string) {
  const threadRef = getFirebaseAdminFirestore()
    .collection(COLLECTIONS.threads)
    .doc(threadId);
  const snapshot = await threadRef.get();
  if (!snapshot.exists || snapshot.data()?.userId !== uid) {
    throw new Error("Conversation not found.");
  }
  return threadRef;
}

export async function createAdviceThread(input: unknown): Promise<string> {
  const uid = await requireAuthenticatedSessionUid();
  const { dilemma, tone, modelName } = validateOrThrow(
    adviceRequestSchema,
    input
  );
  const db = getFirebaseAdminFirestore();
  const threadRef = db.collection(COLLECTIONS.threads).doc();
  const messageRef = threadRef.collection(COLLECTIONS.messages).doc();
  const batch = db.batch();

  batch.create(threadRef, {
    userId: uid,
    title: makeTitle(dilemma),
    tone,
    modelName,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastPreview: "",
  });
  batch.create(messageRef, {
    userId: uid,
    threadId: threadRef.id,
    role: "user" satisfies AdviceRole,
    content: dilemma,
    createdAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
  return threadRef.id;
}

export async function saveUserMessage(input: unknown): Promise<void> {
  const uid = await requireAuthenticatedSessionUid();
  const { threadId, content } = validateOrThrow(
    userMessageRequestSchema,
    input
  );
  const db = getFirebaseAdminFirestore();
  const threadRef = db.collection(COLLECTIONS.threads).doc(threadId);

  await db.runTransaction(async (transaction) => {
    const threadSnapshot = await transaction.get(threadRef);
    if (!threadSnapshot.exists || threadSnapshot.data()?.userId !== uid) {
      throw new Error("Conversation not found.");
    }
    transaction.create(threadRef.collection(COLLECTIONS.messages).doc(), {
      userId: uid,
      threadId,
      role: "user" satisfies AdviceRole,
      content,
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.update(threadRef, { updatedAt: FieldValue.serverTimestamp() });
  });
}

export async function saveAssistantMessage(input: unknown): Promise<void> {
  const uid = await requireAuthenticatedSessionUid();
  const { threadId, content } = validateOrThrow(
    assistantMessageRequestSchema,
    input
  );
  const db = getFirebaseAdminFirestore();
  const threadRef = db.collection(COLLECTIONS.threads).doc(threadId);

  await db.runTransaction(async (transaction) => {
    const threadSnapshot = await transaction.get(threadRef);
    if (!threadSnapshot.exists || threadSnapshot.data()?.userId !== uid) {
      throw new Error("Conversation not found.");
    }
    transaction.create(threadRef.collection(COLLECTIONS.messages).doc(), {
      userId: uid,
      threadId,
      role: "assistant" satisfies AdviceRole,
      content,
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.update(threadRef, {
      updatedAt: FieldValue.serverTimestamp(),
      lastPreview: makePreview(content),
    });
  });
}

export async function deleteAdviceThread(input: unknown): Promise<void> {
  const uid = await requireAuthenticatedSessionUid();
  const { threadId } = validateOrThrow(threadRequestSchema, input);
  const db = getFirebaseAdminFirestore();
  const threadRef = await getOwnedThread(threadId, uid);
  await db.recursiveDelete(threadRef);
}

export async function listAdviceThreads(): Promise<AdviceThread[]> {
  const uid = await requireAuthenticatedSessionUid();
  const snapshot = await getFirebaseAdminFirestore()
    .collection(COLLECTIONS.threads)
    .where("userId", "==", uid)
    .get();
  const threads = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      userId: data.userId as string,
      title: data.title as string,
      tone: data.tone as AdviceTone,
      modelName: data.modelName as string,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      lastPreview: (data.lastPreview as string | undefined) ?? "",
    };
  });
  threads.sort(
    (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()
  );
  return threads.slice(0, 20);
}

export async function getAdviceThreadMessages(
  input: unknown
): Promise<AdviceMessage[]> {
  const uid = await requireAuthenticatedSessionUid();
  const { threadId } = validateOrThrow(threadRequestSchema, input);
  const threadRef = await getOwnedThread(threadId, uid);
  const snapshot = await threadRef
    .collection(COLLECTIONS.messages)
    .orderBy("createdAt", "asc")
    .get();
  const messages = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      userId: data.userId as string,
      threadId: data.threadId as string,
      role: data.role as AdviceRole,
      content: data.content as string,
      createdAt: toDate(data.createdAt),
    };
  });
  messages.sort((left, right) => {
    const difference = left.createdAt.getTime() - right.createdAt.getTime();
    return difference || left.id.localeCompare(right.id);
  });
  return messages.slice(-50);
}
