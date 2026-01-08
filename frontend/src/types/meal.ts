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

export interface FullRecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  category: string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  duration?: string;
  tip?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface FullRecipe {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  ingredients: FullRecipeIngredient[];
  steps: RecipeStep[];
  nutrition: Nutrition;
  tips: string[];
  servingSuggestion?: string;
  storageInfo?: string;
  imageUrl: string | null;
}
