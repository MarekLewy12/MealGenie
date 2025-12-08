import {
  PrismaClient,
  type BudgetLevel,
  type CookingSkill,
  type Diet,
  type KitchenEquipment,
} from "@prisma/client";

const prisma = new PrismaClient();

export type SavePreferencesInput = {
  userId: string;
  diet: Diet;
  allergies: string[];
  favCuisines: string[];
  dislikedIngredients: string[];
  cookingSkill: CookingSkill;
  kitchenEquipment: KitchenEquipment[];
  budget: BudgetLevel;
  useThermomix: boolean;
};

export async function savePreferences(input: SavePreferencesInput) {
  const { userId, ...preferencesData } = input;

  const preferences = await prisma.preferences.upsert({
    where: { userId },
    update: preferencesData,
    create: {
      ...preferencesData,
      userId,
    },
  });

  return preferences;
}
