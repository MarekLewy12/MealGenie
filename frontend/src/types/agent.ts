import type {
  FullRecipe,
  MealSuggestion,
  RecipeGenerationContext,
} from "./meal";

export type AgentRunStatus =
  | "collecting_context"
  | "planning"
  | "awaiting_confirmation"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export type AgentMealType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK"
  | "DESSERT"
  | "ANY";

export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AgentAssistantMessage = {
  role: "assistant";
  content: string;
};

export type AgentStepKey =
  | "session"
  | "preferences"
  | "history"
  | "allergy_guard"
  | "pantry"
  | "planning"
  | "review"
  | "confirmation"
  | "recipe_creation"
  | "shopping_list"
  | "final_response";

export type AgentStepActor =
  | "chef_orchestrator"
  | "allergy_guard"
  | "meal_historian"
  | "pantry_planner"
  | "shopping_planner"
  | "feasibility_reviewer";

export type AgentStepStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped";

export type AgentStep = {
  key: AgentStepKey;
  label: string;
  actor: AgentStepActor;
  status: AgentStepStatus;
  summary?: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
};

export type AgentState = {
  collectedContext: Record<string, unknown>;
  missingFields: string[];
  canExecute: boolean;
  followUpCount: number;
};

export type AgentNextAction = {
  type: "reply" | "adjust_goal" | "complete_profile" | "execute_plan";
  label: string;
  payload?: Record<string, unknown>;
};

export type AgentError = {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
};

export type AgentShoppingDraftItem = {
  name: string;
  quantity: number;
  unit?: string | null;
  category?: string | null;
};

export type AgentPlanDraft = {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  mealType?: AgentMealType;
  usedIngredients: string[];
  missingIngredients: string[];
  assumptions: string[];
  warnings: string[];
  mealTeaser: MealSuggestion;
  servings: number;
  recipeContext?: RecipeGenerationContext;
  shoppingDraft: AgentShoppingDraftItem[];
};

export type AgentMeta = {
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  durationMs: number;
  model?: string | null;
  tokenUsage?: {
    inputTokens?: number | null;
    outputTokens?: number | null;
  };
};

export type AgentChatResponse = {
  runId: string;
  status: AgentRunStatus;
  message: AgentAssistantMessage;
  state: AgentState;
  plan: AgentPlanDraft | null;
  steps: AgentStep[];
  nextActions: AgentNextAction[];
  error: AgentError | null;
  meta: AgentMeta;
};

export type AgentShoppingItemResult = {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  mealId: string | null;
};

export type AgentSkippedShoppingItem = {
  name: string;
  reason: string;
};

export type AgentExecuteAction = "create_recipe" | "populate_shopping_list";

export type AgentExecuteResult = {
  recipe: FullRecipe | null;
  mealHistoryId: string | null;
  shoppingItemsAdded: AgentShoppingItemResult[];
  skippedShoppingItems: AgentSkippedShoppingItem[];
};

export type AgentRunDetailResponse = AgentChatResponse & {
  messages: AgentMessage[];
  result: AgentExecuteResult | null;
};

export type AgentExecuteResponse = {
  runId: string;
  status: "executing" | "completed" | "failed";
  result: AgentExecuteResult | null;
  steps: AgentStep[];
  error: AgentError | null;
  meta: AgentMeta;
};

export type AgentClientState = {
  timezone?: string;
  locale?: string;
};
