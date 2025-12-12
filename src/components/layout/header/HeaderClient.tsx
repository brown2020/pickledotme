"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { HeaderAuthControls } from "./HeaderAuthControls";
import { HeaderSoundToggle } from "./HeaderSoundToggle";
import { useAuth } from "@/providers/AuthProvider";

export function HeaderClient() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop right section */}
      <div className="hidden md:flex items-center gap-3">
        <HeaderSoundToggle />
        <ThemeToggle />
        <HeaderAuthControls />
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle />
        <button
          className="p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <HeaderSoundToggle />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Sound
                </span>
              </div>
              <HeaderAuthControls className="w-full" />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
