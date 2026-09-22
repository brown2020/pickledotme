"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/authContext";

export function HeroAuthCta() {
  const { user, isLoading, signInWithGoogle, signInWithEmail, authError } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

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

  const onEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch {
      // authError is surfaced via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={signInWithGoogle} size="lg" className="group">
        Get Started Free
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Sign in with Google to unlock all features
      </p>
      <button
        type="button"
        className="text-sm font-medium text-emerald-700 dark:text-emerald-400 underline-offset-2 hover:underline"
        onClick={() => setShowEmail((value) => !value)}
      >
        {showEmail ? "Hide email sign-in" : "Sign in with email instead"}
      </button>
      {showEmail ? (
        <form onSubmit={onEmailSubmit} className="space-y-3 max-w-sm text-left">
          <label className="block text-sm text-slate-700 dark:text-slate-300">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="block text-sm text-slate-700 dark:text-slate-300">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            />
          </label>
          {authError ? (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-400">
              {authError}
            </p>
          ) : null}
          <Button type="submit" size="md" disabled={submitting} isLoading={submitting}>
            Sign in with email
          </Button>
        </form>
      ) : null}
    </div>
  );
}
