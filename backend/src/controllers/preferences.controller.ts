import {
  BudgetLevel,
  CookingSkill,
  Diet,
  KitchenEquipment,
} from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import {
  savePreferences,
  type SavePreferencesInput,
} from "../services/preferences.service.js";

export const savePreferencesSchema = z.object({
  diet: z.nativeEnum(Diet),
  allergies: z.array(z.string()),
  favCuisines: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  cookingSkill: z.nativeEnum(CookingSkill),
  prepTimePreference: z.number().int().nonnegative(),
  kitchenEquipment: z.array(z.nativeEnum(KitchenEquipment)),
  budget: z.nativeEnum(BudgetLevel),
  servingSize: z.number().int().min(1),
});

export async function savePreferencesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bodyData = savePreferencesSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error("User ID missing in request context");
    }

    const input: SavePreferencesInput = {
      ...bodyData,
      userId: userId,
    };
    const preferences = await savePreferences(input);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
}
