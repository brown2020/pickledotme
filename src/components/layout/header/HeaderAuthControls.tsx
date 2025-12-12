"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/cn";

export function HeaderAuthControls({ className }: { className?: string }) {
  const { user, isLoading, logout, signInWithGoogle } = useAuth();

  const handleAuth = useCallback(async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
    }
  }, [logout, signInWithGoogle, user]);

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
    <Button
      onClick={handleAuth}
      variant="primary"
      size="sm"
      className={className}
    >
      Sign In
    </Button>
  );
}
