import { useState, useCallback, useEffect } from "react";
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
    setState((prev) => ({
      ...prev,
      score,
      bestScore: Math.max(score, prev.bestScore),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      level: 1,
    }));
  }, []);

  const endGame = useCallback(async (finalScore = state.score) => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      score: finalScore,
      bestScore: Math.max(prev.bestScore, finalScore),
    }));
    await saveScore(finalScore);
  }, [saveScore, state.score]);

  const setLevel = useCallback((level: number) => {
    setState((prev) => ({ ...prev, level }));
  }, []);

  const resetGame = useCallback(() => {
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
