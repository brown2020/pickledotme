"use client";

import { useMemo, useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Send } from "lucide-react";
import { adviceRequestSchema } from "@/lib/validations";
import type { AdviceTone } from "@/services/adviceService";

interface AdviceFormProps {
  onSubmit: (params: {
    dilemma: string;
    modelName: string;
    tone: AdviceTone;
  }) => Promise<void>;
  isLoading: boolean;
}

const TEMPLATES: Array<{ label: string; value: string }> = [
  {
    label: "Work",
    value:
      "I’m stuck on a work decision. Context: ... Options: A) ... B) ... Constraints: ... What I care about most: ...",
  },
  {
    label: "Relationship",
    value:
      "I’m stuck in a relationship situation. What happened: ... What I want: ... What I’m afraid of: ... What I’ve tried: ...",
  },
  {
    label: "Money",
    value:
      "I’m stuck on a money decision. My goal: ... My budget: ... The tradeoffs: ... The timeline: ...",
  },
  {
    label: "Conflict",
    value:
      "I’m stuck in a conflict with someone. The situation: ... My part: ... Their part: ... What outcome I want: ...",
  },
];

export function AdviceForm({ onSubmit, isLoading }: AdviceFormProps) {
  const [dilemma, setDilemma] = useState("");
  const [modelName, setModelName] = useState<string>("gpt-5.2-chat-latest");
  const [tone, setTone] = useState<AdviceTone>("balanced");
  const [error, setError] = useState<string | null>(null);

  const isAdvancedEnabled = useMemo(() => true, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate with Zod
    const result = adviceRequestSchema.safeParse({ dilemma, modelName, tone });
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(firstError?.message || "Please check your input");
      return;
    }

    await onSubmit({ dilemma, modelName, tone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Templates */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setDilemma(t.value);
              setError(null);
            }}
            className="px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tone
          </span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as AdviceTone)}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400"
          >
            <option value="balanced">Balanced</option>
            <option value="gentle">Gentle</option>
            <option value="blunt">Blunt</option>
            <option value="coach">Coach</option>
            <option value="funny">Funny</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Model
          </span>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            disabled={!isAdvancedEnabled}
            className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="gpt-5.2-chat-latest">OpenAI: GPT‑5.2 (chat)</option>
            <option value="claude-sonnet-4-5">Anthropic: Sonnet 4.5</option>
            <option value="gemini-2.5-flash">Google: Gemini 2.5 Flash</option>
            <option value="mistral-large-latest">
              Mistral: Large (latest)
            </option>
          </select>
        </label>
      </div>

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
