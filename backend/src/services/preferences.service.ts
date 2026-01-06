import {
  type Budget,
  type CookingSkill,
  type Diet,
  type Equipment,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

export type SavePreferencesInput = {
  userId: string;
  diet: Diet;
  allergies: string[];
  favCuisines: string[];
  dislikedIngredients: string[];
  cookingSkill: CookingSkill;
  kitchenEquipment: Equipment[];
  budget: Budget;
  useThermomix: boolean;
};

export async function savePreferences(input: SavePreferencesInput) {
  const { userId, ...preferencesData } = input;

  return prisma.preferences.upsert({
    where: { userId },
    update: preferencesData,
    create: {
      ...preferencesData,
      userId,
    },
  });
}

export async function getPreferences(userId: string) {
  return prisma.preferences.findUnique({
    where: { userId },
  });
}
