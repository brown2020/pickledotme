"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selectedThreadId, messages.length, visibleDraft]);

  return (
    <>
      {selectedThreadId ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-rose-700 dark:text-rose-400"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/40">
        {selectedThread ? (
          <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Viewing:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedThread.title}
            </span>
          </div>
        ) : null}

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && !visibleDraft ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              Submit a pickle above to start a thread. Your history will show up
              on the left.
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
                  <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-100">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {visibleDraft ? (
            <div className="flex justify-start">
              <div className="w-full max-w-3xl rounded-2xl border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-800/30 dark:bg-slate-800">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {isLoading ? "AI (streaming)" : "AI"}
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
                  <MessageSquarePlus className="h-4 w-4" />
                  {quickFollowUp.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={followUp}
                onChange={(event) => onFollowUpChange(event.target.value)}
                placeholder="Ask a follow-up…"
              />
              <Button
                onClick={() => onFollowUp(followUp)}
                disabled={isLoading || !followUp.trim()}
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
