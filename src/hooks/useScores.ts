"use client";

import useSWR from "swr";
import { useAuth } from "@/providers/authContext";
import { getHighScores, getUserGameScores } from "@/actions/scores";
import type { DisplayScore } from "@/types/score";
import { GameId } from "@/config/games";

/**
 * SWR fetcher for high scores
 */
const highScoresFetcher = async (gameId: GameId): Promise<DisplayScore[]> => {
  return getHighScores(gameId);
};

/**
 * SWR fetcher for user scores
 */
const userScoresFetcher = async (): Promise<DisplayScore[]> => {
  return getUserGameScores();
};

/**
 * Hook for fetching high scores with SWR caching.
 * Waits for auth (games routes are session-gated) so we do not race the
 * session cookie and flash "Failed to load leaderboard".
 */
export function useHighScores(gameId: GameId) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    !isAuthLoading && user?.uid ? `high-scores-${gameId}-${user.uid}` : null,
    () => highScoresFetcher(gameId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
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
 * Hook for fetching user's scores with SWR caching
 */
export function useUserGameScores() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid ? `user-scores-${user.uid}` : null,
    () => (user?.uid ? userScoresFetcher() : Promise.resolve([])),
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
