import { useState, useCallback, useEffect, useRef } from "react";
import { useGameBase } from "./useGameBase";

const GAME_ID = "reaction-pickle" as const;
const TOTAL_ROUNDS = 5;
const MIN_WAIT_TIME = 1500; // ms
const MAX_WAIT_TIME = 5000; // ms
const TOO_EARLY_PENALTY = 500; // ms added to average

export type GamePhase =
  | "waiting"
  | "ready"
  | "go"
  | "result"
  | "finished"
  | "too-early";

export interface RoundResult {
  round: number;
  reactionTime: number;
  tooEarly: boolean;
}

export function useReactionGame() {
  const gameBase = useGameBase(GAME_ID);
  const [phase, setPhase] = useState<GamePhase>("waiting");
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(
    null
  );
  const [averageTime, setAverageTime] = useState<number | null>(null);

  const goTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<RoundResult[]>([]);
  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const calculateScore = useCallback((avgTime: number) => {
    // Score based on reaction time: faster = higher score
    // 200ms or less = 1000 points, scales down from there
    if (avgTime <= 200) return 1000;
    if (avgTime >= 1000) return 100;
    return Math.round(1000 - ((avgTime - 200) / 800) * 900);
  }, []);

  const startRound = useCallback(() => {
    setPhase("ready");
    setCurrentReactionTime(null);

    // Random wait time before showing "GO"
    const waitTime =
      MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);

    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = Date.now();
      setPhase("go");
    }, waitTime);
  }, []);

  const finishGame = useCallback(
    async (finalResults?: RoundResult[]) => {
      setPhase("finished");

      // Calculate average (including penalties)
      const allResults = [...(finalResults ?? resultsRef.current)];
      if (allResults.length > 0) {
        const avg =
          allResults.reduce((sum, r) => sum + r.reactionTime, 0) /
          allResults.length;
        setAverageTime(Math.round(avg));

        const finalScore = calculateScore(avg);
        gameBase.updateScore(finalScore);
        await gameBase.saveScore(finalScore);
      }
    },
    [calculateScore, gameBase]
  );

  const handleClick = useCallback(() => {
    if (phase === "waiting" || phase === "finished") return;

    if (phase === "ready") {
      // Clicked too early!
      clearTimeouts();
      setPhase("too-early");
      setResults((prev) => {
        const next = [
          ...prev,
          {
            round: currentRound + 1,
            reactionTime: TOO_EARLY_PENALTY,
            tooEarly: true,
          },
        ];
        resultsRef.current = next;
        return next;
      });

      // Auto-advance after showing penalty
      timeoutRef.current = setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          finishGame(resultsRef.current);
        } else {
          setCurrentRound((prev) => prev + 1);
          startRound();
        }
      }, 1500);
      return;
    }

    if (phase === "go") {
      const reactionTime = Date.now() - goTimeRef.current;
      setCurrentReactionTime(reactionTime);
      setPhase("result");

      setResults((prev) => {
        const next = [
          ...prev,
          { round: currentRound + 1, reactionTime, tooEarly: false },
        ];
        resultsRef.current = next;
        return next;
      });

      // Auto-advance to next round
      timeoutRef.current = setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          finishGame(resultsRef.current);
        } else {
          setCurrentRound((prev) => prev + 1);
          startRound();
        }
      }, 1500);
    }
  }, [phase, currentRound, clearTimeouts, startRound, finishGame]);

  const startGame = useCallback(() => {
    clearTimeouts();
    setResults([]);
    resultsRef.current = [];
    setCurrentRound(0);
    setCurrentReactionTime(null);
    setAverageTime(null);
    gameBase.startGame();
    startRound();
  }, [clearTimeouts, gameBase, startRound]);

  const resetGame = useCallback(() => {
    clearTimeouts();
    setPhase("waiting");
    setResults([]);
    resultsRef.current = [];
    setCurrentRound(0);
    setCurrentReactionTime(null);
    setAverageTime(null);
    gameBase.resetGame();
  }, [clearTimeouts, gameBase]);

  return {
    phase,
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    results,
    currentReactionTime,
    averageTime,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    isPlaying: gameBase.isPlaying,
    startGame,
    resetGame,
    handleClick,
  };
}
