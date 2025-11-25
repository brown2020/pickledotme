import { useState, useEffect, useCallback, useRef } from "react";
import { useGameBase } from "./useGameBase";

const GAME_ID = "pickle-pop" as const;
const GAME_DURATION = 30; // seconds
const BASE_PICKLE_DURATION = 1500; // ms - how long pickle stays visible
const MIN_PICKLE_DURATION = 600; // ms - minimum visibility at high levels
const SPAWN_INTERVAL_BASE = 1200; // ms - time between spawns
const MIN_SPAWN_INTERVAL = 400; // ms

export type PickleType = "normal" | "golden" | "rotten";

export interface PopPickle {
  id: number;
  position: number; // Grid position 0-8
  type: PickleType;
  expiresAt: number;
}

export function usePicklePopGame() {
  const gameBase = useGameBase(GAME_ID);
  const [pickles, setPickles] = useState<PopPickle[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const nextIdRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate difficulty-based durations
  const getPickleDuration = useCallback(() => {
    const reduction = (gameBase.level - 1) * 100;
    return Math.max(MIN_PICKLE_DURATION, BASE_PICKLE_DURATION - reduction);
  }, [gameBase.level]);

  const getSpawnInterval = useCallback(() => {
    const reduction = (gameBase.level - 1) * 80;
    return Math.max(MIN_SPAWN_INTERVAL, SPAWN_INTERVAL_BASE - reduction);
  }, [gameBase.level]);

  // Spawn a new pickle
  const spawnPickle = useCallback(() => {
    const occupiedPositions = pickles.map((p) => p.position);
    const availablePositions = Array.from({ length: 9 }, (_, i) => i).filter(
      (pos) => !occupiedPositions.includes(pos)
    );

    if (availablePositions.length === 0) return;

    const position =
      availablePositions[Math.floor(Math.random() * availablePositions.length)];

    // Determine pickle type (10% golden, 15% rotten, 75% normal)
    const rand = Math.random();
    let type: PickleType = "normal";
    if (rand < 0.1) type = "golden";
    else if (rand < 0.25) type = "rotten";

    const newPickle: PopPickle = {
      id: nextIdRef.current++,
      position,
      type,
      expiresAt: Date.now() + getPickleDuration(),
    };

    setPickles((prev) => [...prev, newPickle]);
  }, [pickles, getPickleDuration]);

  // Handle clicking a pickle
  const handlePickleClick = useCallback(
    (pickleId: number) => {
      if (!gameBase.isPlaying) return;

      const pickle = pickles.find((p) => p.id === pickleId);
      if (!pickle) return;

      // Remove the clicked pickle
      setPickles((prev) => prev.filter((p) => p.id !== pickleId));

      if (pickle.type === "rotten") {
        // Clicked rotten pickle - penalty!
        setCombo(0);
        gameBase.updateScore(Math.max(0, gameBase.score - 50));
        setTimeLeft((prev) => Math.max(0, prev - 2));
      } else {
        // Good pickle clicked
        const basePoints = pickle.type === "golden" ? 150 : 50;
        const comboMultiplier = 1 + combo * 0.1;
        const points = Math.round(basePoints * comboMultiplier);

        setCombo((prev) => prev + 1);
        setMaxCombo((prev) => Math.max(prev, combo + 1));
        gameBase.updateScore(gameBase.score + points);

        // Level up every 500 points
        if (gameBase.score + points >= gameBase.level * 500) {
          gameBase.setLevel(gameBase.level + 1);
        }
      }
    },
    [gameBase, pickles, combo]
  );

  // Handle missed pickle (expired)
  const handlePickleMissed = useCallback((pickleId: number) => {
    setPickles((prev) => prev.filter((p) => p.id !== pickleId));
    setCombo(0); // Break combo on miss
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    setPickles([]);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setMaxCombo(0);
    nextIdRef.current = 0;
    gameBase.startGame();
  }, [gameBase]);

  // End the game
  const endGame = useCallback(async () => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    setPickles([]);
    await gameBase.endGame();
  }, [gameBase]);

  // Spawn pickles periodically
  useEffect(() => {
    if (!gameBase.isPlaying) return;

    const spawn = () => {
      spawnPickle();
    };

    // Initial spawn
    spawn();

    // Set up interval
    spawnIntervalRef.current = setInterval(spawn, getSpawnInterval());

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [gameBase.isPlaying, gameBase.level, spawnPickle, getSpawnInterval]);

  // Timer countdown
  useEffect(() => {
    if (!gameBase.isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameBase.isPlaying, endGame]);

  // Check for expired pickles
  useEffect(() => {
    if (!gameBase.isPlaying || pickles.length === 0) return;

    const checkExpired = () => {
      const now = Date.now();
      const expired = pickles.filter((p) => p.expiresAt <= now);
      expired.forEach((p) => {
        if (p.type !== "rotten") {
          // Only count as miss if it wasn't a rotten pickle
          handlePickleMissed(p.id);
        } else {
          // Rotten pickle expired - that's good!
          setPickles((prev) => prev.filter((pickle) => pickle.id !== p.id));
        }
      });
    };

    const interval = setInterval(checkExpired, 100);
    return () => clearInterval(interval);
  }, [gameBase.isPlaying, pickles, handlePickleMissed]);

  return {
    pickles,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    level: gameBase.level,
    timeLeft,
    combo,
    maxCombo,
    startGame,
    handlePickleClick,
  };
}


