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
  imageUrl: z.string().nullable().optional(),
});

export const GenerateRecipeRequestSchema = z.object({
  mealTeaser: MealTeaserInputSchema,
  servings: z.number().int().min(1).max(12).default(2),
});

export type GenerateRecipeRequest = z.infer<typeof GenerateRecipeRequestSchema>;
export type MealTeaserInput = z.infer<typeof MealTeaserInputSchema>;

export const FullRecipeIngredientSchema = z.object({
  name: z.string().describe("Nazwa skladnika"),
  amount: z.string().describe("Ilosc, np. '200' lub '2-3'"),
  unit: z.string().describe("Jednostka: g, ml, szt., lyzki, szklanki"),
  category: z
    .string()
    .describe("Kategoria: Mieso, Warzywa, Nabial, Przyprawy, Inne"),
  notes: z.string().optional().describe("Notatka, np. 'pokrojone w kostke'"),
});

export const RecipeStepSchema = z.object({
  stepNumber: z.number().int().describe("Numer kroku"),
  title: z.string().describe("Krotki tytul kroku, np. 'Przygotowanie warzyw'"),
  instruction: z.string().describe("Szczegolowa instrukcja tego kroku"),
  duration: z.string().optional().describe("Czas trwania, np. '5 minut'"),
  tip: z.string().optional().describe("Opcjonalna wskazowka do tego kroku"),
});

export const NutritionSchema = z.object({
  calories: z.number().int().describe("Kalorie na porcje"),
  protein: z.number().int().describe("Bialko w gramach"),
  carbs: z.number().int().describe("Weglowodany w gramach"),
  fat: z.number().int().describe("Tluszcze w gramach"),
  fiber: z.number().int().optional().describe("Blonnik w gramach"),
});

export const FullRecipeSchema = z.object({
  name: z.string().describe("Nazwa dania"),
  description: z.string().describe("Apetyczny opis dania (2-3 zdania)"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Poziom trudnosci"),
  prepTimeMinutes: z.number().int().describe("Czas przygotowania skladnikow"),
  cookTimeMinutes: z.number().int().describe("Czas gotowania/pieczenia"),
  totalTimeMinutes: z.number().int().describe("Calkowity czas"),
  servings: z.number().int().describe("Liczba porcji"),
  ingredients: z
    .array(FullRecipeIngredientSchema)
    .describe("Lista wszystkich skladnikow z kategoriami"),
  steps: z
    .array(RecipeStepSchema)
    .min(6)
    .max(15)
    .describe("Szczegolowe kroki przygotowania (8-12 krokow)"),
  nutrition: NutritionSchema.describe("Wartosci odzywcze na porcje"),
  tips: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("Wskazowki szefa kuchni"),
  servingSuggestion: z.string().optional().describe("Sugestia podania dania"),
  storageInfo: z.string().optional().describe("Jak przechowywac pozostalosci"),
});

export type FullRecipe = z.infer<typeof FullRecipeSchema>;
export type FullRecipeIngredient = z.infer<typeof FullRecipeIngredientSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type Nutrition = z.infer<typeof NutritionSchema>;
