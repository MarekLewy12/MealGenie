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

  const whereClause = {
    userId,
    ...(favoritesOnly ? { isFavorite: true } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.mealHistory.findMany({
      where: whereClause,
      select: {
        // Keep list payload small; fullRecipeJson can be large.
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
    data: { isFavorite: !existing.isFavorite },
    select: { isFavorite: true },
  });

  return { isFavorite: updated.isFavorite };
}
