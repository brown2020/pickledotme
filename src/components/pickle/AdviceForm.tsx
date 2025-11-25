"use client";

import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Send } from "lucide-react";

interface AdviceFormProps {
  onSubmit: (dilemma: string) => Promise<void>;
  isLoading: boolean;
}

export function AdviceForm({ onSubmit, isLoading }: AdviceFormProps) {
  const [dilemma, setDilemma] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dilemma.trim()) return;
    await onSubmit(dilemma);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
        <label
          htmlFor="dilemma"
          className="block text-lg font-semibold text-slate-900 mb-3"
        >
          Describe your pickle:
        </label>
        <Textarea
          id="dilemma"
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          placeholder="I'm facing a difficult situation where..."
          rows={5}
          required
          className="border-emerald-200 focus:border-emerald-500"
        />
        <p className="mt-3 text-sm text-slate-500">
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
