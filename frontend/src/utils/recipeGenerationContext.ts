import type { RecipeGenerationContext } from "../types/meal";

export function formatServingLabel(servingSize: number) {
  if (servingSize === 1) {
    return "1 osoba";
  }

  return `${servingSize} ${servingSize < 5 ? "osoby" : "osób"}`;
}

export function formatHungerLevel(hungerLevel?: number) {
  if (!hungerLevel) {
    return null;
  }

  return `Apetyt ${hungerLevel}/5`;
}

export function formatRecipeContextPrimaryLabel(
  recipeContext?: RecipeGenerationContext,
) {
  if (!recipeContext) {
    return null;
  }

  if (recipeContext.portionMode === "weight") {
    return recipeContext.targetWeightGrams
      ? `${recipeContext.targetWeightGrams} g`
      : null;
  }

  return formatServingLabel(recipeContext.servingSize);
}

export function getRecipeContextBadges(recipeContext?: RecipeGenerationContext) {
  if (!recipeContext) {
    return [];
  }

  const badges: string[] = [];

  if (recipeContext.portionMode === "weight" && recipeContext.targetWeightGrams) {
    badges.push(`Docelowa waga: ${recipeContext.targetWeightGrams} g`);
  }

  if (recipeContext.portionMode === "servings") {
    badges.push(`Porcja: ${formatServingLabel(recipeContext.servingSize)}`);
  }

  const hungerLabel = formatHungerLevel(recipeContext.hungerLevel);
  if (hungerLabel) {
    badges.push(hungerLabel);
  }

  return badges;
}
