import { Budget, CookingSkill, Diet } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import {
  GuestSuggestMealsRequestSchema,
  type EquipmentInput,
} from "../schemas/meal.schema.js";
import { generateMealSuggestions } from "../services/ai.service.js";
import {
  createGuestFingerprintHash,
  getGuestRateLimitStatus,
  markGuestGeneration,
} from "../services/guest-generation.service.js";

function getUserAgent(header: string | string[] | undefined): string | null {
  if (Array.isArray(header)) {
    return header[0] ?? null;
  }

  return header ?? null;
}

export async function guestSuggestController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = GuestSuggestMealsRequestSchema.parse(req.body);
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = getUserAgent(req.headers["user-agent"]);
    const fingerprintHash = createGuestFingerprintHash({
      ip: clientIp,
      userAgent,
    });

    const rateLimitStatus = await getGuestRateLimitStatus(fingerprintHash);
    if (rateLimitStatus.isLimited) {
      res.set("Retry-After", String(rateLimitStatus.retryAfterSeconds));
      return res.status(429).json({
        error: "GUEST_LIMIT_REACHED",
        message:
          "Wykorzystałeś/aś darmową probę. Załóż konto, aby generować dalej.",
        retryAfterSeconds: rateLimitStatus.retryAfterSeconds,
      });
    }

    const context = {
      userPrompt: null,
      availableIngredients: [],
      mealType: input.mealType,
      prepTime: input.prepTime,
      servingSize: 2,
      equipment: [] as EquipmentInput[],
      diet: Diet.NONE,
      allergies: [],
      dislikedIngredients: [],
      favoriteCuisines: [],
      cookingSkill: CookingSkill.BEGINNER,
      budget: Budget.MEDIUM,
      spiceLevel: 3,
    };

    const meals = await generateMealSuggestions(context);
    await markGuestGeneration(fingerprintHash);

    return res.json({ meals });
  } catch (error) {
    return next(error);
  }
}
