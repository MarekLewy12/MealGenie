import { PrismaClient } from "@prisma/client";
import type {
  GetHistoryQuery,
  MealHistoryDetail,
  MealHistoryItem,
} from "../schemas/meal.schema.js";

const prisma = new PrismaClient();

export async function getMealHistory(
  userId: string,
  options: GetHistoryQuery,
): Promise<{ items: MealHistoryItem[]; total: number }> {
  const { limit, offset, favoritesOnly } = options;

  // Filtracja zawsze po userId, opcjonalnie po ulubionych.
  const whereClause = {
    userId,
    ...(favoritesOnly ? { isFavorite: true } : {}),
  };

  // Lista + count w jednym przebiegu, bez czekania na drugie zapytanie.
  const [items, total] = await Promise.all([
    prisma.mealHistory.findMany({
      where: whereClause,
      select: {
        // Lista ma byc lekka; fullRecipeJson potrafi byc duzy.
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        estimatedTime: true,
        category: true,
        isFavorite: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.mealHistory.count({ where: whereClause }),
  ]);

  const mappedItems: MealHistoryItem[] = items.map((item) => ({
    ...item,
    // API wystawia ISO string, Prisma zwraca Date.
    createdAt: item.createdAt.toISOString(),
  }));

  return { items: mappedItems, total };
}

export async function getMealById(
  userId: string,
  mealId: string,
): Promise<MealHistoryDetail | null> {
  const meal = await prisma.mealHistory.findFirst({
    where: {
      id: mealId,
      userId,
    },
  });

  if (!meal) {
    return null;
  }

  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    imageUrl: meal.imageUrl,
    estimatedTime: meal.estimatedTime,
    category: meal.category,
    isFavorite: meal.isFavorite,
    createdAt: meal.createdAt.toISOString(),
    fullRecipeJson: meal.fullRecipeJson,
    ingredients: meal.ingredients,
    rating: meal.rating,
  };
}

export async function toggleFavorite(
  userId: string,
  mealId: string,
): Promise<{ isFavorite: boolean } | null> {
  const existing = await prisma.mealHistory.findFirst({
    where: { id: mealId, userId },
    select: { isFavorite: true },
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.mealHistory.update({
    where: { id: mealId },
    // Prosty toggle na bazie aktualnego stanu.
    data: { isFavorite: !existing.isFavorite },
    select: { isFavorite: true },
  });

  return { isFavorite: updated.isFavorite };
}

export async function deleteMealHistory(
  userId: string,
  mealId: string,
): Promise<boolean> {
  const result = await prisma.mealHistory.deleteMany({
    where: { id: mealId, userId },
  });

  return result.count > 0;
}
