"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebaseAdmin";
import { requireAuthenticatedSessionUid } from "@/lib/requireAuth";
import {
  gameIdSchema,
  scoreSubmissionSchema,
  validateOrThrow,
} from "@/lib/validations";
import type { GameId } from "@/config/games";
import type { DisplayScore } from "@/types/score";

const COLLECTIONS = {
  best: "bestScores",
  history: "scoreHistory",
  legacy: "scores",
} as const;

function scoreFromData(data: Record<string, unknown> | undefined): number | null {
  if (!data) return null;
  return typeof data.score === "number" ? data.score : 0;
}

function toDisplayScore(
  id: string,
  data: Record<string, unknown>
): DisplayScore {
  return {
    id,
    userId: data.userId as string,
    gameId: data.gameId as string,
    score: data.score as number,
    timestamp:
      data.timestamp instanceof Timestamp
        ? data.timestamp.toDate()
        : new Date(0),
    kind: data.kind as "history" | "best" | undefined,
  };
}

async function readBestScore(uid: string, gameId: GameId): Promise<number> {
  const db = getFirebaseAdminFirestore();
  const bestDocId = `${gameId}-best-${uid}`;
  const bestSnapshot = await db
    .collection(COLLECTIONS.best)
    .doc(bestDocId)
    .get();
  const bestScore = scoreFromData(bestSnapshot.data());
  if (bestScore !== null) return bestScore;

  const legacySnapshot = await db
    .collection(COLLECTIONS.legacy)
    .doc(bestDocId)
    .get();
  return scoreFromData(legacySnapshot.data()) ?? 0;
}

export async function saveGameResult(
  input: unknown
): Promise<{ isNewBest: boolean }> {
  const uid = await requireAuthenticatedSessionUid();
  const { gameId, score } = validateOrThrow(scoreSubmissionSchema, input);
  const db = getFirebaseAdminFirestore();
  const bestDocId = `${gameId}-best-${uid}`;
  const bestRef = db.collection(COLLECTIONS.best).doc(bestDocId);
  const legacyRef = db.collection(COLLECTIONS.legacy).doc(bestDocId);
  const historyRef = db.collection(COLLECTIONS.history).doc();

  return db.runTransaction(async (transaction) => {
    const bestSnapshot = await transaction.get(bestRef);
    let currentBest = scoreFromData(bestSnapshot.data());
    if (currentBest === null) {
      const legacySnapshot = await transaction.get(legacyRef);
      currentBest = scoreFromData(legacySnapshot.data()) ?? 0;
    }

    transaction.create(historyRef, {
      userId: uid,
      gameId,
      score,
      timestamp: FieldValue.serverTimestamp(),
    });

    const isNewBest = score > currentBest;
    if (isNewBest) {
      transaction.set(bestRef, {
        userId: uid,
        gameId,
        score,
        timestamp: FieldValue.serverTimestamp(),
      });
    }
    return { isNewBest };
  });
}

export async function getUserBestScore(input: unknown): Promise<number> {
  const uid = await requireAuthenticatedSessionUid();
  const gameId = validateOrThrow(gameIdSchema, input);
  return readBestScore(uid, gameId);
}

export async function getHighScores(input: unknown): Promise<DisplayScore[]> {
  await requireAuthenticatedSessionUid();
  const gameId = validateOrThrow(gameIdSchema, input);
  const db = getFirebaseAdminFirestore();
  const bestSnapshot = await db
    .collection(COLLECTIONS.best)
    .where("gameId", "==", gameId)
    .orderBy("score", "desc")
    .limit(10)
    .get();
  const bestScores = bestSnapshot.docs.map((document) =>
    toDisplayScore(document.id, document.data())
  );
  if (bestScores.length > 0) return bestScores;

  const legacySnapshot = await db
    .collection(COLLECTIONS.legacy)
    .where("gameId", "==", gameId)
    .where("kind", "==", "best")
    .orderBy("score", "desc")
    .limit(10)
    .get();
  return legacySnapshot.docs.map((document) =>
    toDisplayScore(document.id, document.data())
  );
}

export async function getUserGameScores(): Promise<DisplayScore[]> {
  const uid = await requireAuthenticatedSessionUid();
  const db = getFirebaseAdminFirestore();
  const historySnapshot = await db
    .collection(COLLECTIONS.history)
    .where("userId", "==", uid)
    .get();
  const historyScores = historySnapshot.docs.map((document) =>
    toDisplayScore(document.id, document.data())
  );
  if (historyScores.length > 0) return historyScores;

  const legacySnapshot = await db
    .collection(COLLECTIONS.legacy)
    .where("userId", "==", uid)
    .get();
  return legacySnapshot.docs.map((document) =>
    toDisplayScore(document.id, document.data())
  );
}
