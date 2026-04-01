import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChefHat,
  Clock,
  Flame,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  IngredientsSection,
  NutritionSection,
  StatCard,
  StepsSection,
  SuggestionCard,
  TipsSection,
} from "../components/recipe/RecipeSections";
import { ThemeToggle } from "../components/ThemeToggle";
import { getSharedMeal } from "../services/api";
import type { FullRecipe } from "../types/meal";

export function SharedRecipePage() {
  const { shareId } = useParams<{ shareId: string }>();

  const { data: meal, isLoading, isError } = useQuery({
    queryKey: ["sharedMeal", shareId],
    queryFn: () => getSharedMeal(shareId!),
    enabled: Boolean(shareId),
    retry: false,
  });

  const recipe: FullRecipe | null = meal?.fullRecipeJson ?? null;

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageUrl = meal?.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal?.imageUrl;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !meal || !recipe) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-full bg-rose-100 p-4 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Przepis nie został znaleziony
        </h1>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          Ten link mógł wygasnąć albo udostępnianie zostało wyłączone.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Przejdź do MealGenie
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#020617] dark:to-slate-900">
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-genie-no-text.png"
              alt="MealGenie"
              className="h-8 w-8"
            />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Meal<span className="text-indigo-600">Genie</span>
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <div className="relative">
        <div className="h-[200px] overflow-hidden sm:h-[280px] md:h-[360px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={meal.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
              <UtensilsCrossed className="h-24 w-24 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:block" />
        </div>

        <div className="bg-gradient-to-b from-indigo-100 via-white/95 to-slate-50 px-4 py-5 dark:from-indigo-950 dark:via-indigo-950/90 dark:to-slate-900 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:bg-none sm:bg-transparent sm:p-6">
          <div className="mx-auto max-w-6xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-500 via-indigo-600 to-fuchsia-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-500/20 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:shadow-none"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Udostępniony przepis
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl sm:text-white md:text-3xl lg:text-4xl"
            >
              {meal.name}
            </motion.h1>
            {meal.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-1.5 max-w-3xl text-sm text-slate-600 dark:text-indigo-100 sm:mt-2 sm:text-base sm:text-white/90 md:text-lg"
              >
                {meal.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          <StatCard
            icon={Clock}
            label="Czas"
            value={`${recipe.totalTimeMinutes || meal.estimatedTime || 0} min`}
            color="blue"
          />
          <StatCard
            icon={ChefHat}
            label="Trudność"
            value={
              recipe.difficulty === "Easy"
                ? "Łatwe"
                : recipe.difficulty === "Medium"
                  ? "Średnie"
                  : "Trudne"
            }
            color="purple"
          />
          <StatCard
            icon={Flame}
            label="Kalorie"
            value={recipe.nutrition?.calories ? `${recipe.nutrition.calories} kcal` : "—"}
            color="orange"
          />
          <StatCard
            icon={Users}
            label="Porcje"
            value={recipe.servings ? `${recipe.servings}` : "—"}
            color="green"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div className="space-y-8">
          <NutritionSection nutrition={recipe.nutrition} />

          <IngredientsSection
            ingredients={recipe.ingredients}
            allowShoppingList={false}
          />

          <StepsSection steps={recipe.steps} />

          {recipe.tips.length > 0 && <TipsSection tips={recipe.tips} />}

          {recipe.servingSuggestion && (
            <SuggestionCard
              icon={Sparkles}
              title="💫 Jak podać"
              content={recipe.servingSuggestion}
            />
          )}

          {recipe.storageInfo && (
            <SuggestionCard
              icon={Sparkles}
              title="📦 Przechowywanie"
              content={recipe.storageInfo}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-[2rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-8 text-center text-white shadow-2xl shadow-indigo-500/25"
          >
            <Sparkles className="mx-auto mb-4 h-10 w-10" />
            <h2 className="text-2xl font-bold">Chcesz więcej przepisów?</h2>
            <p className="mt-2 text-indigo-50/90">
              MealGenie tworzy przepisy dopasowane do Twoich preferencji, diety
              i składników, które masz pod ręką.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 shadow-lg transition hover:scale-[1.02] hover:bg-indigo-50"
            >
              Wypróbuj za darmo
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
