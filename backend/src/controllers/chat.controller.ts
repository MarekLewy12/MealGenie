import { type NextFunction, type Request, type Response } from "express";
import { ChatRequestSchema } from "../schemas/chat.schema.js";
import { getPreferences } from "../services/preferences.service.js";
import {
  buildRecipeContext,
  generateAssistantReply,
} from "../services/chat.service.js";
import { getMealById } from "../services/history.service.js";

export async function chatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const body = ChatRequestSchema.parse(req.body);
    const preferences = await getPreferences(userId);
    const recentMessages = body.messages.slice(-20);
    let recipeContext: string | undefined;

    if (body.mode === "recipe") {
      const meal = await getMealById(userId, body.recipeId);

      if (!meal) {
        return res.status(404).json({
          error: "Przepis nie został znaleziony",
          code: "MEAL_NOT_FOUND",
        });
      }

      recipeContext = buildRecipeContext(meal);
    }

    const reply = await generateAssistantReply({
      mode: body.mode,
      messages: recentMessages,
      preferences,
      recipeContext,
    });

    res.json({
      message: { role: "assistant", content: reply },
    });
  } catch (error) {
    next(error);
  }
}
