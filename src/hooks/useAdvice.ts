"use client";

import useSWR from "swr";
import { useAuth } from "@/providers/authContext";
import {
  getAdviceThreadMessages,
  listAdviceThreads,
} from "@/actions/adviceThreads";
import type { AdviceMessage, AdviceThread } from "@/types/advice";

export function useAdviceThreads() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid ? `advice-threads-${user.uid}` : null,
    () => (user?.uid ? listAdviceThreads() : Promise.resolve([])),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    threads: (data ?? []) as AdviceThread[],
    isLoading: isLoading || isAuthLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}

export function useAdviceThread(threadId: string | null) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid && threadId ? `advice-thread-${threadId}-${user.uid}` : null,
    () =>
      user?.uid && threadId
        ? getAdviceThreadMessages({ threadId })
        : Promise.resolve([]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    messages: (data ?? []) as AdviceMessage[],
    isLoading: isLoading || isAuthLoading,
    isError: !!error,
    error,
    refetch: mutate,
  };
}
