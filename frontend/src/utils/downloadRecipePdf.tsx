import { pdf } from "@react-pdf/renderer";

import { RecipePdf } from "../components/RecipePdf";
import type { FullRecipe } from "../types/meal";

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
  const blob = await pdf(
    <RecipePdf recipe={recipe} imageUrl={imageUrl} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = buildPdfFileName(recipe.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
