import { z } from "zod";

export const AgentRunStatusSchema = z.enum([
  "collecting_context",
  "planning",
  "awaiting_confirmation",
  "executing",
  "completed",
  "failed",
  "cancelled",
]);

export const AgentStepKeySchema = z.enum([
  "session",
  "preferences",
  "history",
  "allergy_guard",
  "pantry",
  "planning",
  "review",
  "confirmation",
  "recipe_creation",
  "shopping_list",
  "final_response",
]);

export const AgentStepActorSchema = z.enum([
  "chef_orchestrator",
  "allergy_guard",
  "meal_historian",
  "pantry_planner",
  "shopping_planner",
  "feasibility_reviewer",
]);

export const AgentStepStatusSchema = z.enum([
  "pending",
  "running",
  "succeeded",
  "failed",
  "skipped",
]);

export const AgentErrorCodeSchema = z.enum([
  "AGENT_DISABLED",
  "AGENT_RUN_NOT_FOUND",
  "VALIDATION_ERROR",
  "INTERNAL_ERROR",
  "AGENT_RUNTIME_ERROR",
  "AGENT_TIMEOUT",
  "AGENT_INVALID_OUTPUT",
  "AGENT_REFUSAL",
]);

export const AgentMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
  createdAt: z.iso.datetime(),
});

export const AgentStepSchema = z.object({
  key: AgentStepKeySchema,
  label: z.string().min(1).max(120),
  actor: AgentStepActorSchema,
  status: AgentStepStatusSchema,
  summary: z.string().max(400).optional(),
  startedAt: z.iso.datetime().optional(),
  completedAt: z.iso.datetime().optional(),
  durationMs: z.number().int().nonnegative().optional(),
});

export const AgentStateSchema = z.object({
  collectedContext: z.record(z.string(), z.unknown()).default({}),
  missingFields: z.array(z.string()).default([]),
  canExecute: z.boolean().default(false),
  followUpCount: z.number().int().nonnegative().default(0),
});

export const AgentNextActionSchema = z.object({
  type: z.enum(["reply", "adjust_goal", "complete_profile"]),
  label: z.string().min(1).max(120),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const AgentErrorSchema = z.object({
  code: AgentErrorCodeSchema,
  message: z.string(),
  retryable: z.boolean(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const AgentPlanDraftSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(800),
  rationale: z.string().min(1).max(800),
  usedIngredients: z.array(z.string().min(1).max(120)),
  missingIngredients: z.array(z.string().min(1).max(120)),
  assumptions: z.array(z.string().min(1).max(200)),
  warnings: z.array(z.string().min(1).max(240)),
});

const AgentDecisionContextPatchSchema = z
  .record(z.string(), z.unknown())
  .optional();

export const AgentDecisionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ask_follow_up"),
    message: z.string().min(1).max(1200),
    missingFields: z.array(z.string().min(1).max(80)),
    collectedContext: AgentDecisionContextPatchSchema,
  }),
  z.object({
    type: z.literal("show_plan"),
    message: z.string().min(1).max(1200),
    plan: AgentPlanDraftSchema,
    missingFields: z.array(z.string().min(1).max(80)).default([]),
    collectedContext: AgentDecisionContextPatchSchema,
  }),
  z.object({
    type: z.literal("fail"),
    errorCode: z.string().min(1).max(80),
    message: z.string().min(1).max(1200),
    retryable: z.boolean().default(false),
  }),
]);

export const AgentDecisionOutputSchema = z.object({
  decision: AgentDecisionSchema,
});

export const AgentMetaSchema = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().nullable().optional(),
  durationMs: z.number().int().nonnegative(),
  model: z.string().nullable().optional(),
  tokenUsage: z
    .object({
      inputTokens: z.number().int().nonnegative().nullable().optional(),
      outputTokens: z.number().int().nonnegative().nullable().optional(),
    })
    .optional(),
});

export const AgentChatRequestSchema = z.object({
  runId: z.uuid().optional(),
  mode: z.enum(["CHEF_ORCHESTRATOR"]).default("CHEF_ORCHESTRATOR"),
  message: z.string().min(1).max(1200),
  clientState: z
    .object({
      timezone: z.string().max(80).optional(),
      locale: z.string().max(20).default("pl-PL").optional(),
    })
    .optional(),
  idempotencyKey: z.string().min(8).max(120).optional(),
});

export const AgentRunIdParamSchema = z.object({
  id: z.uuid({ error: "Nieprawidłowy format ID sesji agenta" }),
});

export const AgentChatResponseSchema = z.object({
  runId: z.uuid(),
  status: AgentRunStatusSchema,
  message: z.object({
    role: z.literal("assistant"),
    content: z.string(),
  }),
  state: AgentStateSchema,
  plan: z.unknown().nullable(),
  steps: z.array(AgentStepSchema),
  nextActions: z.array(AgentNextActionSchema),
  error: AgentErrorSchema.nullable(),
  meta: AgentMetaSchema,
});

export const AgentRunDetailResponseSchema = AgentChatResponseSchema.extend({
  messages: z.array(AgentMessageSchema),
  result: z.unknown().nullable(),
});

export type AgentChatRequest = z.infer<typeof AgentChatRequestSchema>;
export type AgentChatResponse = z.infer<typeof AgentChatResponseSchema>;
export type AgentRunDetailResponse = z.infer<
  typeof AgentRunDetailResponseSchema
>;
export type AgentMessage = z.infer<typeof AgentMessageSchema>;
export type AgentState = z.infer<typeof AgentStateSchema>;
export type AgentStep = z.infer<typeof AgentStepSchema>;
export type AgentErrorCode = z.infer<typeof AgentErrorCodeSchema>;
export type AgentPlanDraft = z.infer<typeof AgentPlanDraftSchema>;
export type AgentDecision = z.infer<typeof AgentDecisionSchema>;
export type AgentDecisionOutput = z.infer<typeof AgentDecisionOutputSchema>;
