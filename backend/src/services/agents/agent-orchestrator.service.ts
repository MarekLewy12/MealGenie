import type {
  AgentDecision,
  AgentErrorCode,
  AgentMessage,
  AgentPlanDraft,
  AgentState,
  AgentStep,
} from "../../schemas/agent.schema.js";
import {
  AgentRuntimeError,
  type AgentRuntimeInput,
  type AgentRuntimeResult,
  runOpenAIAgentRuntime,
} from "./openai-agent-runtime.js";
import {
  checkAllergyAndPreferenceConflicts,
  getAgentToolContext,
  type AgentToolContext,
} from "./agent-tool-registry.js";

type AgentTurnStatus = "collecting_context" | "awaiting_confirmation" | "failed";

export type AgentTurnResult = {
  status: AgentTurnStatus;
  assistantContent: string;
  state: AgentState;
  plan: AgentPlanDraft | null;
  steps: AgentStep[];
  errorCode: AgentErrorCode | null;
  errorMessage: string | null;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
};

export type AgentOrchestratorInput = {
  userId?: string;
  messages: AgentMessage[];
  state: AgentState;
  clientState?: {
    timezone?: string;
    locale?: string;
  };
};

type RuntimeFn = (args: AgentRuntimeInput) => Promise<AgentRuntimeResult>;

function nowIso(): string {
  return new Date().toISOString();
}

function mergeContext(
  state: AgentState,
  decision: Extract<AgentDecision, { type: "ask_follow_up" | "show_plan" }>,
): Record<string, unknown> {
  return {
    ...state.collectedContext,
    ...(decision.collectedContext ?? {}),
  };
}

function createStep(args: {
  key: AgentStep["key"];
  label: string;
  actor: AgentStep["actor"];
  status: AgentStep["status"];
  summary?: string;
  startedAt: string;
  completedAt?: string;
}): AgentStep {
  return {
    key: args.key,
    label: args.label,
    actor: args.actor,
    status: args.status,
    summary: args.summary,
    startedAt: args.startedAt,
    completedAt: args.completedAt,
    durationMs: args.completedAt
      ? Math.max(0, Date.parse(args.completedAt) - Date.parse(args.startedAt))
      : undefined,
  };
}

function buildStepsForDecision(args: {
  decision: AgentDecision;
  startedAt: string;
  completedAt: string;
}): AgentStep[] {
  const planningStatus =
    args.decision.type === "fail" ? "failed" : "succeeded";
  const finalStatus = args.decision.type === "fail" ? "failed" : "succeeded";

  return [
    createStep({
      key: "session",
      label: "Sesja Agenta",
      actor: "chef_orchestrator",
      status: "succeeded",
      summary: "Odczytałem stan rozmowy i przygotowałem kolejną turę.",
      startedAt: args.startedAt,
      completedAt: args.completedAt,
    }),
    createStep({
      key: "planning",
      label: "Planowanie",
      actor: "chef_orchestrator",
      status: planningStatus,
      summary:
        args.decision.type === "show_plan"
          ? "Przygotowałem draft kierunku kulinarnego."
          : args.decision.type === "ask_follow_up"
            ? "Ustaliłem, jakie informacje trzeba jeszcze doprecyzować."
            : "Nie udało się przygotować decyzji Agenta.",
      startedAt: args.startedAt,
      completedAt: args.completedAt,
    }),
    createStep({
      key: "review",
      label: "Review wykonalności",
      actor: "feasibility_reviewer",
      status: args.decision.type === "show_plan" ? "succeeded" : "skipped",
      summary:
        args.decision.type === "show_plan"
          ? "Plan jest gotowy do pokazania użytkownikowi jako draft."
          : "Review zostanie wykonany po zebraniu kontekstu.",
      startedAt: args.startedAt,
      completedAt: args.completedAt,
    }),
    createStep({
      key: "final_response",
      label: "Odpowiedź",
      actor: "chef_orchestrator",
      status: finalStatus,
      summary:
        args.decision.type === "fail"
          ? "Zwracam kontrolowany błąd Agenta."
          : "Zwracam odpowiedź do rozmowy.",
      startedAt: args.startedAt,
      completedAt: args.completedAt,
    }),
  ];
}

function decisionToTurn(
  runtimeResult: AgentRuntimeResult,
  state: AgentState,
  startedAt: string,
  completedAt: string,
  toolContext?: AgentToolContext,
): AgentTurnResult {
  const decision = runtimeResult.decision;
  const steps = buildStepsForDecision({ decision, startedAt, completedAt });

  if (decision.type === "ask_follow_up") {
    return {
      status: "collecting_context",
      assistantContent: decision.message,
      state: {
        collectedContext: mergeContext(state, decision),
        missingFields: decision.missingFields,
        canExecute: false,
        followUpCount: state.followUpCount + 1,
      },
      plan: null,
      steps,
      errorCode: null,
      errorMessage: null,
      model: runtimeResult.model,
      inputTokens: runtimeResult.inputTokens,
      outputTokens: runtimeResult.outputTokens,
    };
  }

  if (decision.type === "show_plan") {
    const conflictCheck = checkAllergyAndPreferenceConflicts(
      decision.plan,
      toolContext?.preferences ?? null,
    );

    if (!conflictCheck.ok) {
      const conflictSummary = conflictCheck.conflicts.join(" ").slice(0, 400);

      return {
        status: "failed",
        assistantContent:
          "Nie mogę wykonać tego planu, bo wykryłem konflikt z zapisanymi ograniczeniami.",
        state: {
          collectedContext: mergeContext(state, decision),
          missingFields: decision.missingFields,
          canExecute: false,
          followUpCount: state.followUpCount,
        },
        plan: decision.plan,
        steps: steps.map((step) =>
          step.key === "review" || step.key === "allergy_guard"
            ? {
                ...step,
                status: "failed",
                summary: conflictSummary,
              }
            : step,
        ),
        errorCode: "AGENT_ALLERGY_CONFLICT",
        errorMessage: conflictSummary,
        model: runtimeResult.model,
        inputTokens: runtimeResult.inputTokens,
        outputTokens: runtimeResult.outputTokens,
      };
    }

    return {
      status: "awaiting_confirmation",
      assistantContent: decision.message,
      state: {
        collectedContext: mergeContext(state, decision),
        missingFields: decision.missingFields,
        canExecute: true,
        followUpCount: state.followUpCount,
      },
      plan: decision.plan,
      steps,
      errorCode: null,
      errorMessage: null,
      model: runtimeResult.model,
      inputTokens: runtimeResult.inputTokens,
      outputTokens: runtimeResult.outputTokens,
    };
  }

  return {
    status: "failed",
    assistantContent: decision.message,
    state: {
      ...state,
      canExecute: false,
    },
    plan: null,
    steps,
    errorCode: "AGENT_RUNTIME_ERROR",
    errorMessage: decision.message,
    model: runtimeResult.model,
    inputTokens: runtimeResult.inputTokens,
    outputTokens: runtimeResult.outputTokens,
  };
}

function runtimeErrorToTurn(
  error: AgentRuntimeError,
  state: AgentState,
  startedAt: string,
  completedAt: string,
): AgentTurnResult {
  const decision: AgentDecision = {
    type: "fail",
    errorCode: error.code,
    message: error.message,
    retryable: error.retryable,
  };

  return {
    status: "failed",
    assistantContent: error.message,
    state: {
      ...state,
      canExecute: false,
    },
    plan: null,
    steps: buildStepsForDecision({ decision, startedAt, completedAt }),
    errorCode: error.code,
    errorMessage: error.message,
    model: null,
    inputTokens: null,
    outputTokens: null,
  };
}

export async function runAgentTurn(
  args: AgentOrchestratorInput,
  runtime: RuntimeFn = runOpenAIAgentRuntime,
): Promise<AgentTurnResult> {
  const startedAt = nowIso();
  const forcePlan = args.state.followUpCount >= 3;

  try {
    const toolContext = args.userId
      ? await getAgentToolContext(args.userId)
      : undefined;
    let runtimeResult = await runtime({
      messages: args.messages,
      state: args.state,
      toolContext,
      clientState: args.clientState,
      forcePlan,
    });

    if (forcePlan && runtimeResult.decision.type === "ask_follow_up") {
      runtimeResult = await runtime({
        messages: args.messages,
        state: args.state,
        toolContext,
        clientState: args.clientState,
        forcePlan: true,
      });

      if (runtimeResult.decision.type === "ask_follow_up") {
        throw new AgentRuntimeError({
          code: "AGENT_INVALID_OUTPUT",
          message:
            "Agent probowal zadac kolejne pytanie po osiagnieciu limitu doprecyzowan.",
          retryable: true,
        });
      }
    }

    return decisionToTurn(
      runtimeResult,
      args.state,
      startedAt,
      nowIso(),
      toolContext,
    );
  } catch (error) {
    const runtimeError =
      error instanceof AgentRuntimeError
        ? error
        : new AgentRuntimeError({
            code: "AGENT_RUNTIME_ERROR",
            message: "Nie udalo sie przygotowac odpowiedzi Agenta.",
            retryable: true,
            cause: error,
          });

    return runtimeErrorToTurn(runtimeError, args.state, startedAt, nowIso());
  }
}
