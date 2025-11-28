import axios from 'axios';

import type { AuthFormData } from '../schemas/auth';
import { useAuthStore } from '../store/authStore';
import type { MealResponse, MealType } from '../types/meal';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type SavePreferencesPayload = {
  userId: string;
  diet: string;
  allergies: string[];
  favCuisines: string[];
  dislikedIngredients: string[];
  cookingSkill: string;
  prepTimePreference: number;
  kitchenEquipment: string[];
  budget: string;
  servingSize: number;
};

export async function savePreferences(payload: SavePreferencesPayload) {
  const { data } = await api.post('/preferences', payload);
  return data;
}

export type GenerateMealSuggestionsPayload = {
  userId: string;
  mealType: MealType;
};

export async function generateMealSuggestions(
  payload: GenerateMealSuggestionsPayload,
) {
  const { data } = await api.post<MealResponse>(
    '/meals/suggest',
    payload,
    { timeout: 30_000 },
  );

  return data;
}

export async function registerUser(data: AuthFormData) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function loginUser(data: AuthFormData) {
  const response = await api.post('/auth/login', data);
  return response.data;
}
