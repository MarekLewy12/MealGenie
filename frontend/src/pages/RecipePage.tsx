import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  Download,
  Heart,
  Loader2,
  MessageSquare,
  Refrigerator,
  Scale,
  Share2,
  Sparkles,
  Users,
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
  StepsSection,
  SuggestionCard,
  TipsSection,
} from "../components/recipe/RecipeSections";
import { RecipeHero } from "../components/recipe/RecipeHero";
import { notify } from "../store/notificationStore";
import { useChatStore } from "../store/chatStore";
import { downloadRecipePdf } from "../utils/downloadRecipePdf";
import {
  formatRecipeContextPrimaryLabel,
  getRecipeContextBadges,
} from "../utils/recipeGenerationContext";
import type {
  FullRecipe,
  RecipeGenerationContext,
  RecipeRouteState,
} from "../types/meal";
import { Button, Card, Eyebrow, IconButton } from "../components/ui";

type RecipeView = "loading" | "recipe" | "error";

function getRecipeServings(recipeContext?: RecipeGenerationContext) {
  if (!recipeContext || recipeContext.portionMode !== "servings") {
    return 2;
  }

  return Math.min(12, Math.max(1, Math.trunc(recipeContext.servingSize)));
}

export function RecipePage() {
  const { state } = useLocation() as { state?: RecipeRouteState };
  const { id: routeId } = useParams<{ id: string }>();
  const teaser = state?.teaser;
  const unusedImageUrls = state?.unusedImageUrls;
  const recipeContext = state?.recipeContext;
  const recipeServings = getRecipeServings(recipeContext);

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
  }, [recipeServings, routeId, teaser]);

  useEffect(() => {
    if (routeId) {
      setMealId(routeId);
    }
  }, [routeId]);

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
    const msg =
      historyError instanceof Error
        ? historyError.message
        : "Nie udało się załadować przepisu.";
    setErrorMessage(msg);
    notify.error(msg, "Błąd ładowania");
  }, [isHistoryView, historyMeal, isHistoryError, historyError]);

  const {
    data: generatedData,
    isLoading: isGenerating,
    isError: isGenerateError,
    error: generateError,
    refetch: refetchGenerate,
  } = useQuery({
    queryKey: [
      "generateRecipe",
      teaser?.name,
      teaser?.cookingTimeMinutes,
      recipeServings,
      recipeContext?.portionMode,
      recipeContext?.targetWeightGrams,
      recipeContext?.hungerLevel,
    ],
    queryFn: () =>
      generateFullRecipe(teaser!, recipeServings, unusedImageUrls, recipeContext),
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
      const msg =
        generateError instanceof Error
          ? generateError.message
          : "Nie udało się wygenerować przepisu.";
      setErrorMessage(msg);
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
  const totalTime = recipe?.totalTimeMinutes || headerData?.cookingTimeMinutes || 0;
  const difficultyLabel =
    (recipe?.difficulty || headerData?.difficulty) === "Easy"
      ? "Łatwe"
      : (recipe?.difficulty || headerData?.difficulty) === "Medium"
        ? "Średnie"
        : "Trudne";
  const displayRecipeContext = recipe?.generationContext ?? recipeContext;
  const recipeContextBadges = getRecipeContextBadges(displayRecipeContext);
  const portionStatLabel =
    displayRecipeContext?.portionMode === "weight" ? "Waga" : "Porcje";
  const PortionStatIcon =
    displayRecipeContext?.portionMode === "weight" ? Scale : Users;
  const portionStatValue =
    formatRecipeContextPrimaryLabel(displayRecipeContext) ??
    (recipe?.servings ? `${recipe.servings}` : "—");

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
    <div className="min-h-screen bg-bg pb-[calc(env(safe-area-inset-bottom)+6rem)] text-ink lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-bg-elevated/90 shadow-xs backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-[1760px] items-center justify-between gap-3 px-4 py-2">
          <DashboardBackLink />
          {recipe ? (
            <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
              {mealId ? (
                <>
                  <IconButton
                    variant={isFavorite ? "secondary" : "ghost"}
                    onClick={handleToggleFavorite}
                    disabled={favoriteMutation.isPending}
                    aria-label={
                      isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                    }
                    className="sm:hidden"
                    icon={
                      favoriteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${isFavorite ? "fill-current text-accent" : ""}`}
                        />
                      )
                    }
                  />
                  <Button
                    variant={isFavorite ? "secondary" : "ghost"}
                    onClick={handleToggleFavorite}
                    disabled={favoriteMutation.isPending}
                    className="hidden px-3 sm:inline-flex"
                    leftIcon={
                      favoriteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                        />
                      )
                    }
                  >
                    Ulubione
                  </Button>
                </>
              ) : null}

              <IconButton
                variant="ghost"
                onClick={handleShare}
                disabled={shareMutation.isPending || !mealId}
                aria-label={shareId ? "Kopiuj link do przepisu" : "Udostępnij przepis"}
                className="sm:hidden"
                icon={
                  shareMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCopied ? (
                    <Check className="h-4 w-4 text-basil" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )
                }
              />
              <Button
                variant="ghost"
                onClick={handleShare}
                disabled={shareMutation.isPending || !mealId}
                className="hidden px-3 sm:inline-flex"
                leftIcon={
                  shareMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCopied ? (
                    <Check className="h-4 w-4 text-basil" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )
                }
              >
                {isCopied ? "Skopiowano" : shareId ? "Kopiuj link" : "Udostępnij"}
              </Button>

              {shareId ? (
                <IconButton
                  variant="ghost"
                  onClick={handleDisableShare}
                  disabled={shareMutation.isPending}
                  aria-label="Wyłącz udostępnianie przepisu"
                  className="text-bordeaux hover:bg-bordeaux/10"
                  icon={<XCircle className="h-4 w-4" />}
                />
              ) : null}

              <IconButton
                variant="ghost"
                onClick={handleExportPdf}
                disabled={isExporting}
                aria-label="Pobierz przepis jako PDF"
                className="sm:hidden"
                icon={
                  isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )
                }
              />
              <Button
                variant="ghost"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="hidden px-3 sm:inline-flex"
                leftIcon={
                  isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )
                }
              >
                PDF
              </Button>
            </div>
          ) : null}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "loading" ? (
          <main className="mx-auto max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RecipeLoadingWithPreview
                teaser={teaser}
                recipeContext={recipeContext}
              />
            </motion.div>
          </main>
        ) : null}

        {view === "error" ? (
          <main className="mx-auto max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
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
          </main>
        ) : null}

        {view === "recipe" && recipe && headerData ? (
          <motion.main
            key="recipe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div className="w-full">
              <RecipeHero
                title={headerData.name || recipe.name}
                description={headerData.description}
                imageUrl={imageUrl}
                badgeLabel={
                  isHistoryView ? "Zapisany przepis" : "Świeżo wygenerowany"
                }
                badgeVariant={isHistoryView ? "neutral" : "accent"}
                stats={{
                  totalTime,
                  difficultyLabel,
                  calories: recipe?.nutrition?.calories || headerData.calories,
                  portionLabel: portionStatLabel,
                  portionValue: portionStatValue,
                  PortionIcon: PortionStatIcon,
                }}
                contextBadges={recipeContextBadges}
                edgeToEdge
              />
            </motion.div>
            <RecipeHeroSeparator />

            <div className="mx-auto max-w-[1760px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start xl:grid-cols-[1fr_420px] xl:gap-12 2xl:grid-cols-[1fr_480px]">
                <aside className="order-1 space-y-8 lg:sticky lg:top-24 lg:order-2">
                  <NutritionSection nutrition={recipe.nutrition} />
                  <IngredientsSection ingredients={recipe.ingredients} allowShoppingList />
                </aside>

                <div className="order-2 space-y-10 lg:order-1">
                  <StepsSection steps={recipe.steps} />

                  <div className="space-y-6">
                    {recipe.tips.length > 0 ? (
                      <TipsSection tips={recipe.tips} />
                    ) : null}

                    <div className="grid gap-6 sm:grid-cols-2">
                      {recipe.servingSuggestion ? (
                        <SuggestionCard
                          icon={Sparkles}
                          title="Jak podać"
                          content={recipe.servingSuggestion}
                        />
                      ) : null}
                      {recipe.storageInfo ? (
                        <SuggestionCard
                          icon={Refrigerator}
                          title="Przechowywanie"
                          content={recipe.storageInfo}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        ) : null}
      </AnimatePresence>

      {recipe && mealId ? (
        <Button
          variant="primary"
          onClick={handleAskAssistant}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] left-4 right-4 z-50 min-h-12 rounded-pill shadow-[var(--shadow-accent)] sm:left-auto sm:right-6 sm:w-auto sm:px-6"
          leftIcon={<MessageSquare className="h-4.5 w-4.5" />}
        >
          Gotuj z asystentem
        </Button>
      ) : null}
    </div>
  );
}

function RecipeHeroSeparator() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden pb-8 pt-6 sm:pb-10 sm:pt-8"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border-strong/80 to-transparent dark:via-white/20" />
      <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/45 to-transparent dark:via-accent/30" />
      <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent-soft/35 to-transparent blur-lg dark:via-accent/10" />

      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
        <div className="h-1.5 w-1.5 rotate-45 bg-border-strong/80 dark:bg-white/25" />
        <div className="h-3 w-3 rotate-45 border border-accent bg-bg-elevated shadow-[0_0_18px_rgba(194,87,40,0.22)] dark:bg-bg" />
        <div className="h-1.5 w-1.5 rotate-45 bg-border-strong/80 dark:bg-white/25" />
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
    <Card className="mx-auto max-w-lg border-bordeaux/30 bg-accent-soft p-8 text-center text-bordeaux">
      <Eyebrow tone="accent">Nie udało się przygotować przepisu</Eyebrow>
      <p className="mx-auto mt-3 text-ink-soft">{message}</p>
      <Button onClick={onRetry} variant="primary" className="mx-auto mt-6">
        Spróbuj ponownie
      </Button>
    </Card>
  );
}
