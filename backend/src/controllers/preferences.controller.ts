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
  userId: z.string().uuid(),
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
    const body = savePreferencesSchema.parse(req.body) as SavePreferencesInput;
    const preferences = await savePreferences(body);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
}
