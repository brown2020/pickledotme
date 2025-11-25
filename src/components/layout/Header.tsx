"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, isLoading, logout, signInWithGoogle } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
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
              className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Get Advice
            </Link>
            <Link
              href="/games"
              className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Games
            </Link>
            {user && (
              <Link
                href="/profile"
                className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-24 h-10 bg-slate-200 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 font-medium">
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
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/pickle"
                className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Advice
              </Link>
              <Link
                href="/games"
                className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Games
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <Button onClick={handleAuth} variant="ghost" className="w-full">
                    Sign Out
                  </Button>
                ) : (
                  <Button onClick={handleAuth} variant="primary" className="w-full">
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
