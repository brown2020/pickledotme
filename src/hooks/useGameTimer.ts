import { useState, useEffect, useCallback, useRef } from "react";

interface UseGameTimerOptions {
  initialTime: number;
  onTimeUp?: () => void | Promise<void>;
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
  const timeLeftRef = useRef(initialTime);
  const isRunningRef = useRef(autoStart);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const finish = useCallback(() => {
    if (!isRunningRef.current) return;

    isRunningRef.current = false;
    setIsRunning(false);
    void onTimeUpRef.current?.();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      const nextTime = Math.max(0, timeLeftRef.current - 1);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);

      if (nextTime === 0) finish();
    }, 1000);

    return () => clearInterval(timer);
  }, [finish, isRunning]);

  const start = useCallback(() => {
    isRunningRef.current = true;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    timeLeftRef.current = initialTime;
    isRunningRef.current = false;
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  const addTime = useCallback(
    (seconds: number) => {
      const nextTime = Math.min(timeLeftRef.current + seconds, initialTime);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);
    },
    [initialTime]
  );

  const subtractTime = useCallback(
    (seconds: number) => {
      const nextTime = Math.max(0, timeLeftRef.current - seconds);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);

      if (nextTime === 0) finish();
    },
    [finish]
  );

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
