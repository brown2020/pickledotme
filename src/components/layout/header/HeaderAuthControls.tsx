"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/authContext";
import { cn } from "@/lib/cn";

export function HeaderAuthControls({ className }: { className?: string }) {
  const { user, isLoading, logout, authError, clearAuthError } = useAuth();

  const handleSignOut = useCallback(async () => {
    clearAuthError();
    await logout();
  }, [clearAuthError, logout]);

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
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className={cn(className?.includes("w-full") ? "w-full" : undefined)}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  const fullWidth = className?.includes("w-full");

  return (
    <div
      className={cn(
        fullWidth
          ? "flex flex-col gap-2 w-full"
          : "flex flex-col items-end gap-1",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          fullWidth && "flex-col w-full"
        )}
      >
        <Link href="/login" className={cn(fullWidth && "w-full")}>
          <Button
            variant="primary"
            size="sm"
            className={cn(fullWidth && "w-full")}
          >
            Sign in
          </Button>
        </Link>
        <Link href="/signup" className={cn(fullWidth && "w-full")}>
          <Button
            variant="outline"
            size="sm"
            className={cn(fullWidth && "w-full")}
          >
            Create account
          </Button>
        </Link>
      </div>
      {authError ? (
        <p
          role="alert"
          className="text-xs text-rose-500 dark:text-rose-400 max-w-[220px] text-right"
        >
          {authError}{" "}
          <button type="button" className="underline" onClick={clearAuthError}>
            Dismiss
          </button>
        </p>
      ) : null}
    </div>
  );
}
