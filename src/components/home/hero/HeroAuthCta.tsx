"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";

export function HeroAuthCta() {
  const { user, isLoading, signInWithGoogle } = useAuth();

  if (isLoading) {
    return (
      <div className="h-12 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Welcome back,{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {user.displayName?.split(" ")[0]}
          </span>
          !
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/pickle">
            <Button size="lg" className="group">
              Get Advice
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/games">
            <Button size="lg" variant="outline">
              Play Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={signInWithGoogle} size="lg" className="group">
        Get Started Free
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Sign in with Google to unlock all features
      </p>
    </div>
  );
}
