import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateMealSuggestions } from "../services/ai.service.js";
import { MealTypeSchema } from "../schemas/meal.schema.js";

export const suggestMealsSchema = z.object({
  mealType: MealTypeSchema,
});

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

    const { mealType } = suggestMealsSchema.parse(req.body);

    const meals = await generateMealSuggestions(userId, mealType);

    res.json({ meals });
  } catch (error) {
    next(error);
  }
}
