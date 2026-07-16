"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import type { AdviceThread } from "@/types/advice";

interface AdviceHistoryProps {
  threads: AdviceThread[];
  selectedThreadId: string | null;
  onNew: () => void;
  onSelect: (threadId: string) => void;
}

function HistoryItems({
  threads,
  selectedThreadId,
  onSelect,
}: Pick<
  AdviceHistoryProps,
  "threads" | "selectedThreadId" | "onSelect"
>) {
  if (threads.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
        No advice yet. Start a new pickle →.
      </div>
    );
  }

  return threads.map((thread) => (
    <button
      key={thread.id}
      type="button"
      onClick={() => onSelect(thread.id)}
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
        selectedThreadId === thread.id
          ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10"
          : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
      }`}
    >
      <div className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
        {thread.title}
      </div>
      {thread.lastPreview ? (
        <div className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {thread.lastPreview}
        </div>
      ) : null}
    </button>
  ));
}

function NewPickleButton({ onNew }: Pick<AdviceHistoryProps, "onNew">) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full gap-2"
      onClick={onNew}
    >
      <Plus className="h-4 w-4" />
      New pickle
    </Button>
  );
}

export function AdviceHistory(props: AdviceHistoryProps) {
  const { threads, selectedThreadId, onNew, onSelect } = props;
  const items = { threads, selectedThreadId, onSelect };

  return (
    <>
      <details className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50 lg:hidden">
        <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 font-bold text-slate-800 dark:text-slate-100">
          <span>History</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {threads.length}
          </span>
        </summary>
        <div className="space-y-2 p-3">
          <NewPickleButton onNew={onNew} />
          <HistoryItems {...items} />
        </div>
      </details>

      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              History
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {threads.length}
            </span>
          </div>
          <NewPickleButton onNew={onNew} />
          <div className="max-h-[60vh] space-y-2 overflow-auto pr-1">
            <HistoryItems {...items} />
          </div>
        </div>
      </div>
    </>
  );
}
