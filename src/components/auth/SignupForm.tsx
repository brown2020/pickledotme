"use client";

import { FormEvent, useId, useReducer } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/providers/authContext";
import { AuthDivider } from "./AuthDivider";
import { GoogleAuthButton } from "./GoogleAuthButton";

function withRedirect(base: string, redirect: string | null | undefined) {
  if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }
  return base;
}

type SignupState = {
  email: string;
  password: string;
  confirmPassword: string;
  localError: string | null;
  submitting: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
};

type SignupAction =
  | {
      type: "set";
      field: keyof SignupState;
      value: SignupState[keyof SignupState];
    }
  | { type: "reset_error" }
  | { type: "local_error"; message: string }
  | { type: "submit_start" }
  | { type: "submit_end" };

const initialState: SignupState = {
  email: "",
  password: "",
  confirmPassword: "",
  localError: null,
  submitting: false,
  showPassword: false,
  showConfirmPassword: false,
};

function signupReducer(state: SignupState, action: SignupAction): SignupState {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "reset_error":
      return { ...state, localError: null };
    case "local_error":
      return { ...state, localError: action.message, submitting: false };
    case "submit_start":
      return { ...state, submitting: true, localError: null };
    case "submit_end":
      return { ...state, submitting: false };
    default:
      return state;
  }
}

type SignupFormProps = {
  redirectTo?: string | null;
};

export function SignupForm({ redirectTo = null }: SignupFormProps) {
  const { signUpWithEmail, authError, clearAuthError } = useAuth();
  const loginLink = withRedirect("/login", redirectTo);
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const errorId = useId();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "reset_error" });
    clearAuthError();

    if (state.password.length < 6) {
      dispatch({
        type: "local_error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: "local_error", message: "Passwords do not match." });
      return;
    }

    dispatch({ type: "submit_start" });
    try {
      await signUpWithEmail(state.email, state.password);
    } finally {
      dispatch({ type: "submit_end" });
    }
  };

  const displayError = state.localError || authError;

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
            name="email"
            autoComplete="username"
            required
            value={state.email}
            onChange={(event) =>
              dispatch({ type: "set", field: "email", value: event.target.value })
            }
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
          <div className="relative">
            <Input
              id="signup-password"
              type={state.showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={state.password}
              onChange={(event) =>
                dispatch({
                  type: "set",
                  field: "password",
                  value: event.target.value,
                })
              }
              placeholder="At least 6 characters"
              className="pr-12"
              aria-describedby={displayError ? errorId : undefined}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() =>
                dispatch({
                  type: "set",
                  field: "showPassword",
                  value: !state.showPassword,
                })
              }
              aria-label={
                state.showPassword ? "Hide password" : "Show password"
              }
              aria-pressed={state.showPassword}
            >
              {state.showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="signup-confirm-password"
              type={state.showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              required
              minLength={6}
              value={state.confirmPassword}
              onChange={(event) =>
                dispatch({
                  type: "set",
                  field: "confirmPassword",
                  value: event.target.value,
                })
              }
              placeholder="Repeat password"
              className="pr-12"
              aria-describedby={displayError ? errorId : undefined}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-400 dark:hover:text-slate-100"
              onClick={() =>
                dispatch({
                  type: "set",
                  field: "showConfirmPassword",
                  value: !state.showConfirmPassword,
                })
              }
              aria-label={
                state.showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={state.showConfirmPassword}
            >
              {state.showConfirmPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={state.submitting}
          isLoading={state.submitting}
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
