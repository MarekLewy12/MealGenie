import { useEffect, useRef, useState, type ElementType } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Clock,
  ChefHat,
  Flame,
  Users,
  Lightbulb,
  UtensilsCrossed,
  Refrigerator,
  Sparkles,
  Timer,
  Beef,
  Carrot,
  Milk,
  Sparkle,
  Heart,
  Loader2,
} from "lucide-react";

import {
  generateFullRecipe,
  getMealById,
  toggleMealFavorite,
} from "../services/api";
import { LoadingExperience } from "../components/LoadingExperience";
import { DashboardBackLink } from "../components/DashboardBackLink";
import type {
  MealSuggestion,
  FullRecipe,
  FullRecipeIngredient,
} from "../types/meal";

export function RecipePage() {
  const { state } = useLocation() as { state?: { teaser?: MealSuggestion } };
  const { id: routeId } = useParams<{ id: string }>();
  const teaser = state?.teaser;

  const [mealId, setMealId] = useState<string | null>(routeId || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const lastTeaserKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (routeId) {
      setMealId(routeId);
    }
  }, [routeId]);

  // Widok historii tylko przy routeId i braku teasera.
  const isHistoryView = Boolean(routeId) && !teaser;

  const {
    data: historyMeal,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["meal", routeId],
    queryFn: () => getMealById(routeId!),
    enabled: isHistoryView,
  });

  const {
    mutate: generateRecipe,
    data: generatedData,
    isPending: isGenerating,
    isError: isGenerateError,
    error: generateError,
  } = useMutation({
    mutationFn: () => generateFullRecipe(teaser!),
    onSuccess: (data) => {
      // Id potrzebne do akcji ulubionych.
      setMealId(data.mealHistoryId);
    },
  });

  useEffect(() => {
    if (!teaser || routeId) return;
    const teaserKey = JSON.stringify(teaser);
    if (lastTeaserKeyRef.current === teaserKey) return;
    lastTeaserKeyRef.current = teaserKey;
    generateRecipe();
  }, [teaser, routeId, generateRecipe]);

  useEffect(() => {
    if (historyMeal) {
      setIsFavorite(historyMeal.isFavorite);
    }
  }, [historyMeal]);

  const favoriteMutation = useMutation({
    mutationFn: () => toggleMealFavorite(mealId!),
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
    },
  });

  if (!teaser && !routeId) {
    return <Navigate to="/generator" replace />;
  }

  const recipe: FullRecipe | null = isHistoryView
    ? historyMeal?.fullRecipeJson || null
    : generatedData?.recipe || null;

  const isError = isGenerateError || isHistoryError;

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const headerData =
    teaser ??
    (historyMeal
      ? {
          name: historyMeal.name,
          description: historyMeal.description || "",
          cookingTimeMinutes: historyMeal.estimatedTime || 0,
          difficulty: "Medium" as const,
          imageUrl: historyMeal.imageUrl,
          calories: recipe?.nutrition?.calories,
        }
      : null);
  const imageUrl = headerData?.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${headerData.imageUrl}`
    : headerData?.imageUrl;

  const errorMessage = isGenerateError
    ? generateError instanceof Error
      ? generateError.message
      : "Nie udało się wygenerować przepisu"
    : historyError instanceof Error
      ? historyError.message
      : "Nie udało się załadować przepisu";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#020617] dark:to-slate-900">
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <DashboardBackLink />
          {mealId && (
            <button
              onClick={() => favoriteMutation.mutate()}
              disabled={favoriteMutation.isPending}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isFavorite
                  ? "border-red-200/80 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:border-red-400/50 dark:hover:bg-red-500/20"
                  : "border-slate-200/80 bg-white/90 text-slate-800 hover:border-indigo-300 hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:bg-slate-900"
              }`}
            >
              {favoriteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
              )}
              {isFavorite ? "Ulubione" : "Dodaj do ulubionych"}
            </button>
          )}
        </div>
      </header>

      <div className="relative">
        <div className="h-[280px] overflow-hidden md:h-[360px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={headerData?.name || "Przepis"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
              <UtensilsCrossed className="h-24 w-24 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mx-auto max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold md:text-4xl"
            >
              {headerData?.name || "Ładowanie..."}
            </motion.h1>
            {headerData?.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-lg text-white/90"
              >
                {headerData.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {headerData && (
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Czas"
              value={`${headerData.cookingTimeMinutes} min`}
              color="blue"
            />
            <StatCard
              icon={ChefHat}
              label="Trudność"
              value={
                headerData.difficulty === "Easy"
                  ? "Łatwe"
                  : headerData.difficulty === "Medium"
                    ? "Średnie"
                    : "Trudne"
              }
              color="purple"
            />
            <StatCard
              icon={Flame}
              label="Kalorie"
              value={headerData.calories ? `${headerData.calories} kcal` : "—"}
              color="orange"
            />
            <StatCard
              icon={Users}
              label="Porcje"
              value={recipe?.servings ? `${recipe.servings}` : "—"}
              color="green"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 pb-16">
        {isGenerating && (
          <LoadingExperience
            title="Tworzę pełny przepis"
            subtitle="To potrwa chwilę. Zbieram składniki, kroki i wartości odżywcze."
            progressLabel="Układam szczegóły przepisu..."
            progressDurationSec={28}
            className="min-h-[420px] py-10"
          />
        )}

        {!isGenerating && isLoadingHistory && <RecipeLoadingSkeleton />}

        {isError && (
          <ErrorCard
            message={errorMessage}
            onRetry={() => {
              if (isHistoryView) {
                refetchHistory();
                return;
              }
              if (teaser) {
                generateRecipe();
              }
            }}
          />
        )}

        <AnimatePresence>
          {recipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <NutritionSection nutrition={recipe.nutrition} />

              <IngredientsSection ingredients={recipe.ingredients} />

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
                  icon={Refrigerator}
                  title="📦 Przechowywanie"
                  content={recipe.storageInfo}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: string;
  color: "blue" | "purple" | "orange" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className={`rounded-xl p-2.5 ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function NutritionSection({
  nutrition,
}: {
  nutrition: FullRecipe["nutrition"];
}) {
  const items = [
    {
      label: "Kalorie",
      value: nutrition.calories,
      unit: "kcal",
      color: "bg-orange-500",
    },
    { label: "Białko", value: nutrition.protein, unit: "g", color: "bg-red-500" },
    {
      label: "Węglowodany",
      value: nutrition.carbs,
      unit: "g",
      color: "bg-amber-500",
    },
    { label: "Tłuszcze", value: nutrition.fat, unit: "g", color: "bg-yellow-500" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        📊 Wartości odżywcze
        <span className="text-sm font-normal text-slate-500">
          (na porcję)
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className={`mx-auto mb-2 h-1.5 w-12 rounded-full ${item.color}`} />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {item.value}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                {item.unit}
              </span>
            </p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

const categoryIcons: Record<string, ElementType> = {
  Mięso: Beef,
  Warzywa: Carrot,
  Nabiał: Milk,
  Przyprawy: Sparkle,
};

function IngredientsSection({
  ingredients,
}: {
  ingredients: FullRecipeIngredient[];
}) {
  const grouped = ingredients.reduce(
    (acc, ing) => {
      const cat = ing.category || "Inne";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ing);
      return acc;
    },
    {} as Record<string, FullRecipeIngredient[]>,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        🥗 Składniki
      </h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => {
          const IconComponent = categoryIcons[category] || UtensilsCrossed;
          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <IconComponent className="h-4 w-4" />
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {ing.name}
                      </span>
                      {ing.notes && (
                        <span className="text-slate-500"> ({ing.notes})</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function StepsSection({ steps }: { steps: FullRecipe["steps"] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        👨‍🍳 Przygotowanie
      </h2>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                  {step.stepNumber}
                </span>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
              {step.duration && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Timer className="h-3 w-3" />
                  {step.duration}
                </span>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {step.instruction}
            </p>
            {step.tip && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {step.tip}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function TipsSection({ tips }: { tips: string[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-100">
        💡 Wskazówki szefa kuchni
      </h2>
      <ul className="space-y-3">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-500/30 dark:text-amber-200">
              {idx + 1}
            </span>
            <span className="text-amber-800 dark:text-amber-100">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

function SuggestionCard({
  icon: Icon,
  title,
  content,
}: {
  icon: ElementType;
  title: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{content}</p>
    </motion.div>
  );
}

function RecipeLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="mb-4 h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 h-6 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <p className="mb-4 text-red-700 dark:text-red-300">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
