"use client";

import useSWR from "swr";
import { useAuth } from "@/providers/AuthProvider";
import { scoreService, DisplayScore } from "@/services/scoreService";
import { GameId } from "@/config/games";

/**
 * SWR fetcher for high scores
 */
const highScoresFetcher = async (gameId: GameId): Promise<DisplayScore[]> => {
  return scoreService.getHighScores(gameId);
};

/**
 * SWR fetcher for user scores
 */
const userScoresFetcher = async (userId: string): Promise<DisplayScore[]> => {
  return scoreService.getUserScores(userId);
};

/**
 * Hook for fetching high scores with SWR caching
 */
export function useHighScores(gameId: GameId) {
  const { data, error, isLoading, mutate } = useSWR(
    `high-scores-${gameId}`,
    () => highScoresFetcher(gameId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    scores: data ?? [],
    isLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}

/**
 * Hook for fetching user's scores with SWR caching
 */
export function useUserGameScores() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid ? `user-scores-${user.uid}` : null,
    () => (user?.uid ? userScoresFetcher(user.uid) : Promise.resolve([])),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  return {
    scores: data ?? [],
    isLoading: isLoading || isAuthLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}

/**
 * Hook for getting best score for a specific game
 */
export function useBestScore(gameId: GameId) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid ? `best-score-${gameId}-${user.uid}` : null,
    () =>
      user?.uid
        ? scoreService.getUserBestScore(user.uid, gameId)
        : Promise.resolve(0),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    bestScore: data ?? 0,
    isLoading: isLoading || isAuthLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}
