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
import {
  Badge,
  Button,
  Card,
  Eyebrow,
  FolkDivider,
  IconButton,
  MealEmoji,
} from "../components/ui";

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
  const totalTime = recipe?.totalTimeMinutes || headerData?.cookingTimeMinutes || 0;
  const difficultyLabel =
    (recipe?.difficulty || headerData?.difficulty) === "Easy"
      ? "Łatwe"
      : (recipe?.difficulty || headerData?.difficulty) === "Medium"
        ? "Średnie"
        : "Trudne";

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
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-bg-elevated/90 shadow-xs backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 py-2">
          <DashboardBackLink />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
          <div className="grid overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="relative min-h-[230px] overflow-hidden sm:min-h-[320px] lg:min-h-[560px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={headerData?.name || recipe?.name || "Przepis"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[230px] w-full items-center justify-center bg-accent-soft sm:min-h-[320px] lg:min-h-[560px]">
                  <MealEmoji
                    name={headerData?.name || recipe?.name || "Przepis"}
                    size="lg"
                    className="text-7xl"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-accent-deep/10 to-transparent" />
              <Badge
                variant="accent"
                className="absolute left-4 top-4 shadow-sm"
              >
                {isHistoryView ? "Zapisany przepis" : "Świeżo wygenerowany"}
              </Badge>
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
              <Eyebrow>Przepis MealGenie</Eyebrow>
              <h1 className="mt-3 font-brand text-3xl font-semibold leading-[1.05] text-ink sm:text-5xl">
                {headerData?.name || recipe?.name || "Ładowanie przepisu"}
              </h1>
              {headerData?.description && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                  {headerData.description}
                </p>
              )}

              <FolkDivider className="my-5 max-w-48" />

              {headerData && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                  <StatCard
                    icon={Clock}
                    label="Czas"
                    value={`${totalTime} min`}
                    color="blue"
                  />
                  <StatCard
                    icon={ChefHat}
                    label="Trudność"
                    value={difficultyLabel}
                    color="purple"
                  />
                  <StatCard
                    icon={Flame}
                    label="Kalorie"
                    value={recipe?.nutrition?.calories || headerData.calories ? `${recipe?.nutrition?.calories || headerData.calories} kcal` : "—"}
                    color="orange"
                  />
                  <StatCard
                    icon={Users}
                    label="Porcje"
                    value={recipe?.servings ? `${recipe.servings}` : "—"}
                    color="green"
                  />
                </div>
              )}

              {recipe && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {mealId && (
                    <Button
                      variant={isFavorite ? "primary" : "secondary"}
                      onClick={handleToggleFavorite}
                      disabled={favoriteMutation.isPending}
                      leftIcon={
                        favoriteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                        )
                      }
                    >
                      {isFavorite ? "Ulubione" : "Dodaj do ulubionych"}
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    onClick={handleShare}
                    disabled={shareMutation.isPending || !mealId}
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
                    {shareMutation.isPending
                      ? "Przetwarzam..."
                      : isCopied
                        ? "Skopiowano"
                        : shareId
                          ? "Kopiuj link"
                          : "Udostępnij"}
                  </Button>

                  {shareId && (
                    <IconButton
                      aria-label="Wyłącz udostępnianie przepisu"
                      variant="ghost"
                      onClick={handleDisableShare}
                      disabled={shareMutation.isPending}
                      icon={<XCircle className="h-4 w-4" />}
                      className="rounded-pill text-bordeaux"
                      title="Wyłącz udostępnianie"
                    />
                  )}

                  <Button
                    variant="secondary"
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    leftIcon={
                      isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )
                    }
                  >
                    {isExporting ? "Generuję..." : "Pobierz PDF"}
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleAskAssistant}
                    disabled={!recipe || !mealId}
                    leftIcon={<MessageSquare className="h-4 w-4" />}
                  >
                    Zapytaj asystenta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
                    <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <Eyebrow tone="basil">Asystent w kuchni</Eyebrow>
                    <p className="mt-2 text-sm font-semibold leading-snug text-ink">
                      Potrzebujesz pomocy z tym przepisem?
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      Zapytaj o kroki, zamienniki składników albo czas.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleAskAssistant}
                  disabled={!recipe || !mealId}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                  className="mt-4 w-full"
                >
                  Otwórz chat przepisu
                </Button>
              </Card>
            </aside>

            <div>
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
                        title="Jak podać"
                        content={recipe.servingSuggestion}
                      />
                    )}

                    {recipe.storageInfo && (
                      <SuggestionCard
                        icon={Refrigerator}
                        title="Przechowywanie"
                        content={recipe.storageInfo}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
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
    <Card className="p-6 text-center">
      <Eyebrow tone="accent">Nie udało się przygotować przepisu</Eyebrow>
      <p className="mx-auto mt-3 max-w-xl text-ink-soft">{message}</p>
      <Button
        onClick={onRetry}
        variant="primary"
        className="mt-5"
      >
        Spróbuj ponownie
      </Button>
    </Card>
  );
}
