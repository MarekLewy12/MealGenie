import { type Request, type Response, type NextFunction } from "express";
import {
  MealIdParamSchema,
  GetHistoryQuerySchema,
} from "../schemas/meal.schema.js";
import {
  getMealHistory,
  getMealById,
  toggleFavorite,
} from "../services/history.service.js";

export async function getMealHistoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const query = GetHistoryQuerySchema.parse(req.query);
    const result = await getMealHistory(userId, query);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMealByIdController(
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
    const meal = await getMealById(userId, id);

    if (!meal) {
      return res.status(404).json({
        error: "Przepis nie został znaleziony",
        code: "MEAL_NOT_FOUND",
      });
    }

    res.json(meal);
  } catch (error) {
    next(error);
  }
}

export async function toggleFavoriteController(
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
    const result = await toggleFavorite(userId, id);

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
