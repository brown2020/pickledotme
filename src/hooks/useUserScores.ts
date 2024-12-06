import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

export interface GameScore {
  gameId: string;
  score: number;
  timestamp: Timestamp;
}

export function useUserScores() {
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<GameScore[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const scoresQuery = query(
          collection(db, "scores"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(scoresQuery);
        const userScores: GameScore[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userScores.push({
            gameId: data.gameId,
            score: data.score,
            timestamp: data.timestamp,
          });
        });
        setScores(userScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { scores, isLoading };
}
