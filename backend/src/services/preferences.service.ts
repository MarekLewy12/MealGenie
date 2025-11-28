import {
  PrismaClient,
  type BudgetLevel,
  type CookingSkill,
  type Diet,
  type KitchenEquipment,
} from '@prisma/client';

const prisma = new PrismaClient();

export type SavePreferencesInput = {
  userId: string;
  diet: Diet;
  allergies: string[];
  favCuisines: string[];
  dislikedIngredients: string[];
  cookingSkill: CookingSkill;
  prepTimePreference: number;
  kitchenEquipment: KitchenEquipment[];
  budget: BudgetLevel;
  servingSize: number;
};

export async function savePreferences(input: SavePreferencesInput) {
  const { userId, ...preferencesData } = input;

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      // Tymczasowy adres, by spełnić unikalny constraint email w środowisku dev.
      email: `${userId}@placeholder.local`,
      status: 'ACTIVE',
      // Wymagane przez nowy model użytkownika (Email+Hasło).
      passwordHash: 'DEV_PLACEHOLDER_PASSWORD_HASH',
    },
  });

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
