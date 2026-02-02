import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl mb-4">🥒</div>
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Looks like you&apos;ve wandered into a pickle. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </main>
  );
}
