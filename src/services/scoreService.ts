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

type ScoreKind = "history" | "best";

interface FirestoreScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Timestamp;
  kind?: ScoreKind;
}

export interface DisplayScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
  kind?: ScoreKind;
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
    const docId = `${gameId}-${Date.now()}-${userId}`;
    await setDoc(doc(db, "scores", docId), {
      userId,
      gameId,
      score,
      timestamp: Timestamp.now(),
      kind: "history" satisfies ScoreKind,
    });
  },

  /**
   * Save/update the best score for a user (single record per game)
   */
  async saveBestScore({
    userId,
    gameId,
    score,
  }: SaveScoreParams): Promise<void> {
    await setDoc(doc(db, "scores", `${gameId}-best-${userId}`), {
      userId,
      gameId,
      score,
      timestamp: Timestamp.now(),
      kind: "best" satisfies ScoreKind,
    });
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
    const q = query(
      collection(db, "scores"),
      where("gameId", "==", gameId),
      where("kind", "==", "best"),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => toDisplayScore(d));
  },

  /**
   * Get all scores for a specific user
   */
  async getUserScores(userId: string): Promise<DisplayScore[]> {
    const q = query(collection(db, "scores"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => toDisplayScore(d));
  },

  async getUserBestScore(userId: string, gameId: GameId): Promise<number> {
    const snapshot = await getDoc(
      doc(db, "scores", `${gameId}-best-${userId}`)
    );
    if (!snapshot.exists()) return 0;
    const data = snapshot.data() as Partial<FirestoreScore>;
    return typeof data.score === "number" ? data.score : 0;
  },
};
