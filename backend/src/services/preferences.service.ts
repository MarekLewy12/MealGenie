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
  spiceLevel: number;
};

export type PreferencesResponse = Omit<SavePreferencesInput, "userId">;

export async function savePreferences(input: SavePreferencesInput) {
  const { userId, favCuisines, kitchenEquipment, ...preferencesData } = input;
  const dbData = {
    ...preferencesData,
    favoriteCuisines: favCuisines,
    equipment: kitchenEquipment,
  };

  return prisma.preference.upsert({
    where: { userId },
    update: dbData,
    create: {
      ...dbData,
      userId,
    },
  });
}

export async function getPreferences(
  userId: string,
): Promise<PreferencesResponse | null> {
  const preferences = await prisma.preference.findUnique({
    where: { userId },
  });

  if (!preferences) {
    return null;
  }

  return {
    diet: preferences.diet,
    allergies: preferences.allergies,
    favCuisines: preferences.favoriteCuisines,
    dislikedIngredients: preferences.dislikedIngredients,
    cookingSkill: preferences.cookingSkill,
    kitchenEquipment: preferences.equipment,
    budget: preferences.budget,
    spiceLevel: preferences.spiceLevel,
  };
}
