import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { GenerateRecipeRequestSchema } from "../schemas/recipe.schema.js";
import { generateFullRecipe } from "../services/recipe.service.js";

const prisma = new PrismaClient();

export async function generateRecipeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User ID missing in request context");
    }

    const { mealTeaser, servings } = GenerateRecipeRequestSchema.parse(req.body);

    const preferences = await prisma.preference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return res.status(400).json({
        error: "Brak preferencji. Uzupelnij onboarding.",
        code: "NO_PREFERENCES",
      });
    }

    const recipe = await generateFullRecipe({
      teaser: mealTeaser,
      servings,
      userPreferences: {
        diet: preferences.diet,
        allergies: preferences.allergies,
        cookingSkill: preferences.cookingSkill,
      },
    });

    await prisma.mealHistory.create({
      data: {
        userId,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients.map((i) => i.name),
        estimatedTime: recipe.totalTimeMinutes,
        category: "LUNCH",
        userPrompt: null,
        wasSelected: true,
        selectedAt: new Date(),
      },
    });

    res.json({
      recipe: {
        ...recipe,
        imageUrl: mealTeaser.imageUrl || null,
      },
    });
  } catch (error) {
    next(error);
  }
}
