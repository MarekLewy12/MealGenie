import OpenAI from "openai";
import type { ChatMessageInput } from "../schemas/chat.schema.js";
import type { PreferencesResponse } from "./preferences.service.js";

const openai = new OpenAI();

function buildPreferencesBlock(prefs: PreferencesResponse | null): string {
  if (!prefs) {
    return `
PREFERENCJE UZYTKOWNIKA:
- Brak zapisanych preferencji. Uzytkownik moze jesc wszystko, ale warto dopytac o preferencje.
`.trim();
  }

  return `
PREFERENCJE UZYTKOWNIKA (KRYTYCZNE):
- Dieta: ${prefs.diet}
- Alergie (BEZWZGLEDNIE UNIKAJ): ${prefs.allergies.join(", ") || "Brak"}
- Nie lubi: ${prefs.dislikedIngredients.join(", ") || "Brak"}
- Ulubione kuchnie: ${prefs.favCuisines.join(", ") || "Brak"}
- Umiejetnosci: ${prefs.cookingSkill}
- Sprzet: ${prefs.kitchenEquipment.join(", ") || "Standard"}
- Poziom pikantnosci: ${prefs.spiceLevel}/5
`.trim();
}

function buildSystemPrompt(args: {
  mode: "global" | "recipe";
  preferences: PreferencesResponse | null;
  recipeContext?: string;
}): string {
  const preferencesBlock = buildPreferencesBlock(args.preferences);

  const base = `
Jestes "Kuchennym Asystentem" w aplikacji MealGenie.
Twoim celem jest pomaganie w gotowaniu, planowaniu i zakupach.
Mowisz po polsku. Styl: luzny, pomocny, zwiezly. Uzywaj emoji.

FORMATOWANIE (WAZNE):
- Uzywaj Markdown do strukturyzowania wypowiedzi.
- Pogrubiaj kluczowe nazwy skladnikow lub dan (**tekst**).
- Skladniki zawsze wypisuj jako liste punktowana.
- Kroki przepisu wypisuj jako liste numerowana.
- Oddzielaj sekcje pusta linia dla lepszej czytelnosci.

ZASADY:
1. Bezpieczenstwo: Nigdy nie sugeruj skladnikow, na ktore uzytkownik ma alergie.
2. Konkret: Odpowiadaj zwiezle. Nie pisz elaboratow, chyba ze user o to prosi.
3. Jesli uzytkownik pyta o cos niezwiazanego z jedzeniem, grzecznie odmow i wroc do tematu kuchni.

${preferencesBlock}
`.trim();

  if (args.mode === "recipe") {
    return `
${base}

TRYB PRZEPISU:
Uzytkownik przeglada konkretny przepis. Odpowiadaj w jego kontekscie (zamienniki, porady, czas).
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
