import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type {
  AgentChatRequest,
  AgentChatResponse,
  AgentErrorCode,
  AgentMessage,
  AgentPlanDraft,
  AgentRunDetailResponse,
  AgentState,
  AgentStep,
} from "../../schemas/agent.schema.js";
import {
  AgentPlanDraftSchema,
  AgentStateSchema,
} from "../../schemas/agent.schema.js";
import { runAgentTurn } from "./agent-orchestrator.service.js";

const prisma = new PrismaClient();
type AgentOrchestrator = typeof runAgentTurn;
let agentOrchestrator: AgentOrchestrator = runAgentTurn;

type AgentRunRecord = {
  id: string;
  userId: string;
  mode: string;
  status: string;
  idempotencyKey: string | null;
  messagesJson: unknown;
  stateJson: unknown;
  stepsJson: unknown;
  planJson: unknown | null;
  resultJson: unknown | null;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  estimatedCostMicros: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
};

export class AgentRunNotFoundError extends Error {
  constructor() {
    super("Agent run was not found");
    this.name = "AgentRunNotFoundError";
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildInitialState(): AgentState {
  return {
    collectedContext: {},
    missingFields: ["goal", "availableIngredients", "constraints"],
    canExecute: false,
    followUpCount: 0,
  };
}

function toMeta(args: {
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  model?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
}): AgentChatResponse["meta"] {
  const updatedAt = args.updatedAt.toISOString();
  const createdAt = args.createdAt.toISOString();

  return {
    createdAt,
    updatedAt,
    completedAt: args.completedAt?.toISOString() ?? null,
    durationMs: Math.max(
      0,
      args.updatedAt.getTime() - args.createdAt.getTime(),
    ),
    model: args.model ?? null,
    tokenUsage: {
      inputTokens: args.inputTokens ?? null,
      outputTokens: args.outputTokens ?? null,
    },
  };
}

function parseMessages(value: unknown): AgentMessage[] {
  return Array.isArray(value) ? (value as AgentMessage[]) : [];
}

function parseSteps(value: unknown): AgentStep[] {
  return Array.isArray(value) ? (value as AgentStep[]) : [];
}

function parseState(value: unknown): AgentState {
  const parsed = AgentStateSchema.safeParse(value);
  return parsed.success ? parsed.data : buildInitialState();
}

function parsePlan(value: unknown): AgentPlanDraft | null {
  const parsed = AgentPlanDraftSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function buildInitialSteps(args: {
  includeContextSteps: boolean;
  startedAt: string;
}): AgentStep[] {
  const steps: AgentStep[] = [
    {
      key: "session",
      label: "Sesja Agenta",
      actor: "chef_orchestrator",
      status: "running",
      summary: "Przygotowuję nową turę rozmowy.",
      startedAt: args.startedAt,
    },
  ];

  if (args.includeContextSteps) {
    steps.push(
      {
        key: "preferences",
        label: "Profil i ograniczenia",
        actor: "chef_orchestrator",
        status: "pending",
        startedAt: args.startedAt,
      },
      {
        key: "history",
        label: "Historia posiłków",
        actor: "meal_historian",
        status: "pending",
        startedAt: args.startedAt,
      },
    );
  }

  steps.push(
    {
      key: "planning",
      label: "Planowanie",
      actor: "chef_orchestrator",
      status: "pending",
      startedAt: args.startedAt,
    },
    {
      key: "review",
      label: "Review wykonalności",
      actor: "feasibility_reviewer",
      status: "pending",
      startedAt: args.startedAt,
    },
    {
      key: "final_response",
      label: "Odpowiedź",
      actor: "chef_orchestrator",
      status: "pending",
      startedAt: args.startedAt,
    },
  );

  return steps;
}

function isRetryableErrorCode(code: string | null): boolean {
  return (
    code === "AGENT_RUNTIME_ERROR" ||
    code === "AGENT_TIMEOUT" ||
    code === "AGENT_INVALID_OUTPUT"
  );
}

function toError(run: AgentRunRecord): AgentChatResponse["error"] {
  if (!run.errorCode) {
    return null;
  }

  return {
    code: run.errorCode as AgentErrorCode,
    message: run.errorMessage ?? "Wystąpił błąd Agenta.",
    retryable: isRetryableErrorCode(run.errorCode),
  };
}

function toNextActions(
  run: AgentRunRecord,
): AgentChatResponse["nextActions"] {
  if (run.status === "awaiting_confirmation") {
    const parsedPlan = AgentPlanDraftSchema.safeParse(run.planJson);
    const state = parseState(run.stateJson);
    const executeActions = ["create_recipe"];
    const actions: AgentChatResponse["nextActions"] = [];

    if (
      parsedPlan.success &&
      parsedPlan.data.shoppingDraft.length > 0
    ) {
      executeActions.push("populate_shopping_list");
    }

    if (parsedPlan.success && state.canExecute) {
      actions.push({
        type: "execute_plan",
        label: "Wykonaj plan",
        payload: {
          runId: run.id,
          acceptedPlanId: parsedPlan.data.id,
          actions: executeActions,
        },
      });
    }

    actions.push({
      type: "adjust_goal",
      label: "Doprecyzuj plan",
    });

    return actions;
  }

  if (run.status === "failed") {
    return [
      {
        type: "reply",
        label: "Spróbuj ponownie",
      },
    ];
  }

  return [
    {
      type: "reply",
      label: "Kontynuuj rozmowę",
    },
  ];
}

function buildResponseFromRun(run: AgentRunRecord): AgentChatResponse {
  const messages = parseMessages(run.messagesJson);
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  return {
    runId: run.id,
    status: run.status as AgentChatResponse["status"],
    message: {
      role: "assistant",
      content: lastAssistantMessage?.content ?? "Sesja Agenta nie ma jeszcze odpowiedzi.",
    },
    state: parseState(run.stateJson),
    plan: run.planJson ?? null,
    steps: parseSteps(run.stepsJson),
    nextActions: toNextActions(run),
    error: toError(run),
    meta: toMeta(run),
  };
}

async function updateRunSteps(runId: string, steps: AgentStep[]) {
  await prisma.$executeRaw`
    UPDATE "AgentRun"
    SET
      "stepsJson" = CAST(${JSON.stringify(steps)} AS JSONB),
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${runId}
  `;
}

async function finalizeRunTurn(args: {
  runId: string;
  userId: string;
  messagesBeforeAssistant: AgentMessage[];
  state: AgentState;
  currentPlan: AgentPlanDraft | null;
  turnMode: "discovery" | "revision";
  clientState: AgentChatRequest["clientState"];
}) {
  try {
    const turn = await agentOrchestrator({
      userId: args.userId,
      messages: args.messagesBeforeAssistant,
      state: args.state,
      currentPlan: args.currentPlan,
      turnMode: args.turnMode,
      clientState: args.clientState,
      onStepsUpdate: (steps) => updateRunSteps(args.runId, steps),
    });
    const assistantMessage: AgentMessage = {
      role: "assistant",
      content: turn.assistantContent,
      createdAt: nowIso(),
    };
    const messages = [...args.messagesBeforeAssistant, assistantMessage];

    await prisma.$executeRaw`
      UPDATE "AgentRun"
      SET
        "messagesJson" = CAST(${JSON.stringify(messages)} AS JSONB),
        "stateJson" = CAST(${JSON.stringify(turn.state)} AS JSONB),
        "stepsJson" = CAST(${JSON.stringify(turn.steps)} AS JSONB),
        "planJson" = CAST(${turn.plan ? JSON.stringify(turn.plan) : args.currentPlan ? JSON.stringify(args.currentPlan) : null} AS JSONB),
        "status" = ${turn.status},
        "model" = ${turn.model},
        "inputTokens" = ${turn.inputTokens},
        "outputTokens" = ${turn.outputTokens},
        "errorCode" = ${turn.errorCode},
        "errorMessage" = ${turn.errorMessage},
        "updatedAt" = CURRENT_TIMESTAMP,
        "completedAt" = CASE
          WHEN ${turn.status} = 'failed' THEN CURRENT_TIMESTAMP
          ELSE "completedAt"
        END
      WHERE "id" = ${args.runId}
    `;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Nie udało się przygotować odpowiedzi Agenta.";

    console.error("[AGENT_SESSION_ASYNC_ERROR]", {
      scope: "agent-session",
      runId: args.runId,
      message,
    });

    await prisma.$executeRaw`
      UPDATE "AgentRun"
      SET
        "status" = 'failed',
        "errorCode" = 'AGENT_RUNTIME_ERROR',
        "errorMessage" = ${message},
        "updatedAt" = CURRENT_TIMESTAMP,
        "completedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${args.runId}
    `;
  }
}

export function setAgentOrchestratorForTests(
  orchestrator?: AgentOrchestrator,
) {
  agentOrchestrator = orchestrator ?? runAgentTurn;
}

export async function chatSession(args: {
  userId: string;
  input: AgentChatRequest;
}): Promise<AgentChatResponse> {
  const startedAt = nowIso();
  const userMessage: AgentMessage = {
    role: "user",
    content: args.input.message,
    createdAt: startedAt,
  };

  if (args.input.runId) {
    const existingRows = await prisma.$queryRaw<AgentRunRecord[]>`
      SELECT *
      FROM "AgentRun"
      WHERE "id" = ${args.input.runId}
        AND "userId" = ${args.userId}
      LIMIT 1
    `;
    const existing = existingRows[0];

    if (!existing) {
      throw new AgentRunNotFoundError();
    }

    if (existing.status === "planning") {
      return buildResponseFromRun(existing);
    }

    const messagesBeforeAssistant = [
      ...parseMessages(existing.messagesJson),
      userMessage,
    ];
    const state = parseState(existing.stateJson);
    const currentPlan = parsePlan(existing.planJson);
    const turnMode =
      currentPlan && state.canExecute ? "revision" : "discovery";
    const initialSteps = buildInitialSteps({
      includeContextSteps: false,
      startedAt,
    });

    const updatedRows = await prisma.$queryRaw<AgentRunRecord[]>`
      UPDATE "AgentRun"
      SET
        "messagesJson" = CAST(${JSON.stringify(messagesBeforeAssistant)} AS JSONB),
        "stateJson" = CAST(${JSON.stringify({
          ...state,
          canExecute: false,
        })} AS JSONB),
        "stepsJson" = CAST(${JSON.stringify(initialSteps)} AS JSONB),
        "planJson" = CAST(${turnMode === "revision" && currentPlan ? JSON.stringify(currentPlan) : null} AS JSONB),
        "status" = 'planning',
        "model" = null,
        "inputTokens" = null,
        "outputTokens" = null,
        "errorCode" = null,
        "errorMessage" = null,
        "updatedAt" = CURRENT_TIMESTAMP,
        "completedAt" = null
      WHERE "id" = ${existing.id}
      RETURNING *
    `;
    const updated = updatedRows[0];

    if (!updated) {
      throw new AgentRunNotFoundError();
    }

    void finalizeRunTurn({
      runId: updated.id,
      userId: args.userId,
      messagesBeforeAssistant,
      state,
      currentPlan,
      turnMode,
      clientState: args.input.clientState,
    });

    return buildResponseFromRun(updated);
  }

  if (args.input.idempotencyKey) {
    const existingWithKeyRows = await prisma.$queryRaw<AgentRunRecord[]>`
      SELECT *
      FROM "AgentRun"
      WHERE "userId" = ${args.userId}
        AND "idempotencyKey" = ${args.input.idempotencyKey}
      LIMIT 1
    `;
    const existingWithKey = existingWithKeyRows[0];

    if (existingWithKey) {
      return buildResponseFromRun(existingWithKey);
    }
  }

  const runId = randomUUID();
  const state = buildInitialState();
  const initialSteps = buildInitialSteps({
    includeContextSteps: true,
    startedAt,
  });
  const createdRows = await prisma.$queryRaw<AgentRunRecord[]>`
    INSERT INTO "AgentRun" (
      "id",
      "userId",
      "mode",
      "status",
      "idempotencyKey",
      "messagesJson",
      "stateJson",
      "stepsJson",
      "planJson",
      "model",
      "inputTokens",
      "outputTokens",
      "errorCode",
      "errorMessage",
      "completedAt",
      "updatedAt"
    )
    VALUES (
      ${runId},
      ${args.userId},
      ${args.input.mode},
      'planning',
      ${args.input.idempotencyKey ?? null},
      CAST(${JSON.stringify([userMessage])} AS JSONB),
      CAST(${JSON.stringify(state)} AS JSONB),
      CAST(${JSON.stringify(initialSteps)} AS JSONB),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      CURRENT_TIMESTAMP
    )
    RETURNING *
  `;
  const created = createdRows[0];

  if (!created) {
    throw new Error("Failed to create agent run");
  }

  void finalizeRunTurn({
    runId,
    userId: args.userId,
    messagesBeforeAssistant: [userMessage],
    state,
    currentPlan: null,
    turnMode: "discovery",
    clientState: args.input.clientState,
  });

  return buildResponseFromRun(created);
}

export async function getRun(args: {
  userId: string;
  runId: string;
}): Promise<AgentRunDetailResponse> {
  const rows = await prisma.$queryRaw<AgentRunRecord[]>`
    SELECT *
    FROM "AgentRun"
    WHERE "id" = ${args.runId}
      AND "userId" = ${args.userId}
    LIMIT 1
  `;
  const run = rows[0];

  if (!run) {
    throw new AgentRunNotFoundError();
  }

  const messages = parseMessages(run.messagesJson);
  const assistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  return {
    ...buildResponseFromRun(run),
    message: {
      role: "assistant",
      content:
        assistantMessage?.content ?? "Sesja Agenta nie ma jeszcze odpowiedzi.",
    },
    messages,
    result: run.resultJson ?? null,
  };
}
