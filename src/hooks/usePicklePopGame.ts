import { useState, useEffect, useCallback, useRef } from "react";
import { useGameBase } from "./useGameBase";
import { useGameTimer } from "./useGameTimer";

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
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const picklesRef = useRef<PopPickle[]>([]);
  const nextIdRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const replacePickles = useCallback((nextPickles: PopPickle[]) => {
    picklesRef.current = nextPickles;
    setPickles(nextPickles);
  }, []);

  // Centralized cleanup function
  const clearAllIntervals = useCallback(() => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    if (expiredIntervalRef.current) {
      clearInterval(expiredIntervalRef.current);
      expiredIntervalRef.current = null;
    }
  }, []);

  // End the game
  const endGame = useCallback(async () => {
    clearAllIntervals();
    replacePickles([]);
    await gameBase.endGame();
  }, [gameBase, clearAllIntervals, replacePickles]);

  // Use shared timer hook - defined early for use in callbacks
  const timer = useGameTimer({
    initialTime: GAME_DURATION,
    onTimeUp: endGame,
  });

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
    const occupiedPositions = new Set(
      picklesRef.current.map((pickle) => pickle.position)
    );
    const availablePositions = Array.from({ length: 9 }, (_, index) =>
      index
    ).filter((position) => !occupiedPositions.has(position));
    if (availablePositions.length === 0) return;

    const position =
      availablePositions[
        Math.floor(Math.random() * availablePositions.length)
      ];
    const randomType = Math.random();
    const type: PickleType =
      randomType < 0.1
        ? "golden"
        : randomType < 0.25
          ? "rotten"
          : "normal";
    const newPickle: PopPickle = {
      id: nextIdRef.current++,
      position,
      type,
      expiresAt: Date.now() + getPickleDuration(),
    };

    replacePickles([...picklesRef.current, newPickle]);
  }, [getPickleDuration, replacePickles]);

  // Handle clicking a pickle
  const handlePickleClick = useCallback(
    (pickleId: number) => {
      if (!gameBase.isPlaying) return;

      const pickle = picklesRef.current.find((item) => item.id === pickleId);
      if (!pickle) return;

      // Remove the clicked pickle
      replacePickles(
        picklesRef.current.filter((item) => item.id !== pickleId)
      );

      if (pickle.type === "rotten") {
        // Clicked rotten pickle - penalty!
        setCombo(0);
        gameBase.updateScore(Math.max(0, gameBase.score - 50));
        timer.subtractTime(2);
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
    [gameBase, combo, replacePickles, timer]
  );

  // Start the game
  const startGame = useCallback(() => {
    replacePickles([]);
    setCombo(0);
    setMaxCombo(0);
    nextIdRef.current = 0;
    timer.reset();
    timer.start();
    gameBase.startGame();
  }, [gameBase, replacePickles, timer]);

  // Spawn pickles periodically and check for expired - combined into single effect
  useEffect(() => {
    if (!gameBase.isPlaying) {
      clearAllIntervals();
      return;
    }

    // Initial spawn
    spawnPickle();

    // Set up spawn interval
    const spawnInterval = setInterval(spawnPickle, getSpawnInterval());
    spawnIntervalRef.current = spawnInterval;

    // Set up expired check interval - uses functional update to avoid stale closure
    const expiredInterval = setInterval(() => {
      const now = Date.now();
      const expired = picklesRef.current.filter(
        (pickle) => pickle.expiresAt <= now
      );
      if (expired.some((pickle) => pickle.type !== "rotten")) {
        setCombo(0);
      }
      if (expired.length > 0) {
        replacePickles(
          picklesRef.current.filter((pickle) => pickle.expiresAt > now)
        );
      }
    }, 100);
    expiredIntervalRef.current = expiredInterval;

    return () => {
      clearInterval(spawnInterval);
      clearInterval(expiredInterval);
      if (spawnIntervalRef.current === spawnInterval) {
        spawnIntervalRef.current = null;
      }
      if (expiredIntervalRef.current === expiredInterval) {
        expiredIntervalRef.current = null;
      }
    };
  }, [
    gameBase.isPlaying,
    gameBase.level,
    spawnPickle,
    getSpawnInterval,
    clearAllIntervals,
    replacePickles,
  ]);

  return {
    pickles,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    level: gameBase.level,
    timeLeft: timer.timeLeft,
    combo,
    maxCombo,
    startGame,
    handlePickleClick,
  };
}
