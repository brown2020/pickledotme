// src/hooks/useGame.ts
import { useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { GameState } from "@/types/game";

export function useGame(gameId: string) {
  const { scores, actions } = useGameStore();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    bestScore: scores[gameId] || 0,
    level: 1,
  });

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      level: 1,
    }));
  }, []);

  const endGame = useCallback(async () => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));

    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, "scores", `${gameId}-${Date.now()}-${userId}`), {
        userId,
        gameId,
        score: gameState.score,
        timestamp: new Date(),
      });

      actions.updateScore(gameId, gameState.score);
      actions.updateGameStats(gameId, {
        totalScore: gameState.score,
        bestScore: Math.max(gameState.score, gameState.bestScore),
      });
    }
  }, [gameId, gameState.score, gameState.bestScore, actions]);

  const updateScore = useCallback((newScore: number) => {
    setGameState((prev) => ({
      ...prev,
      score: newScore,
      bestScore: Math.max(newScore, prev.bestScore),
    }));
  }, []);

  const updateLevel = useCallback((newLevel: number) => {
    setGameState((prev) => ({
      ...prev,
      level: newLevel,
    }));
  }, []);

  return {
    gameState,
    startGame,
    endGame,
    updateScore,
    updateLevel,
  };
}
