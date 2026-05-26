import { z } from "zod";
import {
  AgentDecisionSchema,
  type AgentDecision,
} from "../../schemas/agent.schema.js";

const OpenAIMealTeaserSchema = z.object({
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  cookingTimeMinutes: z.number(),
  calories: z.number().nullable(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
    }),
  ),
  stepsSummary: z.array(z.string()),
  imagePromptEn: z.string().max(300),
  imageUrl: z.string().nullable(),
});

const OpenAIRecipeGenerationContextSchema = z.object({
  portionMode: z.enum(["servings", "weight"]),
  servingSize: z.number().int().min(1).max(12).nullable(),
  targetWeightGrams: z.number().min(50).max(5000).nullable(),
  hungerLevel: z.number().int().min(1).max(5).nullable(),
});

const OpenAIPlanDraftSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(800),
  rationale: z.string().min(1).max(800),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DESSERT", "ANY"]),
  usedIngredients: z.array(z.string().min(1).max(120)),
  missingIngredients: z.array(z.string().min(1).max(120)),
  assumptions: z.array(z.string().min(1).max(200)),
  warnings: z.array(z.string().min(1).max(240)),
  mealTeaser: OpenAIMealTeaserSchema,
  servings: z.number().int().min(1).max(12),
  recipeContext: OpenAIRecipeGenerationContextSchema.nullable(),
  shoppingDraft: z.array(
    z.object({
      name: z.string().min(1).max(120),
      quantity: z.number().positive().max(1000),
      unit: z.string().min(1).max(40).nullable(),
      category: z.string().min(1).max(80).nullable(),
    }),
  ),
});

const OpenAIDecisionSchema = z.object({
  type: z.enum(["ask_follow_up", "show_plan", "fail"]),
  message: z.string().min(1).max(1200),
  missingFields: z.array(z.string().min(1).max(80)),
  collectedContext: z.array(
    z.object({
      key: z.string().min(1).max(80),
      value: z.string().min(1).max(500),
    }),
  ),
  plan: OpenAIPlanDraftSchema.nullable(),
  errorCode: z.string().max(80),
  retryable: z.boolean(),
});

export const OpenAIAgentDecisionOutputSchema = z.object({
  decision: OpenAIDecisionSchema,
});

type OpenAIDecision = z.infer<typeof OpenAIDecisionSchema>;

function stripNullProperties(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripNullProperties);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== null)
      .map(([key, entryValue]) => [key, stripNullProperties(entryValue)]),
  );
}

function toDomainDecisionInput(decision: OpenAIDecision): unknown {
  const collectedContext = Object.fromEntries(
    decision.collectedContext.map((entry) => [entry.key, entry.value]),
  );

  if (decision.type === "ask_follow_up") {
    return {
      type: decision.type,
      message: decision.message,
      missingFields: decision.missingFields,
      collectedContext,
    };
  }

  if (decision.type === "show_plan") {
    return {
      type: decision.type,
      message: decision.message,
      missingFields: decision.missingFields,
      collectedContext,
      plan: stripNullProperties(decision.plan),
    };
  }

  return {
    type: decision.type,
    errorCode: decision.errorCode,
    message: decision.message,
    retryable: decision.retryable,
  };
}

export function parseOpenAIAgentDecisionOutput(parsed: unknown): AgentDecision {
  const domainDecision = AgentDecisionSchema.safeParse(parsed);
  if (domainDecision.success) {
    return domainDecision.data;
  }

  const output = OpenAIAgentDecisionOutputSchema.parse(
    parsed && typeof parsed === "object" && "decision" in parsed
      ? parsed
      : { decision: parsed },
  );

  return AgentDecisionSchema.parse(toDomainDecisionInput(output.decision));
}
