import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { GameId } from "@/config/games";

interface SaveScoreParams {
  userId: string;
  gameId: GameId;
  score: number;
}

const COLLECTIONS = {
  best: "bestScores",
  history: "scoreHistory",
  legacy: "scores",
} as const;

interface FirestoreScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Timestamp;
  kind?: "history" | "best";
}

export interface DisplayScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
  kind?: "history" | "best";
}

function toDisplayScore(docSnapshot: {
  id: string;
  data: () => unknown;
}): DisplayScore {
  const data = docSnapshot.data() as Omit<FirestoreScore, "id">;
  return {
    id: docSnapshot.id,
    userId: data.userId,
    gameId: data.gameId,
    score: data.score,
    timestamp: data.timestamp.toDate(),
    kind: data.kind,
  };
}

export const scoreService = {
  /**
   * Save a game score with timestamp-based ID (for history)
   */
  async saveScore({ userId, gameId, score }: SaveScoreParams): Promise<void> {
    try {
      const docId = `${gameId}-${Date.now()}-${userId}`;
      await setDoc(doc(db, COLLECTIONS.history, docId), {
        userId,
        gameId,
        score,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Failed to save score:", error);
      throw new Error("Failed to save score. Please try again.");
    }
  },

  /**
   * Save/update the best score for a user (single record per game)
   */
  async saveBestScore({
    userId,
    gameId,
    score,
  }: SaveScoreParams): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.best, `${gameId}-best-${userId}`), {
        userId,
        gameId,
        score,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Failed to save best score:", error);
      throw new Error("Failed to save best score. Please try again.");
    }
  },

  /**
   * Save score and update best if applicable
   */
  async saveGameResult(
    params: SaveScoreParams,
    currentBest: number
  ): Promise<{ isNewBest: boolean }> {
    await scoreService.saveScore(params);

    const isNewBest = params.score > currentBest;
    if (isNewBest) {
      await scoreService.saveBestScore(params);
    }

    return { isNewBest };
  },

  /**
   * Get high scores for a specific game
   */
  async getHighScores(
    gameId: GameId,
    limitCount = 10
  ): Promise<DisplayScore[]> {
    try {
      const bestQuery = query(
        collection(db, COLLECTIONS.best),
        where("gameId", "==", gameId),
        orderBy("score", "desc"),
        limit(limitCount)
      );
      const bestSnapshot = await getDocs(bestQuery);
      const bestScores = bestSnapshot.docs.map((d) => toDisplayScore(d));
      if (bestScores.length > 0) return bestScores;

      // Backward-compat fallback: legacy mixed collection.
      const legacyQuery = query(
        collection(db, COLLECTIONS.legacy),
        where("gameId", "==", gameId),
        where("kind", "==", "best"),
        orderBy("score", "desc"),
        limit(limitCount)
      );
      const legacySnapshot = await getDocs(legacyQuery);
      return legacySnapshot.docs.map((d) => toDisplayScore(d));
    } catch (error) {
      console.error("Failed to get high scores:", error);
      throw new Error("Failed to load leaderboard. Please try again.");
    }
  },

  /**
   * Get all scores for a specific user
   */
  async getUserScores(userId: string): Promise<DisplayScore[]> {
    try {
      const historyQuery = query(
        collection(db, COLLECTIONS.history),
        where("userId", "==", userId)
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyScores = historySnapshot.docs.map((d) => toDisplayScore(d));
      if (historyScores.length > 0) return historyScores;

      // Backward-compat fallback: legacy mixed collection.
      const legacyQuery = query(
        collection(db, COLLECTIONS.legacy),
        where("userId", "==", userId)
      );
      const legacySnapshot = await getDocs(legacyQuery);
      return legacySnapshot.docs.map((d) => toDisplayScore(d));
    } catch (error) {
      console.error("Failed to get user scores:", error);
      throw new Error("Failed to load your scores. Please try again.");
    }
  },

  async getUserBestScore(userId: string, gameId: GameId): Promise<number> {
    try {
      const bestDocId = `${gameId}-best-${userId}`;
      const bestSnapshot = await getDoc(doc(db, COLLECTIONS.best, bestDocId));
      if (bestSnapshot.exists()) {
        const data = bestSnapshot.data() as Partial<FirestoreScore>;
        return typeof data.score === "number" ? data.score : 0;
      }

      // Backward-compat fallback: legacy doc id.
      const legacySnapshot = await getDoc(doc(db, COLLECTIONS.legacy, bestDocId));
      if (!legacySnapshot.exists()) return 0;
      const legacyData = legacySnapshot.data() as Partial<FirestoreScore>;
      return typeof legacyData.score === "number" ? legacyData.score : 0;
    } catch (error) {
      console.error("Failed to get user best score:", error);
      return 0; // Return 0 on error to allow game to continue
    }
  },
};
