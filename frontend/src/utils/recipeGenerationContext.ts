import type { RecipeGenerationContext } from "../types/meal";

export function formatServingLabel(servingSize: number) {
  if (servingSize === 1) {
    return "1 osoba";
  }

  return `${servingSize} ${servingSize < 5 ? "osoby" : "osób"}`;
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
