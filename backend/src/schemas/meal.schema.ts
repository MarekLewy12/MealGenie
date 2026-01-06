import { z } from "zod";
import { Equipment } from "@prisma/client";

export const MealTypeSchema = z.enum([
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
  "DESSERT",
  "ANY",
]);

export const SuggestMealsRequestSchema = z.object({
  userPrompt: z
    .string()
    .max(500, "Opis jest zbyt długi (max 500 znaków)")
    .optional(),

  availableIngredients: z
    .array(z.string())
    .optional()
    .transform((arr) => arr?.map((s) => s.trim()).filter(Boolean) || []),

  useEquipment: z.array(z.nativeEnum(Equipment)).optional(),

  // Standardowe parametry
  mealType: MealTypeSchema.default("ANY"),
  prepTime: z.number().min(5).max(180).optional(),
  servingSize: z.number().min(1).max(10).optional(),
});

export type SuggestMealsRequest = z.infer<typeof SuggestMealsRequestSchema>;

export const MealTeaserSchema = z.object({
  name: z.string().describe("Nazwa dania, kreatywna i zachęcająca"),
  description: z
    .string()
    .describe("Krótki opis marketingowy (1-2 zdania), dlaczego warto to zjeść"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Poziom trudności"),
  cookingTimeMinutes: z
    .number()
    .int()
    .describe("Całkowity czas przygotowania w minutach"),
  calories: z.number().int().describe("Szacunkowa liczba kalorii na porcję"),

  ingredients: z
    .array(
      z.object({
        name: z.string().describe("Nazwa produktu"),
        amount: z.string().describe("Ilość"),
      }),
    )
    .describe("Lista głównych składników"),

  stepsSummary: z
    .array(z.string())
    .describe("3-4 główne kroki przygotowania (skrót)"),
});

export const MealSuggestionsResponseSchema = z.object({
  meals: z
    .array(MealTeaserSchema)
    .length(3)
    .describe("Lista dokładnie 3 propozycji posiłków"),
});

export type MealSuggestionsResponse = z.infer<
  typeof MealSuggestionsResponseSchema
>;
export type MealType = z.infer<typeof MealTypeSchema>;
