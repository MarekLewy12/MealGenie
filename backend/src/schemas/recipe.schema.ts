import { z } from "zod";

export const MealTeaserInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  cookingTimeMinutes: z.number(),
  calories: z.number().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
    }),
  ),
  stepsSummary: z.array(z.string()),
  imagePromptEn: z.string().max(300).optional(),
  imageUrl: z.string().nullable().optional(),
});

export const RecipeGenerationContextSchema = z.object({
  portionMode: z.enum(["servings", "weight"]),
  servingSize: z.number().int().min(1).max(12).optional(),
  targetWeightGrams: z.number().min(50).max(5000).optional(),
  hungerLevel: z.number().int().min(1).max(5).optional(),
});

export const GenerateRecipeRequestSchema = z.object({
  mealTeaser: MealTeaserInputSchema,
  servings: z.number().int().min(1).max(12).default(2),
  unusedImageUrls: z.array(z.string()).optional(),
  recipeContext: RecipeGenerationContextSchema.optional(),
});

export type GenerateRecipeRequest = z.infer<typeof GenerateRecipeRequestSchema>;
export type MealTeaserInput = z.infer<typeof MealTeaserInputSchema>;
export type RecipeGenerationContext = z.infer<
  typeof RecipeGenerationContextSchema
>;

export const FullRecipeIngredientSchema = z.object({
  name: z.string().describe("Nazwa składnika"),
  amount: z.string().describe("Ilość, np. '200' lub '2-3'"),
  unit: z.string().describe("Jednostka: g, ml, szt., łyżki, szklanki"),
  category: z
    .string()
    .describe("Kategoria: Mięso, Warzywa, Nabiał, Przyprawy, Inne"),
  notes: z
    .string()
    .nullable()
    .describe("Notatka, np. 'pokrojone w kostke'"),
});

export const RecipeStepSchema = z.object({
  stepNumber: z.number().int().describe("Numer kroku"),
  title: z.string().describe("Krotki tytul kroku, np. 'Przygotowanie warzyw'"),
  instruction: z.string().describe("Szczegolowa instrukcja tego kroku"),
  duration: z.string().nullable().describe("Czas trwania, np. '5 minut'"),
  tip: z.string().nullable().describe("Opcjonalna wskazówka do tego kroku"),
});

export const NutritionSchema = z.object({
  calories: z.number().int().describe("Kalorie na porcje"),
  protein: z.number().int().describe("Białko w gramach"),
  carbs: z.number().int().describe("Węglowodany w gramach"),
  fat: z.number().int().describe("Tłuszcze w gramach"),
  fiber: z.number().int().nullable().describe("Błonnik w gramach"),
});

export const FullRecipeSchema = z.object({
  name: z.string().describe("Nazwa dania"),
  description: z.string().describe("Apetyczny opis dania (2-3 zdania)"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Poziom trudności"),
  prepTimeMinutes: z.number().int().describe("Czas przygotowania składników"),
  cookTimeMinutes: z.number().int().describe("Czas gotowania/pieczenia"),
  totalTimeMinutes: z.number().int().describe("Całkowity czas"),
  servings: z.number().int().describe("Liczba porcji"),
  ingredients: z
    .array(FullRecipeIngredientSchema)
    .describe("Lista wszystkich składników z kategoriami"),
  steps: z
    .array(RecipeStepSchema)
    .min(6)
    .max(15)
    .describe("Szczegolowe kroki przygotowania (8-12 krokow)"),
  nutrition: NutritionSchema.describe("Wartości odżywcze na porcję"),
  tips: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("Wskazowki szefa kuchni"),
  servingSuggestion: z
    .string()
    .nullable()
    .describe("Sugestia podania dania"),
  storageInfo: z
    .string()
    .nullable()
    .describe("Jak przechowywać pozostałości"),
});

export type FullRecipe = z.infer<typeof FullRecipeSchema> & {
  generationContext?: RecipeGenerationContext;
};
export type FullRecipeIngredient = z.infer<typeof FullRecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type Nutrition = z.infer<typeof NutritionSchema>;
