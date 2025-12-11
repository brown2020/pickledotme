import { useState, useEffect, useCallback, useRef } from "react";

interface UseGameTimerOptions {
  initialTime: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

interface UseGameTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
}

/**
 * Shared timer hook for game timing logic
 * Consolidates timer patterns from usePicklePopGame, useSpeedPickleGame, useWordGame
 */
export function useGameTimer({
  initialTime,
  onTimeUp,
  autoStart = false,
}: UseGameTimerOptions): UseGameTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref updated
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  const addTime = useCallback(
    (seconds: number) => {
      setTimeLeft((prev) => Math.min(prev + seconds, initialTime));
    },
    [initialTime]
  );

  const subtractTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev - seconds));
  }, []);

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    addTime,
    subtractTime,
  };
}
