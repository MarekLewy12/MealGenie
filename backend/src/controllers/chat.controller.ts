import { type NextFunction, type Request, type Response } from "express";
import { ChatRequestSchema } from "../schemas/chat.schema.js";
import { getPreferences } from "../services/preferences.service.js";
import { generateAssistantReply } from "../services/chat.service.js";

export async function chatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User ID missing");
    }

    const body = ChatRequestSchema.parse(req.body);
    const preferences = await getPreferences(userId);
    const recentMessages = body.messages.slice(-20);

    const reply = await generateAssistantReply({
      mode: body.mode,
      messages: recentMessages,
      preferences,
    });

    res.json({
      message: { role: "assistant", content: reply },
    });
  } catch (error) {
    next(error);
  }
}
