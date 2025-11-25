"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const { user, isLoading, signInWithGoogle } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl shadow-emerald-500/10">
      {/* Gradient blob */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
      
      <div className="relative p-8 md:p-12">
        <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Problem Solving</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Stuck in a{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Pickle?
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-2xl">
          Get AI-powered advice when you&apos;re facing tough decisions, and keep
          your mind sharp with our pickle-themed brain games.
        </p>

        {isLoading ? (
          <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse" />
        ) : user ? (
          <div className="space-y-4">
            <p className="text-lg text-slate-700">
              Welcome back,{" "}
              <span className="font-semibold text-emerald-600">
                {user.displayName?.split(" ")[0]}
              </span>
              ! 👋
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/pickle">
                <Button size="lg" className="group">
                  Get Advice
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/games">
                <Button size="lg" variant="outline">
                  Play Games
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={signInWithGoogle} size="lg" className="group">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-slate-500">
              Sign in with Google to unlock all features
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
