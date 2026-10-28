import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/providers/authContext";
import { getUserBestScore, saveGameResult } from "@/actions/scores";
import { GameId } from "@/config/games";

interface GameBaseState {
  isPlaying: boolean;
  score: number;
  bestScore: number;
  level: number;
}

interface UseGameBaseReturn extends GameBaseState {
  userId: string | undefined;
  isAuthenticated: boolean;
  startGame: () => void;
  endGame: (finalScore?: number) => Promise<void>;
  updateScore: (score: number) => void;
  setLevel: (level: number) => void;
  resetGame: () => void;
}

/**
 * Base hook for game state management with unified score saving
 */
export function useGameBase(gameId: GameId): UseGameBaseReturn {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid;
  const [state, setState] = useState<GameBaseState>({
    isPlaying: false,
    score: 0,
    bestScore: 0,
    level: 1,
  });
  // Latest score, including updates that have not re-rendered yet.
  // endGame reads this so a same-turn game over does not persist the previous score.
  const scoreRef = useRef(0);

  useEffect(() => {
    let isCurrent = true;

    if (!userId) {
      queueMicrotask(() => {
        if (!isCurrent) return;
        setState((prev) => ({ ...prev, bestScore: 0 }));
      });
      return () => {
        isCurrent = false;
      };
    }

    getUserBestScore(gameId)
      .then((bestScore) => {
        if (!isCurrent) return;
        setState((prev) => ({
          ...prev,
          bestScore: Math.max(prev.score, bestScore),
        }));
      })
      .catch((error) => {
        console.error("Failed to load best score:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [userId, gameId]);

  const saveScore = useCallback(
    async (score: number): Promise<{ isNewBest: boolean }> => {
      if (!userId) {
        return { isNewBest: false };
      }

      try {
        const result = await saveGameResult({ gameId, score });

        if (result.isNewBest) {
          setState((prev) => ({
            ...prev,
            bestScore: Math.max(prev.bestScore, score),
          }));
        }

        return result;
      } catch (error) {
        console.error("Failed to save score:", error);
        return { isNewBest: false };
      }
    },
    [userId, gameId]
  );

  const updateScore = useCallback((score: number) => {
    scoreRef.current = score;
    setState((prev) => ({
      ...prev,
      score,
      bestScore: Math.max(score, prev.bestScore),
    }));
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    setState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      level: 1,
    }));
  }, []);

  const endGame = useCallback(async (finalScore?: number) => {
    const score = finalScore ?? scoreRef.current;
    scoreRef.current = score;
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      score,
      bestScore: Math.max(prev.bestScore, score),
    }));
    await saveScore(score);
  }, [saveScore]);

  const setLevel = useCallback((level: number) => {
    setState((prev) => ({ ...prev, level }));
  }, []);

  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      score: 0,
      level: 1,
    }));
  }, []);

  return {
    ...state,
    userId,
    isAuthenticated,
    startGame,
    endGame,
    updateScore,
    setLevel,
    resetGame,
  };
}
