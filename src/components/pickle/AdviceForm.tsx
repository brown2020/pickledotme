"use client";

import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Send } from "lucide-react";
import { adviceRequestSchema } from "@/lib/validations";

interface AdviceFormProps {
  onSubmit: (dilemma: string) => Promise<void>;
  isLoading: boolean;
}

export function AdviceForm({ onSubmit, isLoading }: AdviceFormProps) {
  const [dilemma, setDilemma] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate with Zod
    const result = adviceRequestSchema.safeParse({ dilemma });
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(firstError?.message || "Please check your input");
      return;
    }

    await onSubmit(dilemma);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/30">
        <label
          htmlFor="dilemma"
          className="block text-lg font-semibold text-slate-900 dark:text-white mb-3"
        >
          Describe your pickle:
        </label>
        <Textarea
          id="dilemma"
          value={dilemma}
          onChange={(e) => {
            setDilemma(e.target.value);
            setError(null);
          }}
          placeholder="I'm facing a difficult situation where..."
          rows={5}
          error={error || undefined}
          className="border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-500 dark:bg-slate-800/50"
        />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          💡 Be specific about your situation for better advice
        </p>
      </div>

      <Button
        type="submit"
        disabled={!dilemma.trim() || isLoading}
        isLoading={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          "Analyzing your situation..."
        ) : (
          <>
            Get Expert Advice
            <Send className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
