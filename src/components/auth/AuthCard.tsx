import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
        >
          🥒 Pickle.me
        </Link>
        {subtitle ? (
          <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <Card variant="elevated" className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
