import type { LucideIcon } from "lucide-react";
import { ChefHat, Clock3, Hourglass, Timer } from "lucide-react";

import type { MealType } from "../../types/meal";

// ============================================
// Opcje typu posilku (5 wariantow)
// ============================================

export type MealTypeOption = {
  value: MealType;
  label: string;
  hint: string;
  emoji: string;
};

export const mealTypeOptions: MealTypeOption[] = [
  {
    value: "BREAKFAST",
    label: "Śniadanie",
    hint: "lekko i szybko",
    emoji: "☕",
  },
  {
    value: "LUNCH",
    label: "Lunch/Obiad",
    hint: "mocno i treściwie",
    emoji: "🍲",
  },
  {
    value: "DINNER",
    label: "Kolacja",
    hint: "wieczorne inspiracje",
    emoji: "🥗",
  },
  {
    value: "SNACK",
    label: "Przekąska",
    hint: "małe co nieco",
    emoji: "🥪",
  },
  {
    value: "DESSERT",
    label: "Deser",
    hint: "słodkie inspiracje",
    emoji: "🍰",
  },
];

export const mealTypeValues = new Set<MealType>(
  mealTypeOptions.map((option) => option.value),
);

// ============================================
// Opcje maks. czasu (4 warianty)
// ============================================

export type PrepTimeOption = {
  value: number;
  label: string;
  hint: string;
  icon: LucideIcon;
};

export const prepTimeOptions: PrepTimeOption[] = [
  { value: 15, label: "15 min", hint: "na szybko", icon: Timer },
  { value: 30, label: "30 min", hint: "standardowo", icon: Clock3 },
  { value: 45, label: "45 min", hint: "spokojnie", icon: Hourglass },
  { value: 60, label: "60+ min", hint: "mam czas", icon: ChefHat },
];

export const findMealTypeOption = (value: MealType) =>
  mealTypeOptions.find((option) => option.value === value);

export const findPrepTimeOption = (value: number) =>
  prepTimeOptions.find((option) => option.value === value) ??
  prepTimeOptions[prepTimeOptions.length - 1];

// ============================================
// Opcje poziomu apetytu (5 wariantow, value 1-5 mapowane na payload hungerLevel)
// ============================================

export type HungerLevelOption = {
  value: number;
  label: string;
  hint: string;
  emoji: string;
};

export const hungerLevelOptions: HungerLevelOption[] = [
  { value: 1, label: "Lekko", hint: "minimalistycznie", emoji: "🥗" },
  { value: 2, label: "Skromnie", hint: "umiarkowanie", emoji: "🥘" },
  { value: 3, label: "Standardowo", hint: "wyważone", emoji: "🍽️" },
  { value: 4, label: "Sycąco", hint: "porządnie", emoji: "🍖" },
  { value: 5, label: "Uczta", hint: "wystawnie", emoji: "🍱" },
];

export const findHungerLevelOption = (value: number) =>
  hungerLevelOptions.find((option) => option.value === value) ??
  hungerLevelOptions[2]; // fallback: Standardowo (poziom 3)
