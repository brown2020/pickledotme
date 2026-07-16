"use client";

import { useMemo, useReducer } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import Image from "next/image";
import { User } from "lucide-react";
import { getAdvice } from "@/actions/getAdvice";
import {
  createAdviceThread,
  deleteAdviceThread,
  saveAssistantMessage,
  saveUserMessage,
} from "@/actions/adviceThreads";
import { useAuth } from "@/providers/authContext";
import { AdviceConversation } from "@/components/pickle/AdviceConversation";
import { AdviceForm } from "@/components/pickle/AdviceForm";
import { AdviceHistory } from "@/components/pickle/AdviceHistory";
import { PickleLayout } from "@/components/pickle/PickleLayout";
import type { AdviceTone } from "@/types/advice";
import { useAdviceThread, useAdviceThreads } from "@/hooks/useAdvice";

interface AdviceUiState {
  selectedThreadId: string | null;
  advice: string;
  isLoading: boolean;
  error: string | null;
  followUp: string;
  draftThreadId: string | null;
}

type AdviceUiAction =
  | { type: "new-thread" }
  | { type: "select-thread"; threadId: string }
  | {
      type: "request-start";
      draftThreadId: string | null;
      clearFollowUp?: boolean;
    }
  | { type: "thread-created"; threadId: string }
  | { type: "stream"; advice: string }
  | { type: "request-error"; message: string }
  | { type: "request-finish" }
  | { type: "follow-up-change"; value: string };

const INITIAL_UI_STATE: AdviceUiState = {
  selectedThreadId: null,
  advice: "",
  isLoading: false,
  error: null,
  followUp: "",
  draftThreadId: null,
};

function adviceUiReducer(
  state: AdviceUiState,
  action: AdviceUiAction
): AdviceUiState {
  switch (action.type) {
    case "new-thread":
      return { ...INITIAL_UI_STATE };
    case "select-thread":
      return {
        ...state,
        selectedThreadId: action.threadId,
        advice: "",
        error: null,
        draftThreadId: null,
      };
    case "request-start":
      return {
        ...state,
        advice: "",
        isLoading: true,
        error: null,
        draftThreadId: action.draftThreadId,
        followUp: action.clearFollowUp ? "" : state.followUp,
      };
    case "thread-created":
      return {
        ...state,
        selectedThreadId: action.threadId,
        draftThreadId: action.threadId,
      };
    case "stream":
      return { ...state, advice: action.advice };
    case "request-error":
      return { ...state, error: action.message };
    case "request-finish":
      return { ...state, isLoading: false };
    case "follow-up-change":
      return { ...state, followUp: action.value };
  }
}

function mergeStreamChunk(current: string, incoming: string): string {
  if (!incoming) return current;
  if (incoming.startsWith(current)) return incoming;
  if (current.startsWith(incoming)) return current;
  return current + incoming;
}

export function PickleContent() {
  const { user } = useAuth();
  const { threads, refetch: refetchThreads } = useAdviceThreads();
  const [ui, dispatch] = useReducer(adviceUiReducer, INITIAL_UI_STATE);
  const { selectedThreadId, advice, isLoading, error, followUp, draftThreadId } =
    ui;
  const { messages: threadMessages, refetch: refetchThread } =
    useAdviceThread(selectedThreadId);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [threads, selectedThreadId]
  );
  const sortedThreadMessages = useMemo(
    () =>
      [...threadMessages].sort((left, right) => {
        const timestampDifference =
          left.createdAt.getTime() - right.createdAt.getTime();
        return timestampDifference || left.id.localeCompare(right.id);
      }),
    [threadMessages]
  );
  const hasPersistedDraft = useMemo(() => {
    if (!advice || !draftThreadId || draftThreadId !== selectedThreadId) {
      return false;
    }
    const draft = advice.trim();
    return threadMessages.some(
      (message) =>
        message.role === "assistant" && message.content.trim() === draft
    );
  }, [advice, draftThreadId, selectedThreadId, threadMessages]);
  const visibleDraft =
    draftThreadId === selectedThreadId && !hasPersistedDraft ? advice : "";
  const chatMessagesForModel = useMemo(() => {
    const messages = sortedThreadMessages.map(({ role, content }) => ({
      role,
      content,
    }));
    if (!visibleDraft) return messages;
    const withoutDraft = messages.filter(
      (message, index) =>
        !(index === messages.length - 1 && message.role === "assistant")
    );
    return [
      ...withoutDraft,
      { role: "assistant" as const, content: visibleDraft },
    ];
  }, [sortedThreadMessages, visibleDraft]);

  const streamAdvice = async (request: Parameters<typeof getAdvice>[0]) => {
    const adviceStream = await getAdvice(request);
    let final = "";
    for await (const chunk of readStreamableValue(adviceStream)) {
      if (!chunk) continue;
      final = mergeStreamChunk(final, chunk);
      dispatch({ type: "stream", advice: final });
    }
    return final;
  };

  const handleSubmit = async (params: {
    dilemma: string;
    modelName: string;
    tone: AdviceTone;
  }) => {
    if (!user) return;
    dispatch({ type: "request-start", draftThreadId: null });

    try {
      const threadId = await createAdviceThread(params);
      dispatch({ type: "thread-created", threadId });
      await refetchThreads();
      const final = await streamAdvice({
        messages: [{ role: "user", content: params.dilemma }],
        modelName: params.modelName,
        tone: params.tone,
      });
      if (final) {
        await saveAssistantMessage({ threadId, content: final });
        await Promise.all([refetchThreads(), refetchThread()]);
      }
    } catch (caughtError) {
      console.error("Error fetching advice:", caughtError);
      dispatch({
        type: "request-error",
        message: "There was an error getting advice. Please try again.",
      });
    } finally {
      dispatch({ type: "request-finish" });
    }
  };

  const handleFollowUp = async (message: string) => {
    if (!user || !selectedThreadId) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    dispatch({
      type: "request-start",
      draftThreadId: selectedThreadId,
      clearFollowUp: true,
    });

    try {
      await saveUserMessage({
        threadId: selectedThreadId,
        content: trimmed,
      });
      await refetchThread();
      const final = await streamAdvice({
        messages: [
          ...chatMessagesForModel,
          { role: "user", content: trimmed },
        ]
          .filter((modelMessage) => modelMessage.content.trim())
          .slice(-10),
        modelName: "gpt-5.2-chat-latest",
        tone: "balanced",
      });
      if (final) {
        await saveAssistantMessage({
          threadId: selectedThreadId,
          content: final,
        });
        await Promise.all([refetchThreads(), refetchThread()]);
      }
    } catch (caughtError) {
      console.error("Error fetching follow-up:", caughtError);
      dispatch({
        type: "request-error",
        message: "There was an error getting a follow-up. Please try again.",
      });
    } finally {
      dispatch({ type: "request-finish" });
    }
  };

  const handleDelete = async () => {
    if (!user || !selectedThreadId) return;
    const threadId = selectedThreadId;
    dispatch({ type: "new-thread" });
    try {
      await deleteAdviceThread({ threadId });
      await refetchThreads();
    } catch (caughtError) {
      console.error("Error deleting conversation:", caughtError);
      dispatch({
        type: "request-error",
        message: "The conversation could not be deleted. Please try again.",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        sortedThreadMessages
          .map((message) =>
            `${message.role.toUpperCase()}: ${message.content}`
          )
          .join("\n\n")
      );
    } catch (caughtError) {
      console.error("Unable to copy conversation:", caughtError);
    }
  };

  return (
    <PickleLayout>
      {user ? (
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-emerald-500/20"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Getting advice as
            </p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {user.displayName || "Player"}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <AdviceHistory
          threads={threads}
          selectedThreadId={selectedThreadId}
          onNew={() => dispatch({ type: "new-thread" })}
          onSelect={(threadId) => dispatch({ type: "select-thread", threadId })}
        />
        <div className="space-y-6">
          <div className="animate-slide-up">
            <AdviceForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
              {error}
            </div>
          ) : null}
          <AdviceConversation
            selectedThread={selectedThread}
            selectedThreadId={selectedThreadId}
            messages={sortedThreadMessages}
            visibleDraft={visibleDraft}
            isLoading={isLoading}
            followUp={followUp}
            onFollowUpChange={(value) =>
              dispatch({ type: "follow-up-change", value })
            }
            onFollowUp={(message) => void handleFollowUp(message)}
            onCopy={() => void handleCopy()}
            onDelete={() => void handleDelete()}
          />
        </div>
      </div>
    </PickleLayout>
  );
}
