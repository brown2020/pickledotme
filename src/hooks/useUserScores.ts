import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import { scoreService } from "@/services/scoreService";

export interface GameScore {
  gameId: string;
  score: number;
  timestamp: Timestamp;
}

export function useUserScores() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<GameScore[]>([]);

  useEffect(() => {
    async function fetchScores() {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const userScores = await scoreService.getUserScores(user.uid);
        // Convert to the expected format
        const formattedScores: GameScore[] = userScores.map((score) => ({
          gameId: score.gameId,
          score: score.score,
          timestamp: Timestamp.fromDate(score.timestamp),
        }));
        setScores(formattedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading) {
      fetchScores();
    }
  }, [user?.uid, isAuthLoading]);

  return { scores, isLoading: isLoading || isAuthLoading };
}
