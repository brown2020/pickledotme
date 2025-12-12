import Link from "next/link";
import { HeaderClient } from "./HeaderClient";

export function HeaderShell() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
          >
            🥒 Pickle.me
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/pickle"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Get Advice
            </Link>
            <Link
              href="/games"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Games
            </Link>
          </nav>

          <HeaderClient />
        </div>
      </div>
    </header>
  );
}
