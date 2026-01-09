import {
  Budget,
  CookingSkill,
  Diet,
  Equipment,
} from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import {
  savePreferences,
  getPreferences,
  type SavePreferencesInput,
} from "../services/preferences.service.js";

export const savePreferencesSchema = z.object({
  diet: z.nativeEnum(Diet),
  allergies: z.array(z.string()),
  favCuisines: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  cookingSkill: z.nativeEnum(CookingSkill),
  kitchenEquipment: z.array(z.nativeEnum(Equipment)),
  budget: z.nativeEnum(Budget),
  spiceLevel: z.number().int().min(1).max(5).default(3),
});

export async function savePreferencesController(
  // zapisywanie preferencji użytkownika
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Walidacja danych wejściowych
    const bodyData = savePreferencesSchema.parse(req.body);

    // Pobranie userId z kontekstu requestu (middleware auth)
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error("User ID missing in request context");
    }

    // Przygotowanie danych do zapisu
    const input: SavePreferencesInput = {
      ...bodyData,
      userId: userId,
    };
    const preferences = await savePreferences(input); // Zapis preferencji poprzez serwis
    res.json(preferences); // Odpowiedź z zapisanymi preferencjami
  } catch (error) {
    next(error);
  }
}

export async function getPreferencesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Pobranie userId z kontekstu requestu
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User ID missing");
    }

    // Pobranie preferencji poprzez serwis
    const preferences = await getPreferences(userId);

    // Zwrócenie preferencji w odpowiedzi
    res.json(preferences);
  } catch (error) {
    next(error);
  }
}
