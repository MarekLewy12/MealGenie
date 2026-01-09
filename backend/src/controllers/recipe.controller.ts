import { type Request, type Response, type NextFunction } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { GenerateRecipeRequestSchema } from "../schemas/recipe.schema.js";
import { generateFullRecipe } from "../services/recipe.service.js";

const prisma = new PrismaClient();

async function removeUnusedImages(imageUrls?: string[]) {
  if (!imageUrls?.length) return;

  const imageDir = path.join(process.cwd(), "public", "meal-images");
  const candidates = imageUrls
    .filter((url) => typeof url === "string" && url.startsWith("/meal-images/"))
    .map((url) => path.basename(url))
    .filter((fileName) => fileName.endsWith(".jpg"));

  if (candidates.length === 0) return;

  await Promise.all(
    candidates.map(async (fileName) => {
      const filePath = path.join(imageDir, fileName);
      try {
        await fs.unlink(filePath);
        console.log("[CLEANUP] Usunieto nieuzywany obrazek:", fileName);
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code !== "ENOENT") {
          console.error("[CLEANUP] Blad usuwania obrazka:", fileName, err);
        }
      }
    }),
  );
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

    const { mealTeaser, servings, unusedImageUrls } =
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

    const recipe = await generateFullRecipe({
      teaser: mealTeaser,
      servings,
      userPreferences: {
        diet: preferences.diet,
        allergies: preferences.allergies,
        cookingSkill: preferences.cookingSkill,
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

    await removeUnusedImages(unusedImageUrls);

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
