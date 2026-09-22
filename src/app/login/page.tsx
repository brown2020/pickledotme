import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Pickle.me with email or Google.",
};

function FormFallback() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
      aria-hidden="true"
    />
  );
}

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to get advice and play games">
      <Suspense fallback={<FormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
