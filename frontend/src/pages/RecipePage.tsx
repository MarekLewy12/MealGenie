import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  Clock,
  ChefHat,
  Download,
  Flame,
  Heart,
  Loader2,
  MessageSquare,
  Refrigerator,
  Share2,
  Sparkles,
  Users,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

import {
  generateFullRecipe,
  getMealById,
  toggleMealShare,
  toggleMealFavorite,
} from "../services/api";
import { RecipeLoadingWithPreview } from "../components/RecipeLoadingWithPreview";
import { DashboardBackLink } from "../components/DashboardBackLink";
import {
  IngredientsSection,
  NutritionSection,
  StatCard,
  StepsSection,
  SuggestionCard,
  TipsSection,
} from "../components/recipe/RecipeSections";
import { notify } from "../store/notificationStore";
import { useChatStore } from "../store/chatStore";
import { downloadRecipePdf } from "../utils/downloadRecipePdf";
import type { MealSuggestion, FullRecipe } from "../types/meal";

type RecipeView = "loading" | "recipe" | "error";

export function RecipePage() {
  const { state } = useLocation() as {
    state?: { teaser?: MealSuggestion; unusedImageUrls?: string[] };
  };
  const { id: routeId } = useParams<{ id: string }>();
  const teaser = state?.teaser;
  const unusedImageUrls = state?.unusedImageUrls;

  const [view, setView] = useState<RecipeView>("loading");
  const [mealId, setMealId] = useState<string | null>(routeId || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [localRecipe, setLocalRecipe] = useState<FullRecipe | null>(null);
  const hasNotifiedRef = useRef(false);
  const copiedTimeoutRef = useRef<number | null>(null);
  const openRecipeChat = useChatStore((state) => state.openRecipeChat);

  useEffect(() => {
    setLocalRecipe(null);
    setShareId(null);
    setIsCopied(false);
    setErrorMessage("");
    hasNotifiedRef.current = false;
    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
  }, [routeId, teaser]);

  useEffect(() => {
    if (routeId) {
      setMealId(routeId);
    }
  }, [routeId]);

  // Widok historii tylko przy routeId i braku teasera.
  const isHistoryView = Boolean(routeId) && !teaser;

  const {
    data: historyMeal,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["meal", routeId],
    queryFn: () => getMealById(routeId!),
    enabled: isHistoryView,
  });

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isHistoryView) {
      setView("loading");
    }
  }, [isHistoryView, routeId]);

  useEffect(() => {
    if (!isHistoryView) return;
    if (historyMeal) {
      setView("recipe");
      setIsFavorite(historyMeal.isFavorite);
      setShareId(historyMeal.shareId ?? null);
      return;
    }
    if (!isHistoryError) return;
    setView("error");
    setErrorMessage(
      historyError instanceof Error
        ? historyError.message
        : "Nie udało się załadować przepisu.",
    );
    notify.error(
      historyError instanceof Error
        ? historyError.message
        : "Nie udało się załadować przepisu.",
      "Błąd ładowania",
    );
  }, [isHistoryView, historyMeal, isHistoryError, historyError]);

  const {
    data: generatedData,
    isLoading: isGenerating,
    isError: isGenerateError,
    error: generateError,
    refetch: refetchGenerate,
  } = useQuery({
    queryKey: ["generateRecipe", teaser?.name, teaser?.cookingTimeMinutes],
    queryFn: async () => {
      const result = await generateFullRecipe(teaser!, 2, unusedImageUrls);
      return result;
    },
    enabled: !!teaser && !routeId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (isHistoryView) return;

    if (isGenerating) {
      setView("loading");
      hasNotifiedRef.current = false;
      return;
    }

    if (isGenerateError) {
      setView("error");
      setErrorMessage(
        generateError instanceof Error
          ? generateError.message
          : "Nie udało się wygenerować przepisu.",
      );
      if (!hasNotifiedRef.current) {
        notify.error("Nie udało się wygenerować przepisu.", "Generator");
        hasNotifiedRef.current = true;
      }
      return;
    }

    if (generatedData) {
      setLocalRecipe(generatedData.recipe);
      setMealId(generatedData.mealHistoryId);
      setShareId(null);
      setView("recipe");
      if (!hasNotifiedRef.current) {
        notify.success("Przepis jest gotowy!", "Generator");
        hasNotifiedRef.current = true;
      }
    }
  }, [isHistoryView, isGenerating, isGenerateError, generateError, generatedData]);

  const favoriteMutation = useMutation({
    mutationFn: () => toggleMealFavorite(mealId!),
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
      notify.info(
        data.isFavorite
          ? "Dodano do ulubionych."
          : "Usunięto z ulubionych.",
      );
    },
    onError: (err) => {
      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować ulubionych.",
        "Błąd ulubionych",
      );
    },
  });

  const shareMutation = useMutation({
    mutationFn: (id: string) => toggleMealShare(id),
  });

  if (!teaser && !routeId) {
    return <Navigate to="/generator" replace />;
  }

  const recipe: FullRecipe | null = isHistoryView
    ? historyMeal?.fullRecipeJson || null
    : localRecipe || generatedData?.recipe || null;

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

  const handleToggleFavorite = () => {
    if (!mealId || favoriteMutation.isPending) return;
    favoriteMutation.mutate();
  };

  const handleAskAssistant = () => {
    if (!recipe || !mealId) return;

    openRecipeChat({
      recipeId: mealId,
      recipeName: recipe.name,
      recipeImageUrl: imageUrl ?? undefined,
    });
  };

  const handleExportPdf = async () => {
    if (!recipe || isExporting) return;

    setIsExporting(true);
    try {
      await downloadRecipePdf(recipe, imageUrl ?? undefined);
      notify.success("PDF zapisany!", "Eksport");
    } catch {
      notify.error("Nie udało się wygenerować PDF.", "Eksport");
    } finally {
      setIsExporting(false);
    }
  };

  const copyShareLink = async (id: string) => {
    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }

    const shareUrl = `${window.location.origin}/shared/${id}`;
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    notify.success("Link skopiowany do schowka!");
    copiedTimeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
      copiedTimeoutRef.current = null;
    }, 3000);
  };

  const handleShare = async () => {
    if (!mealId || shareMutation.isPending) return;

    if (shareId) {
      try {
        await copyShareLink(shareId);
      } catch {
        setIsCopied(false);
        notify.error("Nie udało się skopiować linku do schowka.", "Udostępnianie");
      }
      return;
    }

    try {
      const result = await shareMutation.mutateAsync(mealId);
      if (!result.shareId) {
        notify.error("Nie udało się wygenerować linku.", "Udostępnianie");
        return;
      }

      setShareId(result.shareId);
      await copyShareLink(result.shareId);
    } catch (err) {
      setIsCopied(false);
      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się wygenerować linku.",
        "Udostępnianie",
      );
    }
  };

  const handleDisableShare = async () => {
    if (!mealId || !shareId || shareMutation.isPending) return;

    try {
      await shareMutation.mutateAsync(mealId);
      setShareId(null);
      setIsCopied(false);
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = null;
      }
      notify.info("Udostępnianie wyłączone.");
    } catch (err) {
      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się wyłączyć udostępniania.",
        "Udostępnianie",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#020617] dark:to-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <DashboardBackLink />
          <div className="flex items-center gap-1.5 sm:gap-2">
            {recipe && (
              <div className="flex items-center">
                <button
                  onClick={handleShare}
                  disabled={shareMutation.isPending}
                  title={shareId ? "Kopiuj link udostępniania" : "Udostępnij przepis"}
                  className={`inline-flex cursor-pointer items-center gap-1.5 border px-2.5 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-3 sm:text-sm ${
                    shareId
                      ? "rounded-l-full border-r-0 border-emerald-200/80 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/20"
                      : "rounded-full border-slate-200/80 bg-white/90 text-slate-800 hover:border-indigo-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:bg-slate-900"
                  }`}
                >
                  {shareMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCopied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {shareMutation.isPending
                      ? "Przetwarzam..."
                      : isCopied
                        ? "Skopiowano!"
                        : shareId
                          ? "Kopiuj link"
                          : "Udostępnij"}
                  </span>
                </button>

                {shareId && (
                  <button
                    onClick={handleDisableShare}
                    disabled={shareMutation.isPending}
                    className="cursor-pointer rounded-r-full border border-l-0 border-emerald-200/80 bg-emerald-50 px-1.5 py-2 text-emerald-400 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:hover:bg-red-500/10"
                    title="Wyłącz udostępnianie"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {recipe && (
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-3 sm:text-sm dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:bg-slate-900"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isExporting ? "Generuję..." : "Pobierz PDF"}
                </span>
              </button>
            )}

            {mealId && (
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteMutation.isPending}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed sm:gap-2 sm:px-3 sm:text-sm ${
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
                <span className="hidden sm:inline">
                  {isFavorite ? "Ulubione" : "Dodaj do ulubionych"}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="h-[200px] overflow-hidden sm:h-[280px] md:h-[360px]">
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
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:block" />
        </div>

        <div className="absolute right-4 top-4 z-10 flex gap-2">
          {mealId && (
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteMutation.isPending}
              className={`cursor-pointer rounded-full p-2.5 shadow-lg transition hover:scale-105 disabled:cursor-not-allowed ${
                isFavorite
                  ? "bg-red-500/90 text-white shadow-red-200/50 dark:shadow-red-900/30"
                  : "bg-white/90 text-slate-700 shadow-slate-200/60 hover:bg-white dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-slate-900/30"
              }`}
              title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            >
              {favoriteMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              )}
            </button>
          )}

          <button
            onClick={handleAskAssistant}
            className="group cursor-pointer rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-2.5 shadow-lg shadow-amber-200/50 transition hover:scale-105 hover:shadow-amber-300/70 dark:shadow-amber-900/30"
            title="Zapytaj asystenta o ten przepis"
          >
            <MessageSquare className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="bg-gradient-to-b from-indigo-100 via-white/95 to-slate-50 px-4 py-5 dark:from-indigo-950 dark:via-indigo-950/90 dark:to-slate-900 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:bg-none sm:bg-transparent sm:p-6">
          <div className="mx-auto max-w-6xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl sm:text-white md:text-3xl lg:text-4xl"
            >
              {headerData?.name || "Ładowanie..."}
            </motion.h1>
            {headerData?.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-1.5 text-sm text-slate-600 dark:text-indigo-100 sm:mt-2 sm:text-base sm:text-white/90 md:text-lg"
              >
                {headerData.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {headerData && (
        <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
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

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Potrzebujesz pomocy z tym przepisem?
                  </p>
                  <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80">
                    Zapytaj o kroki, zamienniki składników albo czas.
                  </p>
                </div>
              </div>
              <button
                onClick={handleAskAssistant}
                disabled={!recipe || !mealId}
                className="mt-4 w-full cursor-pointer rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-200/50 transition hover:scale-[1.02] hover:shadow-amber-300/70 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-amber-900/30"
              >
                Wezwij asystenta przepisu
              </button>
            </div>
          </aside>

          <div>
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-200/50 bg-amber-50/95 px-3 pb-[env(safe-area-inset-bottom,8px)] pt-3 backdrop-blur-lg lg:hidden dark:border-amber-500/20 dark:bg-slate-900/95">
              <button
                onClick={handleAskAssistant}
                disabled={!recipe || !mealId}
                className="mx-auto flex w-full max-w-lg cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition active:scale-[0.98] disabled:opacity-60"
              >
                <MessageSquare className="h-4 w-4" />
                Zapytaj asystenta
              </button>
            </div>

            <div className="pb-20 lg:pb-0">
              <AnimatePresence mode="wait">
                {view === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RecipeLoadingWithPreview teaser={teaser} />
                  </motion.div>
                )}

                {view === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorCard
                      message={errorMessage}
                      onRetry={() => {
                        if (isHistoryView) {
                          setView("loading");
                          refetchHistory();
                          return;
                        }
                        if (teaser) {
                          setView("loading");
                          refetchGenerate();
                        }
                      }}
                    />
                  </motion.div>
                )}

                {view === "recipe" && recipe && (
                  <motion.div
                    key="recipe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <NutritionSection nutrition={recipe.nutrition} />

                    <IngredientsSection
                      ingredients={recipe.ingredients}
                      allowShoppingList
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
