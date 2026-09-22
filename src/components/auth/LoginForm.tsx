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

export function LoginForm() {
  const { signInWithEmail, authError, clearAuthError } = useAuth();
  const searchParams = useSearchParams();
  const signupLink = withRedirect("/signup", searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errorId = useId();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    clearAuthError();
    try {
      await signInWithEmail(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {authError ? (
          <p
            id={errorId}
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
          >
            {authError}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="login-email"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoFocus
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-describedby={authError ? errorId : undefined}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            aria-describedby={authError ? errorId : undefined}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
          isLoading={submitting}
        >
          Sign in
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton />

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        New here?{" "}
        <Link
          href={signupLink}
          className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
