"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/authContext";

export function HeroAuthCta() {
  const {
    user,
    isLoading,
    signInWithGoogle,
    authError,
    clearAuthError,
  } = useAuth();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

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
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {user.displayName?.split(" ")[0] || "friend"}
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

  const onGoogle = async () => {
    clearAuthError();
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Link href="/signup">
          <Button size="lg" className="group">
            Create account
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">
            Sign in
          </Button>
        </Link>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Use email and password on the sign-in pages, or continue with Google
        below.
      </p>
      <Button
        onClick={onGoogle}
        size="md"
        variant="secondary"
        disabled={googleSubmitting}
        isLoading={googleSubmitting}
      >
        Continue with Google
      </Button>
      {authError ? (
        <p role="alert" className="text-sm text-rose-700 dark:text-rose-400">
          {authError}{" "}
          <button type="button" className="underline" onClick={clearAuthError}>
            Dismiss
          </button>
        </p>
      ) : null}
    </div>
  );
}
