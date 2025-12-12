import { Sparkles } from "lucide-react";
import { HeroAuthCta } from "./HeroAuthCta";

export function HeroShell() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-500/5 animate-slide-up">
      {/* Gradient blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-full blur-3xl" />

      <div className="relative p-8 md:p-12">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Problem Solving</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Stuck in a{" "}
          <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Pickle?
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Get AI-powered advice when you&apos;re facing tough decisions, and
          keep your mind sharp with our pickle-themed brain games.
        </p>

        <HeroAuthCta />
      </div>
    </div>
  );
}
