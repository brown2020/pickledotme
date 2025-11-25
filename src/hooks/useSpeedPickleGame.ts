import { useState, useEffect, useCallback } from "react";
import { useGameBase } from "./useGameBase";

const GAME_ID = "speed-pickle" as const;
const INITIAL_TIME = 30;

interface Pickle {
  id: number;
  isTarget: boolean;
  shade: number;
}

export function useSpeedPickleGame() {
  const gameBase = useGameBase(GAME_ID);
  const [pickles, setPickles] = useState<Pickle[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  const generatePickles = useCallback(() => {
    const gridSize = Math.min(16 + (gameBase.level - 1) * 4, 36);
    const targetIndex = Math.floor(Math.random() * gridSize);
    const targetShade = 500 - (gameBase.level - 1) * 20;
    const regularShade = 400 - (gameBase.level - 1) * 20;

    return Array.from({ length: gridSize }, (_, index) => ({
      id: index,
      isTarget: index === targetIndex,
      shade: index === targetIndex ? targetShade : regularShade,
    }));
  }, [gameBase.level]);

  const handleGameOver = useCallback(async () => {
    await gameBase.endGame();
  }, [gameBase]);

  const startGame = useCallback(() => {
    gameBase.startGame();
    setPickles(generatePickles());
    setTimeLeft(INITIAL_TIME);
  }, [gameBase, generatePickles]);

  const handlePickleClick = useCallback(
    async (isTarget: boolean) => {
      if (!gameBase.isPlaying) return;

      if (isTarget) {
        const newScore = gameBase.score + 100 * gameBase.level;
        gameBase.updateScore(newScore);

        // Level up every 500 points
        if (newScore % 500 === 0) {
          gameBase.setLevel(gameBase.level + 1);
        }

        // Save if new best
        if (newScore > gameBase.bestScore) {
          await gameBase.saveScore(newScore);
        }

        setPickles(generatePickles());
        setTimeLeft((prev) => Math.min(prev + 1, INITIAL_TIME));
      } else {
        gameBase.updateScore(Math.max(0, gameBase.score - 25));
        setTimeLeft((prev) => Math.max(0, prev - 2));
      }
    },
    [gameBase, generatePickles]
  );

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameBase.isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameBase.isPlaying) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameBase.isPlaying, timeLeft, handleGameOver]);

  // Regenerate pickles when level changes
  useEffect(() => {
    if (gameBase.isPlaying) {
      setPickles(generatePickles());
    }
  }, [gameBase.level, gameBase.isPlaying, generatePickles]);

  return {
    pickles,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    timeLeft,
    level: gameBase.level,
    startGame,
    handlePickleClick,
  };
}
