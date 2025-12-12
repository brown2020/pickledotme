"use client";

import { useMemo, useState } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import Image from "next/image";
import { Copy, MessageSquarePlus, Plus, Trash2, User } from "lucide-react";
import { getAdvice } from "@/actions/getAdvice";
import { useAuth } from "@/providers/AuthProvider";
import { AdviceForm } from "@/components/pickle/AdviceForm";
import { AdviceDisplay } from "@/components/pickle/AdviceDisplay";
import { PickleLayout } from "@/components/pickle/PickleLayout";
import { Button, Input } from "@/components/ui";
import { adviceService, type AdviceTone } from "@/services/adviceService";
import { useAdviceThread, useAdviceThreads } from "@/hooks/useAdvice";

/**
 * Pickle advice content - AuthGuard handled by layout
 */
export function PickleContent() {
  const { user } = useAuth();
  const { threads, refetch: refetchThreads } = useAdviceThreads();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { messages: threadMessages, refetch: refetchThread } =
    useAdviceThread(selectedThreadId);

  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState("");
  const [draftThreadId, setDraftThreadId] = useState<string | null>(null);

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) ?? null,
    [threads, selectedThreadId]
  );

  function mergeStreamChunk(current: string, incoming: string): string {
    const next = incoming ?? "";
    if (!next) return current;

    // Some providers stream *deltas* (e.g. "Hel", "lo"), others stream the full
    // accumulated text each time (e.g. "Hel", "Hello", "Hello!").
    //
    // Heuristic:
    // - If incoming already contains current as a prefix → treat as full text.
    // - If current contains incoming as a prefix → ignore (out-of-order/dup).
    // - Else → treat as delta and append.
    if (next.startsWith(current)) return next;
    if (current.startsWith(next)) return current;
    return current + next;
  }

  const chatMessagesForModel = useMemo(() => {
    const base = threadMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // When streaming, we mirror the assistant draft as the last assistant message.
    if (advice) {
      const withoutDraft = base.filter(
        (m, idx) => !(idx === base.length - 1 && m.role === "assistant")
      );
      return [...withoutDraft, { role: "assistant" as const, content: advice }];
    }

    return base;
  }, [threadMessages, advice]);

  const handleSubmit = async (params: {
    dilemma: string;
    modelName: string;
    tone: AdviceTone;
  }) => {
    if (!user) return;

    setIsLoading(true);
    setAdvice("");
    setError(null);
    setDraftThreadId(null);

    try {
      const threadId = await adviceService.createThread({
        userId: user.uid,
        dilemma: params.dilemma,
        modelName: params.modelName,
        tone: params.tone,
      });
      setSelectedThreadId(threadId);
      setDraftThreadId(threadId);
      await refetchThreads();

      const adviceStream = await getAdvice({
        messages: [{ role: "user", content: params.dilemma }],
        modelName: params.modelName,
        tone: params.tone,
      });

      let final = "";
      for await (const chunk of readStreamableValue(adviceStream)) {
        if (chunk) {
          final = mergeStreamChunk(final, chunk);
          setAdvice(final);
        }
      }

      if (final) {
        await adviceService.addAssistantMessage({
          userId: user.uid,
          threadId,
          content: final,
        });
        await refetchThreads();
        await refetchThread();
        // Clear the draft after the persisted message is fetched.
        setAdvice("");
        setDraftThreadId(null);
      }
    } catch (err) {
      console.error("Error fetching advice:", err);
      setError("There was an error getting advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = async (message: string) => {
    if (!user || !selectedThreadId) return;
    const trimmed = message.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setAdvice("");
    setFollowUp("");
    setDraftThreadId(selectedThreadId);

    try {
      await adviceService.addUserMessage({
        userId: user.uid,
        threadId: selectedThreadId,
        content: trimmed,
      });

      // Use up to the last 10 messages for context.
      const context = [
        ...chatMessagesForModel,
        { role: "user", content: trimmed },
      ]
        .filter((m) => m.content?.trim())
        .slice(-10);

      const adviceStream = await getAdvice({
        messages: context,
        modelName: "gpt-5.2-chat-latest",
        tone: "balanced",
      });

      let final = "";
      for await (const chunk of readStreamableValue(adviceStream)) {
        if (chunk) {
          final = mergeStreamChunk(final, chunk);
          setAdvice(final);
        }
      }

      if (final) {
        await adviceService.addAssistantMessage({
          userId: user.uid,
          threadId: selectedThreadId,
          content: final,
        });
        await refetchThreads();
        await refetchThread();
        setAdvice("");
        setDraftThreadId(null);
      }
    } catch (err) {
      console.error("Error fetching follow-up:", err);
      setError("There was an error getting a follow-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickFollowUps = useMemo(
    () => [
      {
        label: "Next 3 actions",
        prompt: "Give me the next 3 actions to take.",
      },
      {
        label: "Pros & cons",
        prompt: "Make a pros/cons list for each option.",
      },
      {
        label: "Message draft",
        prompt:
          "Draft a short message I can send (friendly, clear, and respectful).",
      },
      {
        label: "Ask 3 questions",
        prompt:
          "Ask me 3 clarifying questions that would change your recommendation.",
      },
    ],
    []
  );

  return (
    <PickleLayout>
      {/* User Info */}
      {user && (
        <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-fade-in">
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
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* History (mobile collapsible) */}
        <details className="lg:hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <summary className="cursor-pointer select-none px-4 py-3 font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <span>History</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {threads.length}
            </span>
          </summary>
          <div className="p-3 space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                setSelectedThreadId(null);
                setAdvice("");
                setError(null);
                setDraftThreadId(null);
              }}
            >
              <Plus className="w-4 h-4" />
              New pickle
            </Button>

            {threads.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                No advice yet. Start a new pickle →.
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedThreadId(t.id);
                    setAdvice("");
                    setError(null);
                    setDraftThreadId(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selectedThreadId === t.id
                      ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                    {t.title}
                  </div>
                  {t.lastPreview ? (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {t.lastPreview}
                    </div>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </details>

        {/* History (desktop sticky) */}
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                setSelectedThreadId(null);
                setAdvice("");
                setError(null);
                setDraftThreadId(null);
              }}
            >
              <Plus className="w-4 h-4" />
              New pickle
            </Button>

            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {threads.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  No advice yet. Start a new pickle →.
                </div>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedThreadId(t.id);
                      setAdvice("");
                      setError(null);
                      setDraftThreadId(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedThreadId === t.id
                        ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {t.title}
                    </div>
                    {t.lastPreview ? (
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {t.lastPreview}
                      </div>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="space-y-6">
          <div className="animate-slide-up">
            <AdviceForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 animate-fade-in">
              {error}
            </div>
          )}

          {/* Keep the draft visible until the saved thread message shows up. */}
          {advice && draftThreadId === selectedThreadId ? (
            <div className="flex justify-start">
              <div className="w-full max-w-3xl rounded-2xl border border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-slate-800 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  {isLoading ? "AI (streaming)" : "AI"}
                </div>
                <AdviceDisplay advice={advice} variant="plain" />
              </div>
            </div>
          ) : null}

          {/* Controls */}
          {selectedThreadId ? (
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={async () => {
                  if (!selectedThreadId) return;
                  try {
                    await navigator.clipboard.writeText(
                      threadMessages
                        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
                        .join("\n\n")
                    );
                  } catch {
                    // ignore
                  }
                }}
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-rose-700 dark:text-rose-400"
                onClick={async () => {
                  if (!user || !selectedThreadId) return;
                  const id = selectedThreadId;
                  setSelectedThreadId(null);
                  setAdvice("");
                  await adviceService.deleteThread({
                    userId: user.uid,
                    threadId: id,
                  });
                  await refetchThreads();
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          ) : null}

          {/* Thread */}
          {threadMessages.length > 0 ? (
            <div className="space-y-4">
              {selectedThread ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Viewing:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedThread.title}
                  </span>
                </div>
              ) : null}

              {threadMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`w-full max-w-3xl rounded-2xl border px-4 py-3 ${
                      m.role === "user"
                        ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                        : "border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                      {m.role === "user" ? "You" : "AI"}
                    </div>
                    {m.role === "assistant" ? (
                      <AdviceDisplay advice={m.content} variant="plain" />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                        {m.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick follow-ups */}
              <div className="flex flex-wrap gap-2">
                {quickFollowUps.map((q) => (
                  <Button
                    key={q.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => void handleFollowUp(q.prompt)}
                    disabled={isLoading}
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    {q.label}
                  </Button>
                ))}
              </div>

              {/* Follow-up input */}
              <div className="flex gap-2">
                <Input
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Ask a follow-up…"
                />
                <Button
                  type="button"
                  onClick={() => void handleFollowUp(followUp)}
                  disabled={isLoading || !followUp.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
              Submit a pickle above to start a thread. Your history will show up
              on the left.
            </div>
          )}
        </div>
      </div>
    </PickleLayout>
  );
}
