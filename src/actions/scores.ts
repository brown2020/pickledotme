"use server";

import { revalidatePath } from "next/cache";
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

/** Cap for equality-only fetches before in-memory top-N sort (avoids composite indexes). */
const LEADERBOARD_FETCH_CAP = 500;
const LEADERBOARD_LIMIT = 10;

function scoreFromData(data: Record<string, unknown> | undefined): number | null {
  if (!data) return null;
  return typeof data.score === "number" ? data.score : 0;
}

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (value as { toMillis?: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toDisplayScore(
  id: string,
  data: Record<string, unknown>
): DisplayScore {
  return {
    id,
    userId: String(data.userId ?? ""),
    gameId: String(data.gameId ?? ""),
    score: typeof data.score === "number" ? data.score : 0,
    // ISO string survives the server-action boundary; UI coerces to Date.
    timestamp: new Date(toMillis(data.timestamp)),
    kind: data.kind as "history" | "best" | undefined,
  };
}

function topScoresByScore(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
  limit: number
): DisplayScore[] {
  return docs
    .map((document) => toDisplayScore(document.id, document.data()))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.timestamp.getTime() - a.timestamp.getTime();
    })
    .slice(0, limit);
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
  }).then((result) => {
    // Client SWR caches are also mutated by callers; this keeps RSC/profile routes fresh.
    revalidatePath("/profile");
    revalidatePath("/games");
    revalidatePath(`/games/${gameId}`);
    return result;
  });
}

export async function getUserBestScore(input: unknown): Promise<number> {
  const uid = await requireAuthenticatedSessionUid();
  const gameId = validateOrThrow(gameIdSchema, input);
  return readBestScore(uid, gameId);
}

/**
 * Top scores for a game. Uses equality-only queries + in-memory sort so the
 * leaderboard works without composite Firestore indexes (orderBy + where
 * previously threw FAILED_PRECONDITION → "Failed to load leaderboard").
 */
export async function getHighScores(input: unknown): Promise<DisplayScore[]> {
  await requireAuthenticatedSessionUid();
  const gameId = validateOrThrow(gameIdSchema, input);
  const db = getFirebaseAdminFirestore();

  const bestSnapshot = await db
    .collection(COLLECTIONS.best)
    .where("gameId", "==", gameId)
    .limit(LEADERBOARD_FETCH_CAP)
    .get();
  const bestScores = topScoresByScore(bestSnapshot.docs, LEADERBOARD_LIMIT);
  if (bestScores.length > 0) return bestScores;

  // Legacy fallback is best-effort: missing indexes / empty legacy must not
  // surface as a leaderboard error when bestScores simply has no rows yet.
  try {
    const legacySnapshot = await db
      .collection(COLLECTIONS.legacy)
      .where("gameId", "==", gameId)
      .where("kind", "==", "best")
      .limit(LEADERBOARD_FETCH_CAP)
      .get();
    return topScoresByScore(legacySnapshot.docs, LEADERBOARD_LIMIT);
  } catch {
    return [];
  }
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
