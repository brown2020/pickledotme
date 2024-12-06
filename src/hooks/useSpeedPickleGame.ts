import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

interface Pickle {
  id: number;
  isTarget: boolean;
  shade: number;
}

export function useSpeedPickleGame() {
  const [pickles, setPickles] = useState<Pickle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);

  const generatePickles = useCallback(() => {
    const gridSize = Math.min(16 + (level - 1) * 4, 36);
    const targetIndex = Math.floor(Math.random() * gridSize);
    const targetShade = 500 - (level - 1) * 20;
    const regularShade = 400 - (level - 1) * 20;

    return Array.from({ length: gridSize }, (_, index) => ({
      id: index,
      isTarget: index === targetIndex,
      shade: index === targetIndex ? targetShade : regularShade,
    }));
  }, [level]);

  const handleGameOver = useCallback(async () => {
    setIsPlaying(false);
    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, "scores", `speed-${Date.now()}-${userId}`), {
        userId,
        gameId: "speed-pickle",
        score,
        timestamp: new Date(),
      });
    }
  }, [score]);

  const startGame = useCallback(() => {
    setPickles(generatePickles());
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setIsPlaying(true);
  }, [generatePickles]);

  const handlePickleClick = useCallback(
    async (isTarget: boolean) => {
      if (!isPlaying) return;

      if (isTarget) {
        const newScore = score + 100 * level;
        setScore(newScore);

        if (newScore % 500 === 0) {
          setLevel((prev) => prev + 1);
        }

        if (newScore > bestScore) {
          setBestScore(newScore);
          const userId = auth.currentUser?.uid;
          if (userId) {
            await setDoc(doc(db, "scores", `speed-${userId}`), {
              userId,
              gameId: "speed-pickle",
              score: newScore,
              timestamp: new Date(),
            });
          }
        }
        setPickles(generatePickles());
        setTimeLeft((prev) => Math.min(prev + 1, 30));
      } else {
        setScore((prev) => Math.max(0, prev - 25));
        setTimeLeft((prev) => Math.max(0, prev - 2));
      }
    },
    [isPlaying, score, level, bestScore, generatePickles]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [handleGameOver, isPlaying, timeLeft]);

  return {
    pickles,
    isPlaying,
    score,
    bestScore,
    timeLeft,
    level,
    startGame,
    handlePickleClick,
  };
}
