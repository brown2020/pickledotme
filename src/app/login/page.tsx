import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeInternalPath } from "@/lib/safeRedirect";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Pickle.me with email or Google.",
};

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined
): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const raw = firstParam(params.redirect);
  const redirectTo = safeInternalPath(raw);

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to get advice and play games">
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
