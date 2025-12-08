import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateMealSuggestions } from "../services/ai.service.js";
import { MealTypeSchema } from "../schemas/meal.schema.js";

export const suggestMealsSchema = z.object({
  mealType: MealTypeSchema,
  prepTime: z.number().min(5).max(180),
  servingSize: z.number().min(1).max(10),
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

    const { mealType, prepTime, servingSize } = suggestMealsSchema.parse(
      req.body,
    );

    const meals = await generateMealSuggestions(
      userId,
      mealType,
      prepTime,
      servingSize,
    );

    res.json({ meals });
  } catch (error) {
    next(error);
  }
}
