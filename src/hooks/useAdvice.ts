"use client";

import useSWR from "swr";
import { useAuth } from "@/providers/AuthProvider";
import {
  adviceService,
  AdviceMessage,
  AdviceThread,
} from "@/services/adviceService";

export function useAdviceThreads() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user?.uid ? `advice-threads-${user.uid}` : null,
    () =>
      user?.uid ? adviceService.listThreads(user.uid) : Promise.resolve([]),
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
        ? adviceService.getThreadMessages({ userId: user.uid, threadId })
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
