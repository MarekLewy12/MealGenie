import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
