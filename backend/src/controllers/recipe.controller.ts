import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { GenerateRecipeRequestSchema } from "../schemas/recipe.schema.js";
import { generateFullRecipe } from "../services/recipe.service.js";

const prisma = new PrismaClient();

type RecipeGenerator = typeof generateFullRecipe;
let recipeGenerator: RecipeGenerator = generateFullRecipe;

export function setRecipeGeneratorForTests(generator?: RecipeGenerator) {
  recipeGenerator = generator ?? generateFullRecipe;
}

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

    const { mealTeaser, servings, recipeContext } =
      GenerateRecipeRequestSchema.parse(req.body);

    const preferences = await prisma.preference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return res.status(400).json({
        error: "Brak preferencji. Uzupelnij onboarding.",
        code: "NO_PREFERENCES",
      });
    }

    const recipe = await recipeGenerator({
      teaser: mealTeaser,
      servings,
      recipeContext,
      userPreferences: {
        diet: preferences.diet,
        allergies: preferences.allergies,
        cookingSkill: preferences.cookingSkill,
        spiceLevel: preferences.spiceLevel,
      },
    });

    // Zapis pelnego przepisu do historii, lacznie z JSON-em i obrazkiem.
    const savedMeal = await prisma.mealHistory.create({
      data: {
        userId,
        name: recipe.name,
        description: recipe.description,
        // Uproszczona lista skladnikow do widoku listy.
        ingredients: recipe.ingredients.map(
          (i) => `${i.amount} ${i.unit} ${i.name}`,
        ),
        estimatedTime: recipe.totalTimeMinutes,
        category: "LUNCH",
        userPrompt: null,
        imageUrl: mealTeaser.imageUrl ?? null,
        fullRecipeJson: recipe,
        isFavorite: false,
        wasSelected: true,
        selectedAt: new Date(),
      },
    });

    res.json({
      recipe: {
        ...recipe,
        imageUrl: mealTeaser.imageUrl || null,
      },
      mealHistoryId: savedMeal.id,
    });
  } catch (error) {
    next(error);
  }
}
