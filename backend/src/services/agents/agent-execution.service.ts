import {
  CookingSkill,
  Diet,
  PrismaClient,
  type Preference,
} from "@prisma/client";
import type {
  AgentErrorCode,
  AgentExecuteAction,
  AgentExecuteRequest,
  AgentExecuteResponse,
  AgentPlanDraft,
  AgentStep,
} from "../../schemas/agent.schema.js";
import {
  AgentPlanDraftSchema,
  AgentStateSchema,
} from "../../schemas/agent.schema.js";
import type { FullRecipe } from "../../schemas/recipe.schema.js";
import { generateMealImages } from "../image.service.js";
import { generateFullRecipe } from "../recipe.service.js";
import {
  checkAllergyAndPreferenceConflicts,
  checkRecipeConflicts,
  getAgentUserPreferencesContext,
  normalizeShoppingName,
} from "./agent-tool-registry.js";
import { AgentRunNotFoundError } from "./agent-session.service.js";

const prisma = new PrismaClient();

type RecipeGenerator = typeof generateFullRecipe;
let recipeGenerator: RecipeGenerator = generateFullRecipe;

type ImageGenerator = typeof generateMealImages;
let imageGenerator: ImageGenerator = generateMealImages;

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

type ExecuteResultJson = AgentExecuteResponse["result"] & {
  acceptedPlanId?: string;
  actions?: AgentExecuteAction[];
  executeIdempotencyKey?: string;
};

export class AgentExecutionError extends Error {
  code: AgentErrorCode;
  retryable: boolean;
  statusCode: number;

  constructor(args: {
    code: AgentErrorCode;
    message: string;
    retryable: boolean;
    statusCode?: number;
  }) {
    super(args.message);
    this.name = "AgentExecutionError";
    this.code = args.code;
    this.retryable = args.retryable;
    this.statusCode = args.statusCode ?? 400;
  }
}

export function setAgentRecipeGeneratorForTests(generator?: RecipeGenerator) {
  recipeGenerator = generator ?? generateFullRecipe;
}

export function setAgentImageGeneratorForTests(generator?: ImageGenerator) {
  imageGenerator = generator ?? generateMealImages;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createStep(args: {
  key: AgentStep["key"];
  label: string;
  actor: AgentStep["actor"];
  status: AgentStep["status"];
  summary: string;
  startedAt: string;
  completedAt: string;
}): AgentStep {
  return {
    ...args,
    durationMs: Math.max(
      0,
      Date.parse(args.completedAt) - Date.parse(args.startedAt),
    ),
  };
}

function buildExecutionSteps(args: {
  recipeCreated: boolean;
  shoppingTouched: boolean;
  failedSummary?: string;
}): AgentStep[] {
  const startedAt = nowIso();
  const completedAt = nowIso();
  const failed = Boolean(args.failedSummary);

  return [
    createStep({
      key: "confirmation",
      label: "Potwierdzenie",
      actor: "chef_orchestrator",
      status: failed ? "failed" : "succeeded",
      summary: failed
        ? args.failedSummary ?? "Nie udało się wykonać planu."
        : "Potwierdzenie użytkownika zostało zweryfikowane.",
      startedAt,
      completedAt,
    }),
    createStep({
      key: "recipe_creation",
      label: "Tworzenie przepisu",
      actor: "chef_orchestrator",
      status: args.recipeCreated ? "succeeded" : failed ? "failed" : "skipped",
      summary: args.recipeCreated
        ? "Pełny przepis został utworzony i zapisany w historii."
        : "Tworzenie przepisu nie zostało wykonane.",
      startedAt,
      completedAt,
    }),
    createStep({
      key: "shopping_list",
      label: "Lista zakupów",
      actor: "shopping_planner",
      status: args.shoppingTouched ? "succeeded" : failed ? "failed" : "skipped",
      summary: args.shoppingTouched
        ? "Brakujące składniki zostały zapisane lub pominięte jako duplikaty."
        : "Lista zakupów nie została zmieniona.",
      startedAt,
      completedAt,
    }),
    createStep({
      key: "final_response",
      label: "Wynik",
      actor: "chef_orchestrator",
      status: failed ? "failed" : "succeeded",
      summary: failed
        ? args.failedSummary ?? "Zwracam kontrolowany błąd wykonania."
        : "Plan Agenta został wykonany.",
      startedAt,
      completedAt,
    }),
  ];
}

function toMeta(run: AgentRunRecord): AgentExecuteResponse["meta"] {
  return {
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
    durationMs: Math.max(0, run.updatedAt.getTime() - run.createdAt.getTime()),
    model: run.model,
    tokenUsage: {
      inputTokens: run.inputTokens,
      outputTokens: run.outputTokens,
    },
  };
}

function parseResultJson(value: unknown): ExecuteResultJson | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const result = value as ExecuteResultJson;
  if (!("recipe" in result) || !("mealHistoryId" in result)) {
    return null;
  }

  return result;
}

function toResponse(run: AgentRunRecord): AgentExecuteResponse {
  const result = parseResultJson(run.resultJson);

  return {
    runId: run.id,
    status: run.status as AgentExecuteResponse["status"],
    steps: Array.isArray(run.stepsJson) ? (run.stepsJson as AgentStep[]) : [],
    result: result
      ? {
          recipe: result.recipe ?? null,
          mealHistoryId: result.mealHistoryId ?? null,
          shoppingItemsAdded: result.shoppingItemsAdded ?? [],
          skippedShoppingItems: result.skippedShoppingItems ?? [],
        }
      : null,
    error: run.errorCode
      ? {
          code: run.errorCode as AgentErrorCode,
          message: run.errorMessage ?? "Nie udało się wykonać planu Agenta.",
          retryable: run.errorCode === "AGENT_EXECUTION_FAILED",
        }
      : null,
    meta: toMeta(run),
  };
}

function ensureExecutable(run: AgentRunRecord, input: AgentExecuteRequest) {
  if (run.status === "completed") {
    const result = parseResultJson(run.resultJson);
    if (result?.acceptedPlanId === input.acceptedPlanId) {
      return;
    }
  }

  if (run.status !== "awaiting_confirmation") {
    throw new AgentExecutionError({
      code: "AGENT_PLAN_NOT_EXECUTABLE",
      message: "Ten plan Agenta nie jest gotowy do wykonania.",
      retryable: false,
      statusCode: 409,
    });
  }
}

function parsePlan(run: AgentRunRecord): AgentPlanDraft {
  const parsed = AgentPlanDraftSchema.safeParse(run.planJson);

  if (!parsed.success) {
    throw new AgentExecutionError({
      code: "AGENT_PLAN_NOT_EXECUTABLE",
      message: "Plan Agenta nie zawiera danych wymaganych do wykonania.",
      retryable: false,
      statusCode: 409,
    });
  }

  return parsed.data;
}

function validateAcceptedPlan(plan: AgentPlanDraft, input: AgentExecuteRequest) {
  if (plan.id !== input.acceptedPlanId) {
    throw new AgentExecutionError({
      code: "AGENT_PLAN_MISMATCH",
      message: "Potwierdzony plan nie zgadza się z aktualnym planem sesji.",
      retryable: false,
      statusCode: 409,
    });
  }
}

function ensureCanExecute(run: AgentRunRecord) {
  const parsedState = AgentStateSchema.safeParse(run.stateJson);

  if (!parsedState.success || !parsedState.data.canExecute) {
    throw new AgentExecutionError({
      code: "AGENT_PLAN_NOT_EXECUTABLE",
      message: "Plan nie przeszedł jeszcze walidacji wykonania.",
      retryable: false,
      statusCode: 409,
    });
  }
}

function toRecipePreferences(preferences: Preference | null) {
  return {
    diet: preferences?.diet ?? Diet.NONE,
    allergies: preferences?.allergies ?? [],
    cookingSkill: preferences?.cookingSkill ?? CookingSkill.BEGINNER,
    spiceLevel: preferences?.spiceLevel ?? 3,
  };
}

function assertNoConflicts(
  check: { ok: boolean; conflicts: string[] },
  fallbackMessage: string,
) {
  if (check.ok) {
    return;
  }

  throw new AgentExecutionError({
    code: "AGENT_ALLERGY_CONFLICT",
    message: check.conflicts.join(" ") || fallbackMessage,
    retryable: false,
    statusCode: 409,
  });
}

async function findRunForUser(args: {
  userId: string;
  runId: string;
}): Promise<AgentRunRecord> {
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

  return run;
}

async function lockRun(args: {
  userId: string;
  input: AgentExecuteRequest;
}): Promise<AgentRunRecord> {
  const lockedRows = await prisma.$queryRaw<AgentRunRecord[]>`
    UPDATE "AgentRun"
    SET
      "status" = 'executing',
      "errorCode" = NULL,
      "errorMessage" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${args.input.runId}
      AND "userId" = ${args.userId}
      AND "status" = 'awaiting_confirmation'
    RETURNING *
  `;
  const locked = lockedRows[0];

  if (locked) {
    return locked;
  }

  const latest = await findRunForUser({
    userId: args.userId,
    runId: args.input.runId,
  });
  ensureExecutable(latest, args.input);

  return latest;
}

async function markFailed(args: {
  runId: string;
  error: AgentExecutionError;
}): Promise<AgentRunRecord> {
  const steps = buildExecutionSteps({
    recipeCreated: false,
    shoppingTouched: false,
    failedSummary: args.error.message.slice(0, 400),
  });
  const rows = await prisma.$queryRaw<AgentRunRecord[]>`
    UPDATE "AgentRun"
    SET
      "status" = 'failed',
      "stepsJson" = CAST(${JSON.stringify(steps)} AS JSONB),
      "errorCode" = ${args.error.code},
      "errorMessage" = ${args.error.message},
      "updatedAt" = CURRENT_TIMESTAMP,
      "completedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${args.runId}
    RETURNING *
  `;

  return rows[0];
}

async function createRecipe(args: {
  userId: string;
  plan: AgentPlanDraft;
  preferences: Preference | null;
}): Promise<FullRecipe> {
  const recipe = await recipeGenerator({
    teaser: args.plan.mealTeaser,
    servings: args.plan.servings,
    recipeContext: args.plan.recipeContext,
    userPreferences: toRecipePreferences(args.preferences),
  });
  const recipeCheck = checkRecipeConflicts(recipe, args.preferences);
  assertNoConflicts(
    recipeCheck,
    "Wygenerowany przepis koliduje z zapisanymi ograniczeniami.",
  );

  return recipe;
}

async function createImageUrl(plan: AgentPlanDraft): Promise<string | null> {
  if (plan.mealTeaser.imageUrl) {
    return plan.mealTeaser.imageUrl;
  }

  const [imageUrl] = await imageGenerator([plan.mealTeaser]);
  return imageUrl ?? null;
}

export async function executePlan(args: {
  userId: string;
  input: AgentExecuteRequest;
}): Promise<AgentExecuteResponse> {
  const existing = await findRunForUser({
    userId: args.userId,
    runId: args.input.runId,
  });
  ensureExecutable(existing, args.input);

  if (existing.status === "completed") {
    return toResponse(existing);
  }

  const plan = parsePlan(existing);
  validateAcceptedPlan(plan, args.input);
  ensureCanExecute(existing);

  const preferences = await getAgentUserPreferencesContext(args.userId);
  assertNoConflicts(
    checkAllergyAndPreferenceConflicts(plan, preferences),
    "Plan koliduje z zapisanymi ograniczeniami.",
  );

  const locked = await lockRun({
    userId: args.userId,
    input: args.input,
  });

  if (locked.status === "completed") {
    return toResponse(locked);
  }

  try {
    const shouldCreateRecipe = args.input.actions.includes("create_recipe");
    const shouldPopulateShopping = args.input.actions.includes(
      "populate_shopping_list",
    );
    const recipe = shouldCreateRecipe
      ? await createRecipe({
          userId: args.userId,
          plan,
          preferences,
        })
      : null;
    const imageUrl = recipe ? await createImageUrl(plan) : null;
    const completed = await prisma.$transaction(async (tx) => {
      const meal = recipe
        ? await tx.mealHistory.create({
            data: {
              userId: args.userId,
              name: recipe.name,
              description: recipe.description,
              ingredients: recipe.ingredients.map(
                (ingredient) =>
                  `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`,
              ),
              estimatedTime: recipe.totalTimeMinutes,
              category: plan.mealType ?? null,
              userPrompt: null,
              imageUrl,
              fullRecipeJson: recipe,
              isFavorite: false,
              wasSelected: true,
              selectedAt: new Date(),
            },
          })
        : null;
      const activeShoppingItems = shouldPopulateShopping
        ? await tx.shoppingItem.findMany({
            where: {
              userId: args.userId,
              obtained: false,
            },
            select: { item: true },
          })
        : [];
      const activeNames = new Set(
        activeShoppingItems.map((item) => normalizeShoppingName(item.item)),
      );
      const shoppingItemsAdded = [];
      const skippedShoppingItems = [];

      if (shouldPopulateShopping) {
        for (const item of plan.shoppingDraft) {
          const normalizedName = normalizeShoppingName(item.name);

          if (activeNames.has(normalizedName)) {
            skippedShoppingItems.push({
              name: item.name,
              reason: "duplicate_active_item",
            });
            continue;
          }

          const created = await tx.shoppingItem.create({
            data: {
              userId: args.userId,
              item: item.name.trim(),
              quantity: item.quantity,
              unit: item.unit?.trim() || null,
              category: item.category?.trim() || null,
              obtained: false,
              mealId: meal?.id ?? null,
            },
          });

          activeNames.add(normalizedName);
          shoppingItemsAdded.push({
            id: created.id,
            name: created.item,
            quantity: created.quantity,
            unit: created.unit,
            category: created.category,
            mealId: created.mealId,
          });
        }
      }

      const result: ExecuteResultJson = {
        acceptedPlanId: args.input.acceptedPlanId,
        actions: args.input.actions,
        executeIdempotencyKey: args.input.idempotencyKey,
        recipe: recipe
          ? {
              ...recipe,
              imageUrl,
            }
          : null,
        mealHistoryId: meal?.id ?? null,
        shoppingItemsAdded,
        skippedShoppingItems,
      };
      const steps = buildExecutionSteps({
        recipeCreated: Boolean(recipe),
        shoppingTouched: shouldPopulateShopping,
      });
      const rows = await tx.$queryRaw<AgentRunRecord[]>`
        UPDATE "AgentRun"
        SET
          "status" = 'completed',
          "stepsJson" = CAST(${JSON.stringify(steps)} AS JSONB),
          "resultJson" = CAST(${JSON.stringify(result)} AS JSONB),
          "errorCode" = NULL,
          "errorMessage" = NULL,
          "updatedAt" = CURRENT_TIMESTAMP,
          "completedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${args.input.runId}
          AND "userId" = ${args.userId}
          AND "status" = 'executing'
        RETURNING *
      `;

      if (!rows[0]) {
        throw new AgentExecutionError({
          code: "AGENT_PLAN_NOT_EXECUTABLE",
          message: "Sesja Agenta nie jest już w trakcie wykonywania.",
          retryable: false,
          statusCode: 409,
        });
      }

      return rows[0];
    });

    return toResponse(completed);
  } catch (error) {
    const executionError =
      error instanceof AgentExecutionError
        ? error
        : new AgentExecutionError({
            code: "AGENT_EXECUTION_FAILED",
            message: "Nie udało się wykonać planu Agenta.",
            retryable: true,
            statusCode: 500,
          });
    const failedRun = await markFailed({
      runId: args.input.runId,
      error: executionError,
    });

    return toResponse(failedRun);
  }
}
