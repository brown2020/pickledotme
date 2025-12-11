"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Skeleton } from "@/components/ui";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Loading state wrapper for authenticated routes.
 * Route protection is handled by proxy.ts - this just handles loading UI.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      fallback || (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
