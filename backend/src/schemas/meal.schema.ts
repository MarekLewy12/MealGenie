import { z } from "zod";

export const MealTypeSchema = z.enum([
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
]);

// Pojedyncza propozycja dania
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

  // Lista składników
  ingredients: z
    .array(
      z.object({
        name: z.string().describe("Nazwa produktu, np. 'Pomidory w puszce'"),
        amount: z.string().describe("Ilość, np. '1 puszka', '200g'"),
      }),
    )
    .describe("Lista głównych składników potrzebnych do dania"),

  // Skrócona instrukcja
  stepsSummary: z
    .array(z.string())
    .describe("3-4 główne kroki przygotowania (skrót)"),
});

// cała odpowiedź od AI (lista 3 dań)
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
