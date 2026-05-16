import type { LucideIcon } from "lucide-react";
import {
  ChefHat,
  Coffee,
  Moon,
  Sparkles,
  Timer,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// Typy
// ============================================

export type QuickStartItem = {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  hoverBg: string;
};

// ============================================
// Lista presetow quick start (reuse w Empty State i QuickStartsSection)
// ============================================

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

// ============================================
// Karta pojedynczego quick start
// ============================================

export function QuickStartCard({ item }: { item: QuickStartItem }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      role="listitem"
      className={`group flex items-center gap-3 rounded-xl border border-border/70 bg-bg-elevated p-3.5 shadow-xs transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent dark:border-white/[0.08] dark:bg-white/[0.06] ${item.hoverBg}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.tone} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-brand text-sm font-semibold leading-tight text-ink">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs leading-4 text-ink-muted">
          {item.description}
        </span>
      </span>
    </Link>
  );
}
