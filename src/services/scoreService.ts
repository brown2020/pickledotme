import {
  doc,
  setDoc,
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

interface FirestoreScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Timestamp;
}

export interface DisplayScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
}

class ScoreService {
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
    });
  }

  /**
   * Save/update the best score for a user (single record per game)
   */
  async saveBestScore({ userId, gameId, score }: SaveScoreParams): Promise<void> {
    await setDoc(doc(db, "scores", `${gameId}-best-${userId}`), {
      userId,
      gameId,
      score,
      timestamp: Timestamp.now(),
    });
  }

  /**
   * Save score and update best if applicable
   */
  async saveGameResult(
    params: SaveScoreParams,
    currentBest: number
  ): Promise<{ isNewBest: boolean }> {
    await this.saveScore(params);

    const isNewBest = params.score > currentBest;
    if (isNewBest) {
      await this.saveBestScore(params);
    }

    return { isNewBest };
  }

  /**
   * Get high scores for a specific game
   */
  async getHighScores(gameId: GameId, limitCount = 10): Promise<DisplayScore[]> {
    const q = query(
      collection(db, "scores"),
      where("gameId", "==", gameId),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FirestoreScore, "id">;
      return {
        id: doc.id,
        userId: data.userId,
        gameId: data.gameId,
        score: data.score,
        timestamp: data.timestamp.toDate(),
      };
    });
  }

  /**
   * Get all scores for a specific user
   */
  async getUserScores(userId: string): Promise<DisplayScore[]> {
    const q = query(collection(db, "scores"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FirestoreScore, "id">;
      return {
        id: doc.id,
        userId: data.userId,
        gameId: data.gameId,
        score: data.score,
        timestamp: data.timestamp.toDate(),
      };
    });
  }
}

export const scoreService = new ScoreService();


