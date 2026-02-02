"use client";

import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/cn";

export function HeaderAuthControls({ className }: { className?: string }) {
  const { user, isLoading, logout, signInWithGoogle, authError, clearAuthError } = useAuth();

  const handleAuth = useCallback(async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
    }
  }, [logout, signInWithGoogle, user]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(clearAuthError, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearAuthError]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse",
          className
        )}
      />
    );
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {user.displayName?.split(" ")[0]}
        </span>
        <Button
          onClick={handleAuth}
          variant="ghost"
          size="sm"
          className={cn(className?.includes("w-full") ? "w-full" : undefined)}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Button
        onClick={handleAuth}
        variant="primary"
        size="sm"
      >
        Sign In
      </Button>
      {authError && (
        <p className="text-xs text-rose-500 dark:text-rose-400 max-w-[200px] text-right">
          {authError}
        </p>
      )}
    </div>
  );
}
