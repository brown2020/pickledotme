"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/providers/authContext";
import { AuthDivider } from "./AuthDivider";
import { GoogleAuthButton } from "./GoogleAuthButton";

function withRedirect(base: string, redirect: string | null) {
  if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }
  return base;
}

export function SignupForm() {
  const { signUpWithEmail, authError, clearAuthError } = useAuth();
  const searchParams = useSearchParams();
  const loginLink = withRedirect("/login", searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const errorId = useId();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {displayError ? (
          <p
            id={errorId}
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
          >
            {displayError}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            autoFocus
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-describedby={displayError ? errorId : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            aria-describedby={displayError ? errorId : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm password
          </label>
          <Input
            id="signup-confirm-password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat password"
            aria-describedby={displayError ? errorId : undefined}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
          isLoading={submitting}
        >
          Create account
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton label="Sign up with Google" />

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href={loginLink}
          className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
