import type { LucideIcon } from "lucide-react";
import {
  ChefHat,
  Coffee,
  Moon,
  Sparkles,
  Timer,
  Utensils,
} from "lucide-react";

export type QuickStartItem = {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  hoverBg: string;
};

export const quickStarts: QuickStartItem[] = [
  {
    to: "/generator?mealType=SNACK&prepTime=15",
    icon: Timer,
    title: "Mam 15 minut",
    description: "Szybki posiłek bez kombinowania",
    tone: "bg-accent-soft text-accent dark:bg-accent/20",
    hoverBg: "hover:border-accent/25 hover:bg-accent-soft/30 dark:hover:bg-accent/10",
  },
  {
    to: "/generator?mealType=LUNCH&prepTime=30",
    icon: Utensils,
    title: "Obiad po pracy",
    description: "Porządnie, ale bez spiny",
    tone: "bg-basil-soft text-basil dark:bg-basil/20",
    hoverBg: "hover:border-basil/25 hover:bg-basil-soft/30 dark:hover:bg-basil/10",
  },
  {
    to: "/generator?mealType=DINNER&prepTime=25",
    icon: Moon,
    title: "Lekka kolacja",
    description: "Konkretnie i spokojnie",
    tone: "bg-saffron-soft text-saffron dark:bg-saffron/20",
    hoverBg: "hover:border-saffron/25 hover:bg-saffron-soft/30 dark:hover:bg-saffron/10",
  },
  {
    to: "/generator?mealType=BREAKFAST&prepTime=20",
    icon: Coffee,
    title: "Spokojne śniadanie",
    description: "Dobry start bez pośpiechu",
    tone: "bg-basil-soft text-basil dark:bg-basil/20",
    hoverBg: "hover:border-basil/25 hover:bg-basil-soft/30 dark:hover:bg-basil/10",
  },
  {
    to: "/generator?mealType=DESSERT&prepTime=30",
    icon: Sparkles,
    title: "Coś słodkiego",
    description: "Mała przyjemność",
    tone: "bg-accent-soft text-accent dark:bg-accent/20",
    hoverBg: "hover:border-accent/25 hover:bg-accent-soft/30 dark:hover:bg-accent/10",
  },
  {
    to: "/generator?mealType=ANY&prepTime=60",
    icon: ChefHat,
    title: "Wielkie gotowanie",
    description: "Na spokojnie, dla relaksu",
    tone: "bg-saffron-soft text-saffron dark:bg-saffron/20",
    hoverBg: "hover:border-saffron/25 hover:bg-saffron-soft/30 dark:hover:bg-saffron/10",
  },
];
