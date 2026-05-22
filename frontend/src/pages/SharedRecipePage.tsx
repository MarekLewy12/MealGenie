import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Refrigerator,
  Scale,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  IngredientsSection,
  NutritionSection,
  StepsSection,
  SuggestionCard,
  TipsSection,
} from "../components/recipe/RecipeSections";
import { RecipeHero } from "../components/recipe/RecipeHero";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Card, Eyebrow } from "../components/ui";
import { getSharedMeal } from "../services/api";
import type { FullRecipe } from "../types/meal";
import {
  formatRecipeContextPrimaryLabel,
} from "../utils/recipeGenerationContext";

export function SharedRecipePage() {
  const { shareId } = useParams<{ shareId: string }>();

  const { data: meal, isLoading, isError, error } = useQuery({
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

  const errorCode = getApiErrorCode(error);
  const isSharedNotFound = isError && errorCode === "SHARED_MEAL_NOT_FOUND";
  const totalTime = recipe?.totalTimeMinutes || meal?.estimatedTime || 0;
  const difficultyLabel =
    recipe?.difficulty === "Easy"
      ? "Łatwe"
      : recipe?.difficulty === "Medium"
        ? "Średnie"
        : "Trudne";
  const portionStatLabel =
    recipe?.generationContext?.portionMode === "weight" ? "Waga" : "Porcje";
  const PortionStatIcon =
    recipe?.generationContext?.portionMode === "weight" ? Scale : Users;
  const portionStatValue =
    formatRecipeContextPrimaryLabel(recipe?.generationContext) ??
    (recipe?.servings ? `${recipe.servings}` : "—");

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-ink">
        <Logo className="mb-8 scale-90" />
        <Card className="flex w-full max-w-sm flex-col items-center gap-4 border-dashed border-border-strong bg-bg-sunken p-8 text-center">
          <Loader2
            className="h-10 w-10 animate-spin text-accent"
            aria-hidden="true"
          />
          <div>
            <Eyebrow tone="accent">Udostępniony przepis</Eyebrow>
            <p className="mt-2 font-serif text-2xl font-medium">
              Otwieram kartkę...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !meal || !recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center text-ink">
        <Logo className="mb-8 scale-90" />
        <Card className="w-full max-w-md border-bordeaux/30 bg-accent-soft p-8 text-bordeaux shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-bg-elevated text-bordeaux shadow-sm">
            <UtensilsCrossed className="h-7 w-7" aria-hidden="true" />
          </div>
          <Eyebrow className="mt-5 block text-bordeaux/80">
            {isSharedNotFound ? "Brak dostępu" : "Błąd ładowania"}
          </Eyebrow>
          <h1 className="mt-2 font-serif text-3xl font-medium text-ink">
            Przepis niedostępny
          </h1>
          <p className="mt-3 text-ink-soft">
            Ten link mógł wygasnąć albo autor wyłączył jego udostępnianie.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-pill border border-accent bg-accent px-5 py-2.5 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Wróć do MealGenie
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-bg-elevated/90 shadow-xs backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            aria-label="MealGenie - strona główna"
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            <Logo className="scale-90 origin-left" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="shared-recipe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 lg:space-y-12"
          >
            <RecipeHero
              title={meal.name}
              description={meal.description || undefined}
              imageUrl={imageUrl}
              badgeLabel="Udostępniony przepis"
              badgeVariant="accent"
              kickerText="przepis od znajomego"
              stats={{
                totalTime,
                difficultyLabel,
                calories: recipe.nutrition?.calories,
                portionLabel: portionStatLabel,
                portionValue: portionStatValue,
                PortionIcon: PortionStatIcon,
              }}
            />

            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-12">
              <aside className="order-1 space-y-8 lg:order-2 lg:self-stretch">
                <NutritionSection nutrition={recipe.nutrition} />
                <div className="lg:sticky lg:top-24">
                  <IngredientsSection
                    ingredients={recipe.ingredients}
                    allowShoppingList={false}
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="mt-12 overflow-hidden rounded-[1.5rem] border border-accent/20 bg-[linear-gradient(135deg,var(--bg-elevated),var(--bg-elevated)_64%,var(--accent-soft))] p-8 text-center shadow-lg dark:bg-[linear-gradient(135deg,var(--bg-elevated),var(--bg-elevated)_72%,rgba(194,87,40,0.1))] sm:p-12"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-accent/10 bg-accent-soft text-accent shadow-sm">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                    Chcesz więcej trafionych przepisów?
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-ink-soft">
                    MealGenie dobierze posiłki idealnie pod to, co masz w
                    lodówce, ile masz czasu i na co masz dziś ochotę.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                      to="/try"
                      className="inline-flex min-h-12 items-center justify-center rounded-pill border border-accent bg-accent px-8 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    >
                      Wypróbuj za darmo
                    </Link>
                    <Link
                      to="/login?mode=register"
                      className="inline-flex min-h-12 items-center justify-center rounded-pill border border-border-strong bg-bg-elevated px-8 text-sm font-semibold leading-none text-ink shadow-sm transition duration-fast ease-out hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    >
                      Załóż profil
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function getApiErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const maybeResponse = error as { response?: { data?: { code?: unknown } } };
  return typeof maybeResponse.response?.data?.code === "string"
    ? maybeResponse.response.data.code
    : undefined;
}
