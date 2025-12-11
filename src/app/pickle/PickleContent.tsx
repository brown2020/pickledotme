"use client";

import { useState } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { getAdvice } from "@/actions/getAdvice";
import { useAuth } from "@/providers/AuthProvider";
import { AdviceForm } from "@/components/pickle/AdviceForm";
import { AdviceDisplay } from "@/components/pickle/AdviceDisplay";
import { PickleLayout } from "@/components/pickle/PickleLayout";
import { fadeIn } from "@/components/PageTransition";

/**
 * Pickle advice content - AuthGuard handled by layout
 */
export function PickleContent() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (dilemma: string) => {
    if (!user) return;

    setIsLoading(true);
    setAdvice("");
    setError(null);

    try {
      const adviceStream = await getAdvice(dilemma, user.uid);
      for await (const chunk of readStreamableValue(adviceStream)) {
        if (chunk) {
          setAdvice(chunk);
        }
      }
    } catch (err) {
      console.error("Error fetching advice:", err);
      setError("There was an error getting advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PickleLayout>
      {/* User Info */}
      {user && (
        <motion.div
          {...fadeIn}
          className="flex items-center gap-3 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-emerald-500/20"
            />
          ) : (
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Getting advice as
            </p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {user.displayName}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdviceForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400"
        >
          {error}
        </motion.div>
      )}

      <AdviceDisplay advice={advice} />
    </PickleLayout>
  );
}
