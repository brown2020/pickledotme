"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  // Simple toggle button
  if (!showLabel) {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "p-2 rounded-xl transition-colors",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          "text-slate-600 dark:text-slate-400",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  // Full dropdown with options
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2 rounded-lg transition-colors",
          theme === "light"
            ? "bg-amber-100 text-amber-600"
            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        )}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2 rounded-lg transition-colors",
          theme === "dark"
            ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        )}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-2 rounded-lg transition-colors",
          theme === "system"
            ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        )}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}



