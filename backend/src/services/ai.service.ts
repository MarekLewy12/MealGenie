import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  MealSuggestionsResponseSchema,
  type MealTeaser,
  type MealWithImage,
  type MealType,
  type EquipmentInput,
} from "../schemas/meal.schema.js";
import { Diet, CookingSkill, Budget } from "@prisma/client";
import { generateMealImages } from "./image.service.js";

const openai = new OpenAI();

interface GenerationContext {
  userPrompt: string | null;
  availableIngredients: string[];
  mealType: MealType;
  prepTime: number;
  servingSize: number;
  equipment: EquipmentInput[];
  diet: Diet;
  allergies: string[];
  dislikedIngredients: string[];
  favoriteCuisines: string[];
  cookingSkill: CookingSkill;
  budget: Budget;
}

const mealTypeToPolish: Record<string, string> = {
  BREAKFAST: "śniadanie",
  LUNCH: "obiad/lunch",
  DINNER: "kolacja",
  SNACK: "przekąska",
  DESSERT: "deser",
  ANY: "dowolny posiłek",
};

export async function generateMealSuggestions(
  context: GenerationContext,
): Promise<MealWithImage[]> {
  // Budowanie opisu sprzętu
  const equipmentList =
    context.equipment.length > 0
      ? context.equipment.join(", ")
      : "Standardowe wyposażenie (garnki, patelnia, piekarnik)";

  const hasThermomix = context.equipment.includes("THERMOMIX");
  const thermomixNote = hasThermomix
    ? `
      🔥 TRYB THERMOMIX AKTYWNY:
      1. Przepisy MUSZĄ wykorzystywać Thermomix do głównych czynności (siekanie, gotowanie sosów, wyrabianie ciasta).
      2. Podawaj konkretne ustawienia: "Czas: 10min, Temp: Varoma, Obroty: 2".
      3. Bądź pragmatyczny: Jeśli coś lepiej zrobić na patelni (np. smażenie steka) lub w piekarniku, napisz to.
      Przykład: "Sos przygotuj w TM, ale mięso usmaż na patelni dla lepszego smaku".
      `
    : "Nie używaj instrukcji dla Thermomixa.";

  // Budowanie promptu z kontekstu
  const promptContext = `
    DANE UŻYTKOWNIKA:
    - Dieta: ${context.diet}
    - Alergie (BEZWZGLĘDNIE UNIKAJ): ${context.allergies.join(", ") || "Brak"}
    - Wykluczenia (nie lubi): ${context.dislikedIngredients.join(", ") || "Brak"}
    - Umiejętności: ${context.cookingSkill}
    - Budżet: ${context.budget}
    - Dostępny sprzęt: ${equipmentList}
    
    PARAMETRY TEGO POSIŁKU:
    - Typ: ${mealTypeToPolish[context.mealType] || "Dowolny"}
    - Czas przygotowania: max ${context.prepTime} minut
    - Liczba porcji: ${context.servingSize}
    
    INTENT UŻYTKOWNIKA (Najważniejsze!):
    ${
      context.userPrompt
        ? `👉 Użytkownik napisał: "${context.userPrompt}". Dopasuj propozycje do tego życzenia.`
        : "Brak specyficznego życzenia - zaproponuj coś zbalansowanego."
    }
    
    ${
      context.availableIngredients.length > 0
        ? `🥕 UŻYTKOWNIK MA W LODÓWCE: ${context.availableIngredients.join(", ")}. Postaraj się wykorzystać te składniki w przepisach.`
        : ""
    }

    ${thermomixNote}
  `;

  const systemMessage = `
    Jesteś profesjonalnym szefem kuchni w aplikacji MealGenie.
    Tworzysz dokładnie 3 propozycje posiłków.
    
    Zasady:
    1. Bezpieczeństwo: Absolutnie żadnych alergenów z listy.
    2. Czas: Musi być realny do wykonania w ${context.prepTime} minut.
    3. Język: Polski. Opisy mają być smaczne i zachęcające.
    4. Składniki: Dostępne w polskich sklepach (Biedronka, Lidl).
    5. Jeśli użytkownik podał składniki, które ma w lodówce -> priorytetowo je wykorzystaj.
  `;

  console.log("Generowanie AI dla kontekstu:", {
    type: context.mealType,
    prompt: context.userPrompt,
    ingredients: context.availableIngredients,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: `Zaproponuj 3 posiłki na podstawie tego profilu:\n${promptContext}`,
      },
    ],
    response_format: zodResponseFormat(
      MealSuggestionsResponseSchema,
      "meal_suggestions",
    ),
  });

  const firstChoice = completion.choices[0];

  if (!firstChoice?.message?.content) {
    throw new Error("AI returned empty response");
  }

  try {
    const json = JSON.parse(firstChoice.message.content);
    // Walidacja odpowiedzi AI przez Zod
    const parsed = MealSuggestionsResponseSchema.parse(json);
    const teasers: MealTeaser[] = parsed.meals;

    console.log("[AI] Generating images...");
    const imageUrls = await generateMealImages(teasers);

    const mealsWithImages: MealWithImage[] = teasers.map((meal, index) => ({
      ...meal,
      imageUrl: imageUrls[index] ?? null,
    }));

    return mealsWithImages;
  } catch (err) {
    console.error("Błąd parsowania AI:", err);
    throw new Error("Failed to parse AI response");
  }
}
