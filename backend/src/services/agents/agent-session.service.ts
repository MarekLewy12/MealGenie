import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type {
  AgentChatRequest,
  AgentChatResponse,
  AgentMessage,
  AgentRunDetailResponse,
  AgentState,
  AgentStep,
} from "../../schemas/agent.schema.js";
import { AgentStateSchema } from "../../schemas/agent.schema.js";

const prisma = new PrismaClient();

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
    followUpCount: 1,
  };
}

function buildMockSteps(startedAt: string, completedAt: string): AgentStep[] {
  return [
    {
      key: "session",
      label: "Sesja Agenta",
      actor: "chef_orchestrator",
      status: "succeeded",
      summary: "Utworzyłem bezpieczną sesję rozmowy z Agentem.",
      startedAt,
      completedAt,
      durationMs: 0,
    },
    {
      key: "preferences",
      label: "Preferencje",
      actor: "chef_orchestrator",
      status: "pending",
      summary: "W PR 2 Agent zacznie sprawdzać zapisany profil użytkownika.",
    },
    {
      key: "allergy_guard",
      label: "Strażnik Alergii",
      actor: "allergy_guard",
      status: "pending",
      summary: "W PR 2 rozpoczniemy kontrolę alergii i ograniczeń.",
    },
  ];
}

function buildAssistantMessage(): string {
  return (
    "Jestem gotowy jako MealGenie Agent. W tej wersji zapisuję sesję i " +
    "przygotowuję panel pracy Agenta; właściwe planowanie kulinarne pojawi " +
    "się w kolejnym kroku."
  );
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
    nextActions: [
      {
        type: "reply",
        label: "Kontynuuj rozmowę",
      },
    ],
    error: null,
    meta: toMeta(run),
  };
}

export async function createOrContinueAgentChat(args: {
  userId: string;
  input: AgentChatRequest;
}): Promise<AgentChatResponse> {
  const startedAt = nowIso();
  const userMessage: AgentMessage = {
    role: "user",
    content: args.input.message,
    createdAt: startedAt,
  };
  const assistantMessage: AgentMessage = {
    role: "assistant",
    content: buildAssistantMessage(),
    createdAt: nowIso(),
  };
  const completedAt = nowIso();
  const steps = buildMockSteps(startedAt, completedAt);

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

    const messages = [
      ...parseMessages(existing.messagesJson),
      userMessage,
      assistantMessage,
    ];
    const state = parseState(existing.stateJson);

    const updatedRows = await prisma.$queryRaw<AgentRunRecord[]>`
      UPDATE "AgentRun"
      SET
        "messagesJson" = CAST(${JSON.stringify(messages)} AS JSONB),
        "stateJson" = CAST(${JSON.stringify(state)} AS JSONB),
        "stepsJson" = CAST(${JSON.stringify(steps)} AS JSONB),
        "status" = 'collecting_context',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${existing.id}
      RETURNING *
    `;
    const updated = updatedRows[0];

    if (!updated) {
      throw new AgentRunNotFoundError();
    }

    return {
      runId: updated.id,
      status: "collecting_context",
      message: { role: "assistant", content: assistantMessage.content },
      state,
      plan: updated.planJson ?? null,
      steps,
      nextActions: [
        {
          type: "reply",
          label: "Kontynuuj rozmowę",
        },
      ],
      error: null,
      meta: toMeta(updated),
    };
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

  const state = buildInitialState();
  const runId = randomUUID();
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
      "updatedAt"
    )
    VALUES (
      ${runId},
      ${args.userId},
      ${args.input.mode},
      'collecting_context',
      ${args.input.idempotencyKey ?? null},
      CAST(${JSON.stringify([userMessage, assistantMessage])} AS JSONB),
      CAST(${JSON.stringify(state)} AS JSONB),
      CAST(${JSON.stringify(steps)} AS JSONB),
      CURRENT_TIMESTAMP
    )
    RETURNING *
  `;
  const created = createdRows[0];

  if (!created) {
    throw new Error("Failed to create agent run");
  }

  return {
    runId: created.id,
    status: "collecting_context",
    message: { role: "assistant", content: assistantMessage.content },
    state,
    plan: null,
    steps,
    nextActions: [
      {
        type: "reply",
        label: "Kontynuuj rozmowę",
      },
    ],
    error: null,
    meta: toMeta(created),
  };
}

export async function getAgentRunForUser(args: {
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
    runId: run.id,
    status: run.status as AgentRunDetailResponse["status"],
    message: {
      role: "assistant",
      content: assistantMessage?.content ?? "Sesja Agenta nie ma jeszcze odpowiedzi.",
    },
    state: parseState(run.stateJson),
    plan: run.planJson ?? null,
    steps: parseSteps(run.stepsJson),
    nextActions: [
      {
        type: "reply",
        label: "Kontynuuj rozmowę",
      },
    ],
    error: null,
    meta: toMeta(run),
    messages,
    result: run.resultJson ?? null,
  };
}
