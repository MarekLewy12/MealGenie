import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { CookingSkill, Diet } from "@prisma/client";
import {
  FullRecipeSchema,
  type FullRecipe,
  type MealTeaserInput,
  type RecipeGenerationContext,
} from "../schemas/recipe.schema.js";

const openai = new OpenAI();

interface RecipeServiceContext {
  teaser: MealTeaserInput;
  servings: number;
  recipeContext?: RecipeGenerationContext;
  userPreferences: {
    diet: Diet;
    allergies: string[];
    cookingSkill: CookingSkill;
    spiceLevel: number;
  };
}

const skillToPolish: Record<CookingSkill, string> = {
  BEGINNER: "początkujący (proste techniki, podstawowe narzędzia)",
  INTERMEDIATE: "średniozaawansowany (może użyć więcej technik)",
  ADVANCED: "zaawansowany (złożone techniki dozwolone)",
};

const spiceLevelToPolish: Record<number, string> = {
  1: "łagodny",
  2: "lekko pikantny",
  3: "umiarkowany",
  4: "ostry",
  5: "bardzo ostry",
};

const hungerLevelDescriptions: Record<number, string> = {
  1: "bardzo lekki posiłek, mała porcja, niskokaloryczny",
  2: "lekki posiłek, umiarkowana porcja",
  3: "standardowy posiłek, normalna porcja",
  4: "sycący posiłek, większa porcja",
  5: "bardzo sycący posiłek, duża porcja typu uczta",
};

function buildGenerationContextPrompt(
  recipeContext: RecipeGenerationContext | undefined,
  servings: number,
) {
  if (!recipeContext) {
    return `- Przepis na ${servings} porcji.`;
  }

  const hungerLine = recipeContext.hungerLevel
    ? `- Poziom apetytu: ${hungerLevelDescriptions[recipeContext.hungerLevel]}.`
    : "- Poziom apetytu: standardowy.";

  if (
    recipeContext.portionMode === "weight" &&
    recipeContext.targetWeightGrams
  ) {
    return `
- Tryb gramaturowy: przepis ma dać dokładnie ${recipeContext.targetWeightGrams} g gotowego dania jako całość.
- Precyzyjnie przelicz ilości składników pod docelową wagę gotowego produktu.
- Pole servings ustaw na ${servings}; wartości odżywcze podaj na jedną porcję.
${hungerLine}
`;
  }

  return `
- Przepis na ${servings} porcji.
${hungerLine}
`;
}

export async function generateFullRecipe(
  context: RecipeServiceContext,
): Promise<FullRecipe> {
  const { teaser, servings, recipeContext, userPreferences } = context;
  const generationContextPrompt = buildGenerationContextPrompt(
    recipeContext,
    servings,
  );

  const systemPrompt = `
	Jesteś doświadczonym szefem kuchni tworzącym SZCZEGÓŁOWE, KOMPLETNE przepisy kulinarne.

	TWOJE ZASADY:
	1. Przepis musi być W PEŁNI WYKONALNY - żadnych pominięć!
	2. Kroki muszą być SZCZEGÓŁOWE i JASNE (8-12 kroków)
	3. Składniki z DOKŁADNYMI ilościami i jednostkami
	4. Dostosuj złożoność do poziomu: ${skillToPolish[userPreferences.cookingSkill]}
	5. BEZWZGLĘDNIE unikaj tych alergenów: ${userPreferences.allergies.join(", ") || "BRAK"}
	6. Uwzględnij dietę: ${userPreferences.diet}
	7. Poziom pikantności: ${spiceLevelToPolish[userPreferences.spiceLevel] || "umiarkowany"}
	8. Kontekst generatora:
${generationContextPrompt}

	STYL PISANIA:
	- Ciepły, zachęcający ton
	- Praktyczne wskazówki w każdym kroku
	- Emoji przy tytułach kroków dla czytelności
	- Polski język, naturalne sformułowania
	`;

  const userPrompt = `
	Rozwiń poniższy TEASER dania w pełny, szczegółowy przepis:

	NAZWA: ${teaser.name}
	OPIS: ${teaser.description}
	TRUDNOŚĆ: ${teaser.difficulty}
	SZACOWANY CZAS: ${teaser.cookingTimeMinutes} minut

	SKŁADNIKI (zarys - ROZWIŃ je z dokładnymi ilościami):
	${teaser.ingredients.map((i) => `  - ${i.name}: ${i.amount}`).join("\n")}

	KROKI (zarys - ROZWIŃ w 8-12 szczegółowych kroków):
	${teaser.stepsSummary.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

	WYGENERUJ kompletny przepis zawierający:
	1. Pełną listę składników z kategoriami (Mięso, Warzywa, Przyprawy, itd.)
	2. 8-12 szczegółowych kroków z tytułami, czasami i wskazówkami
	3. Wartości odżywcze (kalorie, białko, węgle, tłuszcze)
	4. 2-4 praktyczne wskazówki szefa kuchni
	5. Sugestie podania
	6. Informacje o przechowywaniu (jeśli można przechować)
	`;

  console.log("[RECIPE] Generating full recipe for:", teaser.name);

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: zodResponseFormat(FullRecipeSchema, "full_recipe"),
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI returned empty response");
  }

  try {
    const json = JSON.parse(content);
    const parsedRecipe = FullRecipeSchema.parse(json);
    const recipe: FullRecipe = recipeContext
      ? { ...parsedRecipe, generationContext: recipeContext }
      : parsedRecipe;
    console.log(
      "[RECIPE] Successfully generated recipe with",
      recipe.steps.length,
      "steps",
    );
    return recipe;
  } catch (err) {
    console.error("[RECIPE] Failed to parse AI response:", err);
    throw new Error("Failed to parse recipe from AI");
  }
}
