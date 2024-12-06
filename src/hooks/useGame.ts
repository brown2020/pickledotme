// src/hooks/useGame.ts
import { useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { GameState } from "@/types/game";

interface ScoreData {
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
}

const saveScore = async (data: ScoreData) => {
  const docId = `${data.gameId}-${Date.now()}-${data.userId}`;
  try {
    await setDoc(doc(db, "scores", docId), data);
    return true;
  } catch (error) {
    console.error("Error saving score:", error);
    return false;
  }
};

export function useGame(gameId: string) {
  const { scores, actions } = useGameStore();
  const [gameState, setGameState] = useState<GameState>(() => ({
    isPlaying: false,
    score: 0,
    bestScore: scores[gameId] || 0,
    level: 1,
  }));

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      level: 1,
    }));
  }, []);

  const updateGameStats = useCallback(
    async (score: number) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const scoreData: ScoreData = {
        userId,
        gameId,
        score,
        timestamp: new Date(),
      };

      const savedSuccessfully = await saveScore(scoreData);
      if (savedSuccessfully) {
        actions.updateScore(gameId, score);
        actions.updateGameStats(gameId, {
          totalScore: score,
          bestScore: Math.max(score, gameState.bestScore),
        });
      }
    },
    [gameId, gameState.bestScore, actions]
  );

  const endGame = useCallback(async () => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    await updateGameStats(gameState.score);
  }, [gameState.score, updateGameStats]);

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
