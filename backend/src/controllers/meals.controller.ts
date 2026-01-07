import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { SuggestMealsRequestSchema } from "../schemas/meal.schema.js";
import { generateMealSuggestions } from "../services/ai.service.js";

const prisma = new PrismaClient();

export async function suggestMealsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User ID missing in request context");
    }

    //Walidacja danych wejściowych (Zod)
    const input = SuggestMealsRequestSchema.parse(req.body);

    // Pobranie preferencji z bazy
    const preferences = await prisma.preference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Jeśli user nie ma preferencji
      return res.status(400).json({
        error: "Brak preferencji. Uzupełnij onboarding.",
        code: "NO_PREFERENCES",
      });
    }

    const finalEquipment = [...preferences.equipment];
    if (input.useEquipment?.includes("THERMOMIX")) {
      if (!finalEquipment.includes("THERMOMIX")) {
        finalEquipment.push("THERMOMIX");
      }
    }

    // Dane z inputu (Lokalne) > Dane z bazy (Globalne) > Wartości domyślne
    const context = {
      // --- Dane z formularza (priorytet) ---
      userPrompt: input.userPrompt || null,
      availableIngredients: input.availableIngredients || [],
      mealType: input.mealType,

      // --- Parametry (Input -> Baza -> Default) ---
      prepTime: input.prepTime ?? preferences.defaultMaxTime ?? 30,
      servingSize: input.servingSize ?? preferences.defaultServings ?? 2,

      // --- Sprzęt (Input -> Baza) ---
      equipment: finalEquipment,

      // --- Stałe preferencje z bazy ---
      diet: preferences.diet,
      allergies: preferences.allergies,
      dislikedIngredients: preferences.dislikedIngredients,
      favoriteCuisines: preferences.favoriteCuisines,
      cookingSkill: preferences.cookingSkill,
      budget: preferences.budget,
    };

    // Wywołanie serwisu AI z kontekstem
    const meals = await generateMealSuggestions(context);

    res.json({ meals });
  } catch (error) {
    next(error);
  }
}
