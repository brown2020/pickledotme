import { useState, useCallback } from "react";
import { useGameBase } from "./useGameBase";
import { useGameTimer } from "./useGameTimer";

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

  const handleGameOver = useCallback(async () => {
    await gameBase.endGame();
  }, [gameBase]);

  // Use shared timer hook
  const timer = useGameTimer({
    initialTime: INITIAL_TIME,
    onTimeUp: handleGameOver,
  });

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

  const startGame = useCallback(() => {
    gameBase.startGame();
    setPickles(generatePickles());
    timer.reset();
    timer.start();
  }, [gameBase, generatePickles, timer]);

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
        timer.addTime(1);
      } else {
        gameBase.updateScore(Math.max(0, gameBase.score - 25));
        timer.subtractTime(2);
      }
    },
    [gameBase, generatePickles, timer]
  );

  return {
    pickles,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    timeLeft: timer.timeLeft,
    level: gameBase.level,
    startGame,
    handlePickleClick,
  };
}
