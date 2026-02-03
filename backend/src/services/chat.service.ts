import OpenAI from "openai";
import type { ChatMessageInput } from "../schemas/chat.schema.js";
import type { MealHistoryDetail } from "./history.service.js";
import type { PreferencesResponse } from "./preferences.service.js";

const openai = new OpenAI();

function buildPreferencesBlock(prefs: PreferencesResponse | null): string {
  if (!prefs) {
    return `
PREFERENCJE UŻYTKOWNIKA:
- Brak zapisanych preferencji. Użytkownik może jeść wszystko, ale warto dopytać o preferencje.
`.trim();
  }

  return `
PREFERENCJE UŻYTKOWNIKA (KRYTYCZNE):
- Dieta: ${prefs.diet}
- Alergie (BEZWZGLĘDNIE UNIKAJ): ${prefs.allergies.join(", ") || "Brak"}
- Nie lubi: ${prefs.dislikedIngredients.join(", ") || "Brak"}
- Ulubione kuchnie: ${prefs.favCuisines.join(", ") || "Brak"}
- Umiejętności: ${prefs.cookingSkill}
- Sprzęt: ${prefs.kitchenEquipment.join(", ") || "Standard"}
- Poziom pikantności: ${prefs.spiceLevel}/5
`.trim();
}

function buildSystemPrompt(args: {
  mode: "global" | "recipe";
  preferences: PreferencesResponse | null;
  recipeContext?: string;
}): string {
  const preferencesBlock = buildPreferencesBlock(args.preferences);

  const base = `
Jesteś "Kuchennym Asystentem" w aplikacji MealGenie.
Twoim celem jest pomaganie w gotowaniu, planowaniu i zakupach.
Mówisz po polsku. Styl: luźny, pomocny, zwięzły. Używaj emoji.

FORMATOWANIE (WAŻNE):
- Używaj Markdown do strukturyzowania wypowiedzi.
- Pogrubiaj kluczowe nazwy składników lub dań (**tekst**).
- Składniki zawsze wypisuj jako listę punktowaną.
- Kroki przepisu wypisuj jako listę numerowaną.
- Oddzielaj sekcje pustą linią dla lepszej czytelności.

ZASADY:
1. Bezpieczeństwo: Nigdy nie sugeruj składników, na które użytkownik ma alergię.
2. Konkret: Odpowiadaj zwięźle. Nie pisz elaboratów, chyba że user o to prosi.
3. Jeśli użytkownik pyta o coś niezwiązanego z jedzeniem, grzecznie odmów i wróć do tematu kuchni.

${preferencesBlock}
`.trim();

  if (args.mode === "recipe") {
    return `
${base}

TRYB PRZEPISU:
Użytkownik przegląda konkretny przepis. Odpowiadaj w jego kontekście (zamienniki, porady, czas).
${args.recipeContext ? `KONTEKST PRZEPISU:\n${args.recipeContext}` : ""}
`.trim();
  }

  return base;
}

/**
 * Buduje zwięzły kontekst przepisu dla AI.
 *
 * Celowo ogranicza długość danych (składniki, kroki, tipy),
 * żeby zachować kluczowe informacje bez nadmiernych kosztów tokenów.
 *
 * @param meal - Przepis z bazy danych (z pełnym JSON-em receptury)
 * @returns Sformatowany tekst do użycia w system prompt
 */
export function buildRecipeContext(meal: MealHistoryDetail): string {
  const recipe = meal.fullRecipeJson as any;

  if (!recipe) {
    return `PRZEPIS: ${meal.name}\n(Brak szczegółowych danych przepisu)`;
  }

  const ingredientsList = (recipe.ingredients || [])
    .slice(0, 25)
    .map((ing: any) => {
      const amount = ing.amount ? `: ${ing.amount}` : "";
      const unit = ing.unit ? ` ${ing.unit}` : "";
      const notes = ing.notes ? ` (${ing.notes})` : "";
      return `  • ${ing.name}${amount}${unit}${notes}`;
    })
    .join("\n");

  const ingredientsMore =
    (recipe.ingredients?.length || 0) > 25
      ? `\n  ... i ${recipe.ingredients.length - 25} więcej`
      : "";

  const stepsList = (recipe.steps || [])
    .slice(0, 12)
    .map((step: any, index: number) => {
      const duration = step.duration ? ` [${step.duration} min]` : "";
      const title = step.title ? ` — ${step.title}` : "";
      return `  ${index + 1}. ${step.instruction || step.description}${title}${duration}`;
    })
    .join("\n");

  const stepsMore =
    (recipe.steps?.length || 0) > 12
      ? `\n  ... i ${recipe.steps.length - 12} więcej kroków`
      : "";

  let nutritionBlock = "";
  if (recipe.nutrition) {
    const n = recipe.nutrition;
    nutritionBlock = `
WARTOŚCI ODŻYWCZE (na porcję):
  • Kalorie: ${n.calories || "?"} kcal
  • Białko: ${n.protein || "?"}g
  • Węglowodany: ${n.carbs || "?"}g
  • Tłuszcze: ${n.fat || "?"}g`;
  }

  let tipsBlock = "";
  if (recipe.tips?.length > 0) {
    const tips = recipe.tips
      .slice(0, 3)
      .map((t: string) => `  💡 ${t}`)
      .join("\n");
    tipsBlock = `\nWSKAZÓWKI SZEFA:\n${tips}`;
  }

  return `
═══════════════════════════════════════
PRZEPIS: ${recipe.name || meal.name}
═══════════════════════════════════════

PODSTAWOWE INFO:
  • Czas przygotowania: ${recipe.prepTimeMinutes || "?"} min
  • Trudność: ${recipe.difficulty || "?"}
  • Porcje: ${recipe.servings || "?"}

SKŁADNIKI:
${ingredientsList}${ingredientsMore}

KROKI PRZYGOTOWANIA:
${stepsList}${stepsMore}
${nutritionBlock}
${tipsBlock}
`.trim();
}

export async function generateAssistantReply(args: {
  mode: "global" | "recipe";
  messages: ChatMessageInput[];
  preferences: PreferencesResponse | null;
  recipeContext?: string;
}): Promise<string> {
  const systemPrompt = buildSystemPrompt({
    mode: args.mode,
    preferences: args.preferences,
    recipeContext: args.recipeContext,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      ...args.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("AI returned empty response");
  }
  return content;
}
