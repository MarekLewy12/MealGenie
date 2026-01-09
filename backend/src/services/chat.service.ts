import OpenAI from "openai";
import type { ChatMessageInput } from "../schemas/chat.schema.js";
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
