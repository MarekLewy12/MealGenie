export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface MealSuggestion {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTimeMinutes: number;
  calories?: number;
  ingredients: Ingredient[];
  stepsSummary: string[];
  imageUrl?: string | null;
  imagePromptEn?: string;
}

export interface MealResponse {
  meals: MealSuggestion[];
}
