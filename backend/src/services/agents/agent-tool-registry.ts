import { PrismaClient, type Preference } from "@prisma/client";
import type { AgentPlanDraft } from "../../schemas/agent.schema.js";
import type { FullRecipe } from "../../schemas/recipe.schema.js";

const prisma = new PrismaClient();

export type AgentRecentMeal = {
  name: string;
  category: string | null;
  ingredients: string[];
  createdAt: string;
};

export type AgentToolContext = {
  preferences: Preference | null;
  recentHistory: AgentRecentMeal[];
};

export type AgentConflictCheck = {
  ok: boolean;
  conflicts: string[];
};

export function normalizeShoppingName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizeForConflict(value: string): string {
  return normalizeShoppingName(value);
}

function hasConflict(needle: string, haystack: string): boolean {
  const normalizedNeedle = normalizeForConflict(needle);
  const normalizedHaystack = normalizeForConflict(haystack);

  return (
    normalizedNeedle.length > 0 &&
    normalizedHaystack.length > 0 &&
    (normalizedHaystack.includes(normalizedNeedle) ||
      normalizedNeedle.includes(normalizedHaystack))
  );
}

export async function getAgentUserPreferencesContext(
  userId: string,
): Promise<Preference | null> {
  return prisma.preference.findUnique({ where: { userId } });
}

export async function getAgentRecentMealContext(
  userId: string,
  limit = 5,
): Promise<AgentRecentMeal[]> {
  const meals = await prisma.mealHistory.findMany({
    where: { userId },
    select: {
      name: true,
      category: true,
      ingredients: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return meals.map((meal) => ({
    name: meal.name,
    category: meal.category,
    ingredients: meal.ingredients,
    createdAt: meal.createdAt.toISOString(),
  }));
}

export async function getAgentToolContext(
  userId: string,
): Promise<AgentToolContext> {
  const [preferences, recentHistory] = await Promise.all([
    getAgentUserPreferencesContext(userId),
    getAgentRecentMealContext(userId),
  ]);

  return { preferences, recentHistory };
}

export function checkAllergyAndPreferenceConflicts(
  plan: AgentPlanDraft,
  preferences: Preference | null,
): AgentConflictCheck {
  if (!preferences) {
    return { ok: true, conflicts: [] };
  }

  const planIngredients = [
    ...plan.usedIngredients,
    ...plan.missingIngredients,
    ...plan.mealTeaser.ingredients.map((ingredient) => ingredient.name),
  ];
  const conflicts: string[] = [];

  for (const allergy of preferences.allergies) {
    const matched = planIngredients.find((ingredient) =>
      hasConflict(allergy, ingredient),
    );

    if (matched) {
      conflicts.push(`Alergia "${allergy}" koliduje ze składnikiem "${matched}".`);
    }
  }

  for (const disliked of preferences.dislikedIngredients) {
    const matched = planIngredients.find((ingredient) =>
      hasConflict(disliked, ingredient),
    );

    if (matched) {
      conflicts.push(
        `Nielubiany składnik "${disliked}" koliduje ze składnikiem "${matched}".`,
      );
    }
  }

  return {
    ok: conflicts.length === 0,
    conflicts,
  };
}

export function checkRecipeConflicts(
  recipe: FullRecipe,
  preferences: Preference | null,
): AgentConflictCheck {
  if (!preferences) {
    return { ok: true, conflicts: [] };
  }

  const ingredientNames = recipe.ingredients.map((ingredient) => ingredient.name);
  const conflicts: string[] = [];

  for (const allergy of preferences.allergies) {
    const matched = ingredientNames.find((ingredient) =>
      hasConflict(allergy, ingredient),
    );

    if (matched) {
      conflicts.push(`Alergia "${allergy}" pojawiła się w przepisie: "${matched}".`);
    }
  }

  return {
    ok: conflicts.length === 0,
    conflicts,
  };
}
