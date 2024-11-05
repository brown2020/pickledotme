// src/lib/firebaseConfig.ts

import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

interface FirestoreScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Timestamp;
}

export const firebaseHelpers = {
  saveScore: async (userId: string, gameId: string, score: number) => {
    const docRef = doc(db, "scores", `${gameId}-${Date.now()}-${userId}`);
    await setDoc(docRef, {
      userId,
      gameId,
      score,
      timestamp: Timestamp.now(),
    });
  },

  getHighScores: async (
    gameId: string,
    limitCount = 10
  ): Promise<FirestoreScore[]> => {
    const q = query(
      collection(db, "scores"),
      where("gameId", "==", gameId),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        gameId: data.gameId,
        score: data.score,
        timestamp: data.timestamp,
      };
    });
  },
};
