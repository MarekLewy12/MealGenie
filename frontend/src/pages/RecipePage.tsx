import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useParams, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  Download,
  Heart,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Refrigerator,
  Scale,
  Share2,
  Sparkles,
  Trash2,
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
import { useDeleteMealHistory } from "../hooks/useDeleteMealHistory";
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
} from "../utils/recipeGenerationContext";
import type {
  FullRecipe,
  RecipeGenerationContext,
  RecipeRouteState,
} from "../types/meal";
import { Button, Card, ConfirmDialog, Eyebrow, IconButton } from "../components/ui";

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
  const navigate = useNavigate();
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [localRecipe, setLocalRecipe] = useState<FullRecipe | null>(null);

  const hasNotifiedRef = useRef(false);
  const copiedTimeoutRef = useRef<number | null>(null);
  const mobileActionsMenuRef = useRef<HTMLDivElement | null>(null);
  const openRecipeChat = useChatStore((state) => state.openRecipeChat);

  useEffect(() => {
    setLocalRecipe(null);
    setShareId(null);
    setIsCopied(false);
    setIsMobileActionsOpen(false);
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
    if (!isMobileActionsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        mobileActionsMenuRef.current &&
        !mobileActionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileActionsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileActionsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileActionsOpen]);

  useEffect(() => {
    if (isHistoryView) {
      setView("loading");
    }
  }, [isHistoryView, routeId]);

  useEffect(() => {
    if (!isHistoryView) return;

    if (historyMeal) {
      if (!historyMeal.fullRecipeJson) {
        const msg =
          "Ten wpis historii nie zawiera pełnej treści przepisu. Wróć do biblioteki albo wygeneruj nowy przepis.";
        setView("error");
        setErrorMessage(msg);
        if (!hasNotifiedRef.current) {
          notify.error(msg, "Brak treści przepisu");
          hasNotifiedRef.current = true;
        }
        return;
      }

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
  const deleteMutation = useDeleteMealHistory({
    successMessage: "Usunięto przepis.",
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      navigate("/recipes");
    },
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
            <div
              ref={mobileActionsMenuRef}
              className="relative flex min-w-0 items-center justify-end gap-1.5 sm:gap-2"
            >
              {mealId ? (
                <>
                  <IconButton
                    variant={isFavorite ? "secondary" : "ghost"}
                    onClick={handleToggleFavorite}
                    disabled={favoriteMutation.isPending}
                    aria-label={
                      isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                    }
                    className="hidden"
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
                  className="hidden text-bordeaux hover:bg-bordeaux/10 sm:inline-flex"
                  icon={<XCircle className="h-4 w-4" />}
                />
              ) : null}

              {mealId ? (
                <>
                  <IconButton
                    variant="ghost"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                    aria-label="Usuń przepis"
                    className="hidden text-bordeaux hover:bg-bordeaux/10 hover:text-bordeaux"
                    icon={
                      deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="hidden px-3 text-bordeaux hover:bg-bordeaux/10 hover:text-bordeaux sm:inline-flex"
                    leftIcon={
                      deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )
                    }
                  >
                    Usuń
                  </Button>
                </>
              ) : null}

              <IconButton
                variant="ghost"
                onClick={handleExportPdf}
                disabled={isExporting}
                aria-label="Pobierz przepis jako PDF"
                className="hidden"
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

              {mealId ? (
                <>
                  <IconButton
                    variant="secondary"
                    onClick={handleAskAssistant}
                    aria-label="Otwórz asystenta tego przepisu"
                    className="sm:hidden"
                    icon={<MessageSquare className="h-4 w-4" />}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAskAssistant}
                    className="hidden px-3 sm:inline-flex"
                    leftIcon={<MessageSquare className="h-4 w-4" />}
                  >
                    Asystent przepisu
                  </Button>
                </>
              ) : null}

              <IconButton
                variant="ghost"
                onClick={() => setIsMobileActionsOpen((current) => !current)}
                aria-label="Pokaż więcej akcji przepisu"
                aria-haspopup="menu"
                aria-expanded={isMobileActionsOpen}
                className="sm:hidden"
                icon={<MoreHorizontal className="h-4 w-4" />}
              />

              {isMobileActionsOpen ? (
                <div
                  role="menu"
                  aria-label="Więcej akcji przepisu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 overflow-hidden rounded-xl border border-border bg-bg-elevated p-1.5 text-sm text-ink shadow-lg sm:hidden"
                >
                  {mealId ? (
                    <MobileRecipeActionItem
                      icon={
                        favoriteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )
                      }
                      label={
                        isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                      }
                      disabled={favoriteMutation.isPending}
                      onSelect={() => {
                        setIsMobileActionsOpen(false);
                        handleToggleFavorite();
                      }}
                    />
                  ) : null}

                  {shareId ? (
                    <MobileRecipeActionItem
                      icon={<XCircle className="h-4 w-4" />}
                      label="Wyłącz udostępnianie"
                      danger
                      disabled={shareMutation.isPending}
                      onSelect={() => {
                        setIsMobileActionsOpen(false);
                        void handleDisableShare();
                      }}
                    />
                  ) : null}

                  <MobileRecipeActionItem
                    icon={
                      isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )
                    }
                    label="Pobierz PDF"
                    disabled={isExporting}
                    onSelect={() => {
                      setIsMobileActionsOpen(false);
                      void handleExportPdf();
                    }}
                  />

                  {mealId ? (
                    <MobileRecipeActionItem
                      icon={
                        deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )
                      }
                      label="Usuń przepis"
                      danger
                      disabled={deleteMutation.isPending}
                      onSelect={() => {
                        setIsMobileActionsOpen(false);
                        setIsDeleteDialogOpen(true);
                      }}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      {mealId && recipe ? (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          tone="danger"
          title="Usunąć przepis?"
          description={`"${recipe.name || headerData?.name || "Przepis"}" zniknie z historii. Tej akcji nie można cofnąć.`}
          confirmLabel="Usuń przepis"
          cancelLabel="Zostaw"
          pendingLabel="Usuwam..."
          isPending={deleteMutation.isPending}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => deleteMutation.deleteMeal(mealId)}
        />
      ) : null}

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
            <section className="relative isolate">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[45rem] overflow-hidden"
                aria-hidden="true"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
                }}
              >
                <div className="absolute -left-[10%] top-[-5%] h-[30rem] w-[50%] rounded-[100%] bg-accent/[0.22] blur-[120px] mix-blend-multiply dark:bg-accent/[0.18] dark:mix-blend-screen" />
                <div className="absolute -right-[5%] top-[5%] h-[35rem] w-[45%] rounded-[100%] bg-saffron/[0.2] blur-[130px] mix-blend-multiply dark:bg-saffron/[0.15] dark:mix-blend-screen" />
                <div className="absolute left-[15%] top-[15%] h-[25rem] w-[60%] rounded-[100%] bg-basil/[0.15] blur-[120px] mix-blend-multiply dark:bg-basil/[0.12] dark:mix-blend-screen" />
              </div>

              <motion.div className="relative z-10 mx-auto max-w-[1760px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
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
                />
              </motion.div>
            </section>
            <RecipeHeroSeparator />

            <div className="mx-auto max-w-[1760px] px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pt-4">
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start xl:grid-cols-[minmax(0,1fr)_520px] xl:gap-12 2xl:grid-cols-[minmax(0,1fr)_620px]">
                <aside className="order-1 space-y-8 lg:order-2 lg:self-stretch">
                  <NutritionSection nutrition={recipe.nutrition} />
                  <div className="lg:sticky lg:top-24">
                    <IngredientsSection
                      ingredients={recipe.ingredients}
                      allowShoppingList
                    />
                  </div>
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

    </div>
  );
}

function RecipeHeroSeparator() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden pb-6 pt-5 sm:pb-8 sm:pt-6"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border-strong/80 to-transparent dark:via-white/20" />
      <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/45 to-transparent dark:via-accent/30" />

      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
        <div className="h-1.5 w-1.5 rotate-45 bg-border-strong/80 dark:bg-white/25" />
        <div className="h-3 w-3 rotate-45 border border-accent bg-bg-elevated shadow-[0_0_18px_rgba(194,87,40,0.22)] dark:bg-bg" />
        <div className="h-1.5 w-1.5 rotate-45 bg-border-strong/80 dark:bg-white/25" />
      </div>
    </div>
  );
}

function MobileRecipeActionItem({
  danger = false,
  disabled,
  icon,
  label,
  onSelect,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "text-bordeaux hover:bg-bordeaux/10"
          : "text-ink-soft hover:bg-bg-sunken hover:text-ink"
      }`}
    >
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
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
