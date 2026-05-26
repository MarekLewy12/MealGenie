import { useCallback, useMemo, useState } from "react";

import {
  chatWithAgent,
  executeAgentPlan,
  type AgentExecutePayload,
} from "../services/api";
import type {
  AgentChatResponse,
  AgentError,
  AgentExecuteAction,
  AgentExecuteResponse,
  AgentMessage,
  AgentNextAction,
  AgentPlanDraft,
  AgentRunStatus,
  AgentState,
  AgentStep,
} from "../types/agent";

type AgentSessionSnapshot = {
  runId: string | null;
  status: AgentRunStatus | "idle";
  messages: AgentMessage[];
  state: AgentState | null;
  plan: AgentPlanDraft | null;
  steps: AgentStep[];
  nextActions: AgentNextAction[];
  error: AgentError | null;
  executeResult: AgentExecuteResponse["result"];
};

const initialSnapshot: AgentSessionSnapshot = {
  runId: null,
  status: "idle",
  messages: [],
  state: null,
  plan: null,
  steps: [],
  nextActions: [],
  error: null,
  executeResult: null,
};

function createIdempotencyKey(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getClientState() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language || "pl-PL",
  };
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    const data = response?.data;

    if (data && typeof data === "object" && "error" in data) {
      const apiError = (data as { error?: { message?: unknown } }).error;
      if (typeof apiError?.message === "string") {
        return apiError.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nie udało się połączyć z Agentem.";
}

function responseToAssistantMessage(response: AgentChatResponse): AgentMessage {
  return {
    role: response.message.role,
    content: response.message.content,
    createdAt: new Date().toISOString(),
  };
}

export function useAgentSession() {
  const [snapshot, setSnapshot] =
    useState<AgentSessionSnapshot>(initialSnapshot);
  const [isSending, setIsSending] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const canExecute = Boolean(
    snapshot.runId && snapshot.plan && snapshot.state?.canExecute,
  );

  const submitMessage = useCallback(
    async (message: string) => {
      const content = message.trim();
      if (!content || isSending || isExecuting) return;

      const userMessage: AgentMessage = {
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      setIsSending(true);
      setSnapshot((current) => ({
        ...current,
        messages: [...current.messages, userMessage],
        status:
          current.status === "idle" ? "collecting_context" : current.status,
        error: null,
      }));

      try {
        const response = await chatWithAgent({
          runId: snapshot.runId ?? undefined,
          message: content,
          clientState: getClientState(),
          idempotencyKey: createIdempotencyKey("agent-chat"),
        });
        const assistantMessage = responseToAssistantMessage(response);

        setSnapshot((current) => ({
          ...current,
          runId: response.runId,
          status: response.status,
          messages: [...current.messages, assistantMessage],
          state: response.state,
          plan: response.plan,
          steps: response.steps,
          nextActions: response.nextActions,
          error: response.error,
        }));
      } catch (error) {
        setSnapshot((current) => ({
          ...current,
          status: "failed",
          error: {
            code: "FRONTEND_AGENT_CHAT_ERROR",
            message: getErrorMessage(error),
            retryable: true,
          },
        }));
      } finally {
        setIsSending(false);
      }
    },
    [isExecuting, isSending, snapshot.runId],
  );

  const executePlan = useCallback(
    async (actions: AgentExecuteAction[]) => {
      if (!snapshot.runId || !snapshot.plan || isExecuting) return;

      setIsExecuting(true);
      setSnapshot((current) => ({
        ...current,
        status: "executing",
        error: null,
      }));

      try {
        const payload: AgentExecutePayload = {
          runId: snapshot.runId,
          acceptedPlanId: snapshot.plan.id,
          actions,
          idempotencyKey: createIdempotencyKey("agent-execute"),
        };
        const response = await executeAgentPlan(payload);

        setSnapshot((current) => ({
          ...current,
          status: response.status,
          steps: response.steps,
          error: response.error,
          executeResult: response.result,
        }));
      } catch (error) {
        setSnapshot((current) => ({
          ...current,
          status: "failed",
          error: {
            code: "FRONTEND_AGENT_EXECUTE_ERROR",
            message: getErrorMessage(error),
            retryable: true,
          },
        }));
      } finally {
        setIsExecuting(false);
      }
    },
    [isExecuting, snapshot.plan, snapshot.runId],
  );

  const resetSession = useCallback(() => {
    setSnapshot(initialSnapshot);
    setIsSending(false);
    setIsExecuting(false);
  }, []);

  return useMemo(
    () => ({
      ...snapshot,
      canExecute,
      isSending,
      isExecuting,
      submitMessage,
      executePlan,
      resetSession,
    }),
    [
      canExecute,
      executePlan,
      isExecuting,
      isSending,
      resetSession,
      snapshot,
      submitMessage,
    ],
  );
}
