import { pdf } from "@react-pdf/renderer";

import { RecipePdf } from "../components/RecipePdf";
import type { FullRecipe } from "../types/meal";

const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

function stripEmoji(text: string): string {
  return text.replace(EMOJI_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

function cleanOptionalText(text?: string): string | undefined {
  if (!text) {
    return undefined;
  }

  const cleanedText = stripEmoji(text);
  return cleanedText || undefined;
}

function cleanRecipeForPdf(recipe: FullRecipe): FullRecipe {
  return {
    ...recipe,
    name: stripEmoji(recipe.name),
    description: stripEmoji(recipe.description),
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      name: stripEmoji(ingredient.name),
      category: stripEmoji(ingredient.category),
      notes: cleanOptionalText(ingredient.notes),
    })),
    steps: recipe.steps.map((step) => ({
      ...step,
      title: stripEmoji(step.title),
      instruction: stripEmoji(step.instruction),
      duration: cleanOptionalText(step.duration),
      tip: cleanOptionalText(step.tip),
    })),
    tips: recipe.tips.map(stripEmoji),
    servingSuggestion: cleanOptionalText(recipe.servingSuggestion),
    storageInfo: cleanOptionalText(recipe.storageInfo),
  };
}

function buildPdfFileName(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalized || "przepis"}.pdf`;
}

export async function downloadRecipePdf(
  recipe: FullRecipe,
  imageUrl?: string,
): Promise<void> {
  const cleanRecipe = cleanRecipeForPdf(recipe);

  const blob = await pdf(
    <RecipePdf recipe={cleanRecipe} imageUrl={imageUrl} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = buildPdfFileName(cleanRecipe.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
