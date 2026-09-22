"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, MessageSquarePlus, Trash2 } from "lucide-react";
import { AdviceDisplay } from "@/components/pickle/AdviceDisplay";
import { Button, Input } from "@/components/ui";
import type {
  AdviceMessage,
  AdviceThread,
} from "@/types/advice";

const QUICK_FOLLOW_UPS = [
  { label: "Next 3 actions", prompt: "Give me the next 3 actions to take." },
  { label: "Pros & cons", prompt: "Make a pros/cons list for each option." },
  {
    label: "Message draft",
    prompt: "Draft a short message I can send (friendly, clear, and respectful).",
  },
  {
    label: "Ask 3 questions",
    prompt: "Ask me 3 clarifying questions that would change your recommendation.",
  },
] as const;

interface AdviceConversationProps {
  selectedThread: AdviceThread | null;
  selectedThreadId: string | null;
  messages: AdviceMessage[];
  visibleDraft: string;
  isLoading: boolean;
  followUp: string;
  onFollowUpChange: (value: string) => void;
  onFollowUp: (message: string) => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function AdviceConversation({
  selectedThread,
  selectedThreadId,
  messages,
  visibleDraft,
  isLoading,
  followUp,
  onFollowUpChange,
  onFollowUp,
  onCopy,
  onDelete,
}: AdviceConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
  }, [selectedThreadId]);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [selectedThreadId, messages.length, visibleDraft, isLoading]);

  const showEmpty =
    messages.length === 0 && !visibleDraft && !isLoading;

  return (
    <>
      {selectedThreadId ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onCopy}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy
          </Button>
          {confirmDelete ? (
            <div
              role="group"
              aria-label="Confirm delete conversation"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-sm text-rose-700 dark:text-rose-400">
                Delete this conversation?
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-rose-700 dark:text-rose-400"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
              >
                Confirm delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-rose-700 dark:text-rose-400"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          )}
        </div>
      ) : null}

      <div
        className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/40"
        aria-busy={isLoading || undefined}
      >
        {selectedThread ? (
          <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Viewing:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedThread.title}
            </span>
          </div>
        ) : null}

        <div
          className="max-h-[60vh] space-y-4 overflow-y-auto p-4"
          aria-live="polite"
          aria-relevant="additions text"
          aria-atomic="false"
        >
          {showEmpty ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              Submit a pickle above to start a thread. Your history will show up
              on the left.
            </div>
          ) : null}

          {isLoading && !visibleDraft ? (
            <div
              role="status"
              className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-200"
            >
              Analyzing your situation…
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-full max-w-3xl rounded-2xl border px-4 py-3 ${
                  message.role === "user"
                    ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                    : "border-emerald-200 bg-white dark:border-emerald-800/30 dark:bg-slate-800"
                }`}
              >
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {message.role === "user" ? "You" : "AI"}
                </div>
                {message.role === "assistant" ? (
                  <AdviceDisplay advice={message.content} variant="plain" />
                ) : (
                  <p className="whitespace-pre-wrap break-words text-slate-800 dark:text-slate-100">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {visibleDraft ? (
            <div className="flex justify-start">
              <div
                className="w-full max-w-3xl rounded-2xl border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-800/30 dark:bg-slate-800"
                data-streaming={isLoading ? "true" : "false"}
              >
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {isLoading ? (
                    <span role="status">AI (streaming…)</span>
                  ) : (
                    "AI"
                  )}
                </div>
                <AdviceDisplay advice={visibleDraft} variant="plain" />
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        {selectedThreadId ? (
          <div className="space-y-3 border-t border-slate-100 px-4 py-3 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              {QUICK_FOLLOW_UPS.map((quickFollowUp) => (
                <Button
                  key={quickFollowUp.label}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => onFollowUp(quickFollowUp.prompt)}
                  disabled={isLoading}
                >
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                  {quickFollowUp.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <label htmlFor="advice-follow-up" className="sr-only">
                Ask a follow-up
              </label>
              <Input
                id="advice-follow-up"
                name="followUp"
                autoComplete="off"
                value={followUp}
                onChange={(event) => onFollowUpChange(event.target.value)}
                placeholder="Ask a follow-up…"
                disabled={isLoading}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && followUp.trim() && !isLoading) {
                    event.preventDefault();
                    onFollowUp(followUp);
                  }
                }}
              />
              <Button
                onClick={() => onFollowUp(followUp)}
                disabled={isLoading || !followUp.trim()}
                aria-label="Send follow-up"
              >
                Send
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
