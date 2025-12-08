import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { PrismaClient } from "@prisma/client";
import {
  MealSuggestionsResponseSchema,
  type MealType,
} from "../schemas/meal.schema.js";

const openai = new OpenAI();
const prisma = new PrismaClient();

const mealTypeToPolishLabel: Record<MealType, string> = {
  BREAKFAST: "śniadania",
  LUNCH: "obiady",
  DINNER: "kolacje",
  SNACK: "przekąski",
};

export async function generateMealSuggestions(
  userId: string,
  mealType: MealType,
  prepTime: number,
  servingSize: number,
) {
  const preferences = await prisma.preferences.findUnique({
    where: { userId },
  });

  if (!preferences) {
    throw new Error("User preferences not found");
  }

  const equipmentList =
    preferences.kitchenEquipment.length > 0
      ? preferences.kitchenEquipment.join(", ")
      : "Brak";

  const thermomixContext = preferences.useThermomix
    ? "UŻYTKOWNIK POSIADA THERMOMIX. Preferuj przepisy wykorzystujące to urządzenie, podawaj ustawienia (obroty, temperatura)."
    : "";

  const promptContext = `
    Profil użytkownika:
    - Dieta: ${preferences.diet}
    - Alergie: ${preferences.allergies.join(", ") || "Brak"}
    - Kuchnie: ${preferences.favCuisines.join(", ") || "Brak"}
    - Wykluczenia: ${preferences.dislikedIngredients.join(", ") || "Brak"}
    - Skill: ${preferences.cookingSkill}
    - Sprzęt: ${equipmentList}
    - Budżet: ${preferences.budget}
    
    PARAMETRY TEGO POSIŁKU (Lokalne):
    - Czas: max ${prepTime} minut
    - Liczba porcji: ${servingSize}
    
    SPECJALNE:
    ${thermomixContext}
  `;

  const mealTypeLabel = mealTypeToPolishLabel[mealType];

  const systemMessage = `
    Jesteś profesjonalnym szefem kuchni i dietetykiem w aplikacji MealGenie.
    Twoim zadaniem jest generowanie idealnie dopasowanych propozycji kulinarnych.
    
    Zasady:
    1. Posiłki muszą ściśle przestrzegać diety i wykluczeń (alergii).
    2. Czas przygotowania nie może przekraczać limitu z parametrów generowania.
    3. Uwzględniaj wymaganą liczbę porcji.
    4. Wykorzystuj podany sprzęt kuchenny.
    5. Jeśli dostępny jest Thermomix, preferuj przepisy pod to urządzenie (z ustawieniami obrotów/temperatury).
    6. Opisy mają być po polsku, zachęcające i "smaczne".
    7. Składniki mają być ogólnodostępne w Polsce.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: `Zaproponuj 3 ${mealTypeLabel} dla tego profilu: ${promptContext}`,
      },
    ],
    response_format: zodResponseFormat(
      MealSuggestionsResponseSchema,
      "meal_suggestions",
    ),
  });

  const firstChoice = completion.choices[0];

  if (!firstChoice || !firstChoice.message || !firstChoice.message.content) {
    console.error("OpenAI zwróciło pustą wiadomość:", completion);
    throw new Error("AI returned empty response");
  }

  const content = firstChoice.message.content;

  try {
    const json = JSON.parse(content);
    const parsed = MealSuggestionsResponseSchema.parse(json);
    return parsed.meals;
  } catch (err) {
    console.error("Błąd parsowania odpowiedzi AI:", { content, err });
    throw new Error("Failed to parse AI response");
  }
}
