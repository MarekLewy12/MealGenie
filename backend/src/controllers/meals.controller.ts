import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateMealSuggestions } from "../services/ai.service.js";

export const suggestMealsSchema = z.object({
  userId: z.string().uuid(),
  // temporaryFilters: ... (opcjonalnie w v1.1)
});

export async function suggestMealsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = suggestMealsSchema.parse(req.body);

    const meals = await generateMealSuggestions(userId);

    res.json({ meals });
  } catch (error) {
    next(error);
  }
}
