"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/providers/authContext";

type AuthMode = "signin" | "signup" | "forgot" | "forgot-sent";

const MODE_HEADINGS: Record<AuthMode, string> = {
  signin: "Sign in with email",
  signup: "Create an account",
  forgot: "Reset your password",
  "forgot-sent": "Check your email",
};

export function HeroAuthCta() {
  const {
    user,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    authError,
    clearAuthError,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const formHeadingId = useId();
  const errorId = useId();

  useEffect(() => {
    if (!showEmail) return;
    emailInputRef.current?.focus();
  }, [mode, showEmail]);

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

  const switchMode = (next: AuthMode) => {
    clearAuthError();
    setPassword("");
    setMode(next);
  };

  const toggleEmailPanel = () => {
    clearAuthError();
    setShowEmail((value) => {
      const next = !value;
      if (next) setMode("signin");
      return next;
    });
  };

  const onEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    clearAuthError();
    try {
      if (mode === "forgot") {
        const ok = await sendPasswordReset(email);
        if (ok) setMode("forgot-sent");
        return;
      }
      if (mode === "signup") {
        await signUpWithEmail(email, password);
        return;
      }
      await signInWithEmail(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel =
    mode === "signup"
      ? "Create account"
      : mode === "forgot"
        ? "Send reset link"
        : "Sign in with email";

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
        onClick={toggleEmailPanel}
        aria-expanded={showEmail}
      >
        {showEmail ? "Hide email options" : "Use email instead"}
      </button>
      {showEmail ? (
        <div
          className="space-y-3 max-w-sm text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-4 shadow-sm"
          role="region"
          aria-labelledby={formHeadingId}
        >
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Email auth mode">
            {(
              [
                ["signin", "Sign in"],
                ["signup", "Create account"],
                ["forgot", "Forgot password"],
              ] as const
            ).map(([value, label]) => {
              const selected =
                mode === value || (value === "forgot" && mode === "forgot-sent");
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={
                    selected
                      ? "rounded-lg px-3 py-1.5 text-sm font-semibold bg-emerald-700 text-white"
                      : "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                  onClick={() => switchMode(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <h3
            id={formHeadingId}
            className="text-base font-semibold text-slate-800 dark:text-slate-100"
          >
            {MODE_HEADINGS[mode]}
          </h3>

          {mode === "forgot-sent" ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 dark:text-slate-300" role="status">
                If an account exists for{" "}
                <span className="font-medium">{email.trim() || "that address"}</span>
                , we sent a password reset link. Check your inbox and spam folder.
              </p>
              <button
                type="button"
                className="text-sm font-medium text-emerald-700 dark:text-emerald-400 underline-offset-2 hover:underline"
                onClick={() => switchMode("signin")}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={onEmailSubmit} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="hero-auth-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email
                </label>
                <Input
                  ref={emailInputRef}
                  id="hero-auth-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-describedby={authError ? errorId : undefined}
                />
              </div>
              {mode !== "forgot" ? (
                <div>
                  <label
                    htmlFor="hero-auth-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Password
                  </label>
                  <Input
                    id="hero-auth-password"
                    type="password"
                    name="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    required
                    minLength={mode === "signup" ? 6 : undefined}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={
                      mode === "signup" ? "At least 6 characters" : "Your password"
                    }
                    aria-describedby={authError ? errorId : undefined}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We&apos;ll email you a link to choose a new password.
                </p>
              )}
              {authError ? (
                <p
                  id={errorId}
                  role="alert"
                  className="text-sm text-rose-700 dark:text-rose-400"
                >
                  {authError}
                </p>
              ) : null}
              <Button
                type="submit"
                size="md"
                disabled={submitting}
                isLoading={submitting}
                className="w-full"
              >
                {submitLabel}
              </Button>
              {mode === "signin" ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  New here?{" "}
                  <button
                    type="button"
                    className="font-medium text-emerald-700 dark:text-emerald-400 underline-offset-2 hover:underline"
                    onClick={() => switchMode("signup")}
                  >
                    Create an account
                  </button>
                  {" · "}
                  <button
                    type="button"
                    className="font-medium text-emerald-700 dark:text-emerald-400 underline-offset-2 hover:underline"
                    onClick={() => switchMode("forgot")}
                  >
                    Forgot password?
                  </button>
                </p>
              ) : null}
              {mode === "signup" ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-emerald-700 dark:text-emerald-400 underline-offset-2 hover:underline"
                    onClick={() => switchMode("signin")}
                  >
                    Sign in
                  </button>
                </p>
              ) : null}
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
