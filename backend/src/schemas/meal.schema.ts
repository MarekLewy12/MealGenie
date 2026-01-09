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

export type EquipmentInput = Equipment | "THERMOMIX";

const allowedEquipmentInputs = new Set<string>([
  ...Object.values(Equipment),
  "THERMOMIX",
]);

export const EquipmentInputSchema = z.custom<EquipmentInput>(
  (value) => typeof value === "string" && allowedEquipmentInputs.has(value),
  { message: "Nieznany sprzęt" },
);

export const SuggestMealsRequestSchema = z.object({
  userPrompt: z
    .string()
    .max(500, "Opis jest zbyt długi (max 500 znaków)")
    .optional(),

  availableIngredients: z
    .array(z.string())
    .optional()
    .transform((arr) => arr?.map((s) => s.trim()).filter(Boolean) || []),

  useEquipment: z.array(EquipmentInputSchema).optional(),

  // Standardowe parametry
  mealType: MealTypeSchema.default("ANY"),
  prepTime: z.number().min(5).max(180).optional(),
  servingSize: z.number().min(1).max(10).optional(),
  targetWeightGrams: z.number().min(50).max(5000).optional(),
});

export type SuggestMealsRequest = z.infer<typeof SuggestMealsRequestSchema>;

export const MealTeaserSchema = z.object({
  name: z.string().describe("Nazwa dania, kreatywna i zachęcająca"),
  description: z
    .string()
    .describe("Krótki opis marketingowy (1-2 zdania)"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Poziom trudności"),
  cookingTimeMinutes: z
    .number()
    .int()
    .describe("Całkowity czas w minutach"),
  calories: z.number().int().describe("Szacunkowa liczba kalorii na porcję"),
  imagePromptEn: z
    .string()
    .max(300, "Prompt EN jest zbyt długi (max 300 znaków)")
    .describe(
      "Krótki prompt po angielsku do generatora obrazów, z kluczowymi składnikami i stylem zdjęcia",
    ),

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
    .describe("3-4 główne kroki przygotowania"),
});

export const MealSuggestionsResponseSchema = z.object({
  meals: z
    .array(MealTeaserSchema)
    .length(3)
    .describe("Lista dokładnie 3 propozycji posiłków"),
});

export type MealTeaser = z.infer<typeof MealTeaserSchema>;
export type MealSuggestionsResponse = z.infer<
  typeof MealSuggestionsResponseSchema
>;
export type MealType = z.infer<typeof MealTypeSchema>;

export type MealWithImage = MealTeaser & {
  imageUrl: string | null;
};

export const MealIdParamSchema = z.object({
  id: z.string().uuid("Nieprawidłowy format ID przepisu"),
});

export const GetHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  favoritesOnly: z.coerce.boolean().default(false),
});

export const MealHistoryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  estimatedTime: z.number().nullable(),
  category: MealTypeSchema.nullable(),
  isFavorite: z.boolean(),
  createdAt: z.string().datetime(),
});

export const MealHistoryDetailSchema = MealHistoryItemSchema.extend({
  fullRecipeJson: z.any().nullable(),
  ingredients: z.array(z.string()),
  rating: z.number().nullable(),
});

export type MealIdParam = z.infer<typeof MealIdParamSchema>;
export type GetHistoryQuery = z.infer<typeof GetHistoryQuerySchema>;
export type MealHistoryItem = z.infer<typeof MealHistoryItemSchema>;
export type MealHistoryDetail = z.infer<typeof MealHistoryDetailSchema>;
