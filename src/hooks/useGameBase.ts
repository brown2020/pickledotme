import { useState, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { scoreService } from "@/services/scoreService";
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
  endGame: () => Promise<void>;
  updateScore: (score: number) => void;
  setLevel: (level: number) => void;
  saveScore: (score: number) => Promise<{ isNewBest: boolean }>;
  resetGame: () => void;
}

/**
 * Base hook for game state management with unified score saving
 */
export function useGameBase(gameId: GameId): UseGameBaseReturn {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<GameBaseState>({
    isPlaying: false,
    score: 0,
    bestScore: 0,
    level: 1,
  });

  const saveScore = useCallback(
    async (score: number): Promise<{ isNewBest: boolean }> => {
      if (!user?.uid) {
        return { isNewBest: false };
      }

      try {
        const result = await scoreService.saveGameResult(
          {
            userId: user.uid,
            gameId,
            score,
          },
          state.bestScore
        );

        if (result.isNewBest) {
          setState((prev) => ({ ...prev, bestScore: score }));
        }

        return result;
      } catch (error) {
        console.error("Failed to save score:", error);
        return { isNewBest: false };
      }
    },
    [user?.uid, gameId, state.bestScore]
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

  const endGame = useCallback(async () => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    await saveScore(state.score);
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
    userId: user?.uid,
    isAuthenticated,
    startGame,
    endGame,
    updateScore,
    setLevel,
    saveScore,
    resetGame,
  };
}


