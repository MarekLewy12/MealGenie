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
  getAgentRecentMealContext,
  getAgentUserPreferencesContext,
  type AgentToolContext,
} from "./agent-tool-registry.js";

type AgentTurnStatus = "collecting_context" | "awaiting_confirmation" | "failed";
type AgentProgressCallback = (steps: AgentStep[]) => Promise<void> | void;
type StepDefinition = {
  key: AgentStep["key"];
  label: string;
  actor: AgentStep["actor"];
};

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
  currentPlan?: AgentPlanDraft | null;
  turnMode?: "discovery" | "revision";
  clientState?: {
    timezone?: string;
    locale?: string;
  };
  onStepsUpdate?: AgentProgressCallback;
};

type RuntimeFn = (args: AgentRuntimeInput) => Promise<AgentRuntimeResult>;

const FIRST_TURN_STEP_DEFINITIONS: StepDefinition[] = [
  {
    key: "session",
    label: "Sesja Agenta",
    actor: "chef_orchestrator",
  },
  {
    key: "preferences",
    label: "Profil i ograniczenia",
    actor: "chef_orchestrator",
  },
  {
    key: "history",
    label: "Historia posiłków",
    actor: "meal_historian",
  },
  {
    key: "planning",
    label: "Planowanie",
    actor: "chef_orchestrator",
  },
  {
    key: "review",
    label: "Review wykonalności",
    actor: "feasibility_reviewer",
  },
  {
    key: "final_response",
    label: "Odpowiedź",
    actor: "chef_orchestrator",
  },
];

const FOLLOW_UP_STEP_DEFINITIONS: StepDefinition[] =
  FIRST_TURN_STEP_DEFINITIONS.filter(
    (step) => step.key !== "preferences" && step.key !== "history",
  );

function nowIso(): string {
  return new Date().toISOString();
}

function isFirstAgentTurn(messages: AgentMessage[]): boolean {
  return messages.filter((message) => message.role === "user").length <= 1;
}

function getStepDefinitions(includeContextSteps: boolean): StepDefinition[] {
  return includeContextSteps
    ? FIRST_TURN_STEP_DEFINITIONS
    : FOLLOW_UP_STEP_DEFINITIONS;
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

function createProgressSteps(args: {
  activeKey: AgentStep["key"];
  definitions: StepDefinition[];
  startedAt: string;
  completedKeys?: AgentStep["key"][];
}): AgentStep[] {
  const activeIndex = args.definitions.findIndex(
    (step) => step.key === args.activeKey,
  );
  const completedKeys = new Set(args.completedKeys ?? []);

  return args.definitions.map((definition, index) => {
    const isCompleted = completedKeys.has(definition.key) || index < activeIndex;
    const isActive = definition.key === args.activeKey;

    return createStep({
      key: definition.key,
      label: definition.label,
      actor: definition.actor,
      status: isCompleted ? "succeeded" : isActive ? "running" : "pending",
      summary: isActive ? "Pracuję nad tym etapem." : undefined,
      startedAt: args.startedAt,
      completedAt: isCompleted ? nowIso() : undefined,
    });
  });
}

function buildStepsForDecision(args: {
  decision: AgentDecision;
  definitions: StepDefinition[];
  startedAt: string;
  completedAt: string;
}): AgentStep[] {
  const planningStatus =
    args.decision.type === "fail" ? "failed" : "succeeded";
  const finalStatus = args.decision.type === "fail" ? "failed" : "succeeded";

  return args.definitions.map((definition) => {
    let status: AgentStep["status"] = "succeeded";
    let summary = "Etap zakończony.";

    if (definition.key === "planning") {
      status = planningStatus;
      summary =
        args.decision.type === "show_plan"
          ? "Przygotowałem draft kierunku kulinarnego."
          : args.decision.type === "ask_follow_up"
            ? "Ustaliłem, jakie informacje trzeba jeszcze doprecyzować."
            : "Nie udało się przygotować decyzji Agenta.";
    }

    if (definition.key === "review") {
      status = args.decision.type === "show_plan" ? "succeeded" : "skipped";
      summary =
        args.decision.type === "show_plan"
          ? "Plan jest gotowy do pokazania użytkownikowi jako draft."
          : "Review zostanie wykonany po zebraniu kontekstu.";
    }

    if (definition.key === "final_response") {
      status = finalStatus;
      summary =
        args.decision.type === "fail"
          ? "Zwracam kontrolowany błąd Agenta."
          : "Zwracam odpowiedź do rozmowy.";
    }

    return createStep({
      key: definition.key,
      label: definition.label,
      actor: definition.actor,
      status,
      summary,
      startedAt: args.startedAt,
      completedAt: args.completedAt,
    });
  });
}

function getLatestUserMessage(messages: AgentMessage[]): string {
  return (
    [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content.toLowerCase() ?? ""
  );
}

function hasServingSignal(message: string): boolean {
  return /\b(\d+\s*(osób|osoby|osobe|osoba|porcje|porcji|porcja)|dla\s+\d+|samemu|sam|sama|we\s+dwoje|dla\s+rodziny)\b/u.test(
    message,
  );
}

function hasStyleSignal(message: string): boolean {
  return /(wytrawn|słodk|slodk|lekki|lekka|sycąc|sycac|fit|protein|bez mięsa|bez miesa|ostry|łagodn|lagodn|kremow|chrup|jajecznic|omlet|szakszuk|kanapk|sałat|salat)/u.test(
    message,
  );
}

function shouldPreferFollowUpOnFirstTurn(args: {
  decision: AgentDecision;
  forcePlan: boolean;
  messages: AgentMessage[];
  state: AgentState;
  turnMode: "discovery" | "revision";
}): boolean {
  if (
    args.forcePlan ||
    args.turnMode === "revision" ||
    args.decision.type !== "show_plan" ||
    args.state.followUpCount > 0
  ) {
    return false;
  }

  const userMessages = args.messages.filter((message) => message.role === "user");
  if (userMessages.length !== 1) {
    return false;
  }

  const message = getLatestUserMessage(args.messages);
  return !hasServingSignal(message) || !hasStyleSignal(message);
}

function buildFirstTurnFollowUp(
  decision: Extract<AgentDecision, { type: "show_plan" }>,
): Extract<AgentDecision, { type: "ask_follow_up" }> {
  return {
    type: "ask_follow_up",
    message:
      "Mam już dobry kierunek. Zanim przygotuję plan, doprecyzuj proszę jedną rzecz: dla ilu osób gotujemy i czy wolisz wersję wytrawną, kremową, czy bardziej sycącą?",
    missingFields: ["servings", "stylePreference"],
    collectedContext: decision.collectedContext,
  };
}

function getLatestUserMessageContent(messages: AgentMessage[]): string {
  return (
    [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content ?? ""
  );
}

function arraysDiffer(left: string[], right: string[]): boolean {
  return (
    left.length !== right.length ||
    left.some((item, index) => item !== right[index])
  );
}

function shoppingDraftSignature(plan: AgentPlanDraft): string[] {
  return plan.shoppingDraft.map(
    (item) =>
      `${item.name}:${item.quantity}:${item.unit ?? ""}:${item.category ?? ""}`,
  );
}

function mealIngredientsSignature(plan: AgentPlanDraft): string[] {
  return plan.mealTeaser.ingredients.map(
    (item) => `${item.name}:${item.amount}`,
  );
}

function getPlanRevisionSections(args: {
  previousPlan: AgentPlanDraft;
  nextPlan: AgentPlanDraft;
}): NonNullable<AgentPlanDraft["revision"]>["changedSections"] {
  const sections = new Set<
    NonNullable<AgentPlanDraft["revision"]>["changedSections"][number]
  >();

  if (
    args.previousPlan.title !== args.nextPlan.title ||
    args.previousPlan.summary !== args.nextPlan.summary ||
    args.previousPlan.rationale !== args.nextPlan.rationale ||
    args.previousPlan.mealType !== args.nextPlan.mealType
  ) {
    sections.add("overview");
  }

  if (
    arraysDiffer(args.previousPlan.usedIngredients, args.nextPlan.usedIngredients) ||
    arraysDiffer(
      args.previousPlan.missingIngredients,
      args.nextPlan.missingIngredients,
    ) ||
    arraysDiffer(
      mealIngredientsSignature(args.previousPlan),
      mealIngredientsSignature(args.nextPlan),
    )
  ) {
    sections.add("ingredients");
  }

  if (
    arraysDiffer(
      shoppingDraftSignature(args.previousPlan),
      shoppingDraftSignature(args.nextPlan),
    )
  ) {
    sections.add("shopping");
  }

  if (
    args.previousPlan.servings !== args.nextPlan.servings ||
    JSON.stringify(args.previousPlan.recipeContext ?? null) !==
      JSON.stringify(args.nextPlan.recipeContext ?? null)
  ) {
    sections.add("details");
  }

  if (
    arraysDiffer(args.previousPlan.assumptions, args.nextPlan.assumptions) ||
    arraysDiffer(args.previousPlan.warnings, args.nextPlan.warnings)
  ) {
    sections.add("warnings");
  }

  return sections.size > 0 ? [...sections] : ["overview"];
}

function summarizePlanRevision(
  sections: NonNullable<AgentPlanDraft["revision"]>["changedSections"],
): string {
  const labels: Record<
    NonNullable<AgentPlanDraft["revision"]>["changedSections"][number],
    string
  > = {
    overview: "opis planu",
    ingredients: "składniki",
    shopping: "listę zakupów",
    details: "szczegóły porcji",
    warnings: "założenia i ostrzeżenia",
  };

  return `Zaktualizowałem ${sections.map((section) => labels[section]).join(", ")}.`;
}

function applyPlanRevision(args: {
  currentPlan: AgentPlanDraft | null | undefined;
  decision: AgentDecision;
  messages: AgentMessage[];
  turnMode: "discovery" | "revision";
}): AgentDecision {
  if (
    args.turnMode !== "revision" ||
    args.decision.type !== "show_plan" ||
    !args.currentPlan
  ) {
    return args.decision;
  }

  const nextPlan = {
    ...args.decision.plan,
    id: args.currentPlan.id,
  };
  const changedSections = getPlanRevisionSections({
    previousPlan: args.currentPlan,
    nextPlan,
  });

  return {
    ...args.decision,
    plan: {
      ...nextPlan,
      revision: {
        summary: summarizePlanRevision(changedSections),
        changedSections,
        sourceMessage: getLatestUserMessageContent(args.messages),
        createdAt: nowIso(),
      },
    },
  };
}

function decisionToTurn(
  runtimeResult: AgentRuntimeResult,
  state: AgentState,
  startedAt: string,
  completedAt: string,
  definitions: StepDefinition[],
  toolContext?: AgentToolContext,
): AgentTurnResult {
  const decision = runtimeResult.decision;
  const steps = buildStepsForDecision({
    decision,
    definitions,
    startedAt,
    completedAt,
  });

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
  definitions: StepDefinition[],
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
    steps: buildStepsForDecision({
      decision,
      definitions,
      startedAt,
      completedAt,
    }),
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
  const turnMode = args.turnMode ?? "discovery";
  const includeContextSteps = isFirstAgentTurn(args.messages);
  const stepDefinitions = getStepDefinitions(includeContextSteps);
  const publishSteps = async (steps: AgentStep[]) => {
    await args.onStepsUpdate?.(steps);
  };

  try {
    await publishSteps(
      createProgressSteps({
        activeKey: "session",
        definitions: stepDefinitions,
        startedAt,
      }),
    );

    let toolContext: AgentToolContext | undefined;

    if (args.userId) {
      if (includeContextSteps) {
        await publishSteps(
          createProgressSteps({
            activeKey: "preferences",
            definitions: stepDefinitions,
            startedAt,
          }),
        );
      }
      const preferences = await getAgentUserPreferencesContext(args.userId);

      if (includeContextSteps) {
        await publishSteps(
          createProgressSteps({
            activeKey: "history",
            definitions: stepDefinitions,
            startedAt,
          }),
        );
      }
      const recentHistory = await getAgentRecentMealContext(args.userId);
      toolContext = { preferences, recentHistory };
    }

    await publishSteps(
      createProgressSteps({
        activeKey: "planning",
        definitions: stepDefinitions,
        startedAt,
      }),
    );

    let runtimeResult = await runtime({
      messages: args.messages,
      state: args.state,
      currentPlan: args.currentPlan ?? null,
      turnMode,
      toolContext,
      clientState: args.clientState,
      forcePlan,
    });

    if (
      runtimeResult.decision.type === "show_plan" &&
      shouldPreferFollowUpOnFirstTurn({
        decision: runtimeResult.decision,
        forcePlan,
        messages: args.messages,
        state: args.state,
        turnMode,
      })
    ) {
      runtimeResult = {
        ...runtimeResult,
        decision: buildFirstTurnFollowUp(runtimeResult.decision),
      };
    }

    if (forcePlan && runtimeResult.decision.type === "ask_follow_up") {
      runtimeResult = await runtime({
        messages: args.messages,
        state: args.state,
        currentPlan: args.currentPlan ?? null,
        turnMode,
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

    await publishSteps(
      createProgressSteps({
        activeKey: "review",
        definitions: stepDefinitions,
        startedAt,
      }),
    );

    runtimeResult = {
      ...runtimeResult,
      decision: applyPlanRevision({
        currentPlan: args.currentPlan,
        decision: runtimeResult.decision,
        messages: args.messages,
        turnMode,
      }),
    };

    return decisionToTurn(
      runtimeResult,
      args.state,
      startedAt,
      nowIso(),
      stepDefinitions,
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

    return runtimeErrorToTurn(
      runtimeError,
      args.state,
      stepDefinitions,
      startedAt,
      nowIso(),
    );
  }
}
