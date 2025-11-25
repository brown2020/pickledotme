"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, isLoading, logout, signInWithGoogle } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
          >
            🥒 Pickle.me
          </Link>

          {/* Desktop Navigation */}
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
            {user && (
              <Link
                href="/profile"
                className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle sound"
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth */}
            {isLoading ? (
              <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {user.displayName?.split(" ")[0]}
                </span>
                <Button onClick={handleAuth} variant="ghost" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={handleAuth} variant="primary" size="sm">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/pickle"
                className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Advice
              </Link>
              <Link
                href="/games"
                className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Games
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                  <Button
                    onClick={handleAuth}
                    variant="ghost"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleAuth}
                    variant="primary"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
