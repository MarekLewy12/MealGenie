import { type NextFunction, type Request, type Response } from "express";
import {
  MealIdParamSchema,
  ShareIdParamSchema,
} from "../schemas/meal.schema.js";
import {
  getSharedMeal,
  toggleShareLink,
} from "../services/history.service.js";

export async function toggleShareController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const { id } = MealIdParamSchema.parse(req.params);
    const result = await toggleShareLink(userId, id);

    if (!result) {
      return res.status(404).json({
        error: "Przepis nie został znaleziony",
        code: "MEAL_NOT_FOUND",
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSharedMealController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shareId } = ShareIdParamSchema.parse(req.params);
    const meal = await getSharedMeal(shareId);

    if (!meal) {
      return res.status(404).json({
        error: "Udostępniony przepis nie został znaleziony",
        code: "SHARED_MEAL_NOT_FOUND",
      });
    }

    res.json(meal);
  } catch (error) {
    next(error);
  }
}
