import { type Request, type Response, type NextFunction } from "express";
import { getIngredientSuggestions } from "../services/ingredients.service.js";

export function ingredientSuggestionsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const suggestions = getIngredientSuggestions();
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
}
