import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { CookingSkill, Diet } from "@prisma/client";
import {
  FullRecipeSchema,
  type FullRecipe,
  type MealTeaserInput,
} from "../schemas/recipe.schema.js";

const openai = new OpenAI();

interface RecipeGenerationContext {
  teaser: MealTeaserInput;
  servings: number;
  userPreferences: {
    diet: Diet;
    allergies: string[];
    cookingSkill: CookingSkill;
    spiceLevel: number;
  };
}

const skillToPolish: Record<CookingSkill, string> = {
  BEGINNER: "poczatkujacy (proste techniki, podstawowe narzedzia)",
  INTERMEDIATE: "sredniozaawansowany (moze uzyc wiecej technik)",
  ADVANCED: "zaawansowany (zlozone techniki dozwolone)",
};

const spiceLevelToPolish: Record<number, string> = {
  1: "lagodny",
  2: "lekko pikantny",
  3: "umiarkowany",
  4: "ostry",
  5: "bardzo ostry",
};

export async function generateFullRecipe(
  context: RecipeGenerationContext,
): Promise<FullRecipe> {
  const { teaser, servings, userPreferences } = context;

  const systemPrompt = `
Jestes doswiadczonym szefem kuchni tworzacym SZCZEGOLOWE, KOMPLETNE przepisy kulinarne.

TWOJE ZASADY:
1. Przepis musi byc W PELNI WYKONALNY - zadnych pominiec!
2. Kroki musza byc SZCZEGOLOWE i JASNE (8-12 krokow)
3. Skladniki z DOKLADNYMI ilosciami i jednostkami
4. Dostosuj zlozonosc do poziomu: ${skillToPolish[userPreferences.cookingSkill]}
5. BEZWZGLEDNIE unikaj tych alergenow: ${userPreferences.allergies.join(", ") || "BRAK"}
6. Uwzglednij diete: ${userPreferences.diet}
7. Poziom pikantnosci: ${spiceLevelToPolish[userPreferences.spiceLevel] || "umiarkowany"}
8. Przepis na ${servings} porcji

STYL PISANIA:
- Cieply, zachecajacy ton
- Praktyczne wskazowki w kazdym kroku
- Emoji przy tytulach krokow dla czytelnosci
- Polski jezyk, naturalne sformulowania
`;

  const userPrompt = `
Rozwin ponizszy TEASER dania w pelny, szczegolowy przepis:

NAZWA: ${teaser.name}
OPIS: ${teaser.description}
TRUDNOSC: ${teaser.difficulty}
SZACOWANY CZAS: ${teaser.cookingTimeMinutes} minut

SKLADNIKI (zarys - ROZWIN je z dokladnymi ilosciami):
${teaser.ingredients.map((i) => `  - ${i.name}: ${i.amount}`).join("\n")}

KROKI (zarys - ROZWIN w 8-12 szczegolowych krokow):
${teaser.stepsSummary.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

WYGENERUJ kompletny przepis zawierajacy:
1. Pelna liste skladnikow z kategoriami (Mieso, Warzywa, Przyprawy, itd.)
2. 8-12 szczegolowych krokow z tytulami, czasami i wskazowkami
3. Wartosci odzywcze (kalorie, bialko, wegle, tluszcze)
4. 2-4 praktyczne wskazowki szefa kuchni
5. Sugestie podania
6. Info o przechowywaniu (jesli mozna przechowac)
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
    const recipe = FullRecipeSchema.parse(json);
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
