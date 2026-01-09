import axios from "axios";

import type { LoginFormData, RegisterFormData } from "../schemas/auth";
import { useAuthStore } from "../store/authStore";
import type {
  FullRecipe,
  MealResponse,
  MealSuggestion,
  MealType,
  MealHistoryItem,
  MealHistoryDetail,
  MealHistoryResponse,
  GenerateRecipeResponse,
} from "../types/meal";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type SavePreferencesPayload = {
  diet: string;
  allergies: string[];
  favCuisines: string[];
  dislikedIngredients: string[];
  cookingSkill: string;
  kitchenEquipment: string[];
  budget: string;
};

export async function savePreferences(payload: SavePreferencesPayload) {
  const { data } = await api.post("/preferences", payload);
  return data;
}

export type GenerateMealSuggestionsPayload = {
  mealType: MealType;
  prepTime: number;
  servingSize: number;
  userPrompt?: string;
  availableIngredients?: string[];
  useEquipment?: string[];
};

export async function generateMealSuggestions(
  payload: GenerateMealSuggestionsPayload,
) {
  const { data } = await api.post<MealResponse>("/meals/suggest", payload, {
    timeout: 120_000,
  });

  return data;
}

export async function generateFullRecipe(
  mealTeaser: MealSuggestion,
  servings: number = 2,
): Promise<GenerateRecipeResponse> {
  const { data } = await api.post<GenerateRecipeResponse>(
    "/meals/recipe",
    { mealTeaser, servings },
    { timeout: 60_000 },
  );

  return data;
}

export interface GetHistoryOptions {
  limit?: number;
  offset?: number;
  favoritesOnly?: boolean;
}

export async function getMealHistory(
  options: GetHistoryOptions = {},
): Promise<MealHistoryResponse> {
  const params = new URLSearchParams();

  if (options.limit !== undefined) params.set("limit", String(options.limit));
  if (options.offset !== undefined) params.set("offset", String(options.offset));
  if (options.favoritesOnly) params.set("favoritesOnly", "true");

  const queryString = params.toString();
  const url = queryString ? `/meals/history?${queryString}` : "/meals/history";

  const { data } = await api.get<MealHistoryResponse>(url);
  return data;
}

export async function getMealById(id: string): Promise<MealHistoryDetail> {
  const { data } = await api.get<MealHistoryDetail>(`/meals/history/${id}`);
  return data;
}

export async function toggleMealFavorite(
  id: string,
): Promise<{ isFavorite: boolean }> {
  const { data } = await api.patch<{ isFavorite: boolean }>(
    `/meals/${id}/favorite`,
  );
  return data;
}

export async function registerUser(data: RegisterFormData) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: LoginFormData) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function getPreferences() {
  const { data } = await api.get<SavePreferencesPayload | null>("/preferences");
  return data;
}
