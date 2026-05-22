import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChefHat,
  Clock,
  Flame,
  Loader2,
  Scale,
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
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Badge, Card, Eyebrow, FolkDivider, MealEmoji } from "../components/ui";
import { getSharedMeal } from "../services/api";
import type { FullRecipe } from "../types/meal";
import {
  formatRecipeContextPrimaryLabel,
  getRecipeContextBadges,
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
  const recipeContextBadges = getRecipeContextBadges(recipe?.generationContext);
  const portionStatLabel =
    recipe?.generationContext?.portionMode === "weight" ? "Waga" : "Porcje";
  const portionStatValue =
    formatRecipeContextPrimaryLabel(recipe?.generationContext) ??
    (recipe?.servings ? `${recipe.servings}` : "—");
  const PortionStatIcon =
    recipe?.generationContext?.portionMode === "weight" ? Scale : Users;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-ink">
        <Card className="flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden="true" />
          <div>
            <Eyebrow>Udostępniony przepis</Eyebrow>
            <p className="mt-2 font-serif text-2xl font-medium">
              Otwieram kartkę z przepisem
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !meal || !recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-center text-ink">
        <Card className="w-full max-w-md p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-accent-soft text-accent-deep">
            <UtensilsCrossed className="h-7 w-7" aria-hidden="true" />
          </div>
          <Eyebrow className="mt-5 block">
            {isSharedNotFound ? "SHARED_MEAL_NOT_FOUND" : "Nie udało się otworzyć"}
          </Eyebrow>
          <h1 className="mt-3 font-serif text-3xl font-medium text-ink">
            Przepis nie został znaleziony
          </h1>
          <p className="mt-3 text-ink-soft">
            Ten link mógł wygasnąć albo udostępnianie zostało wyłączone.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover"
          >
            Przejdź do MealGenie
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border bg-bg-elevated/90 shadow-xs backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="MealGenie - strona główna">
            <Logo className="scale-90 origin-left" />
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <div className="grid overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative min-h-[230px] overflow-hidden sm:min-h-[320px] lg:min-h-[520px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={meal.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[230px] w-full items-center justify-center bg-accent-soft sm:min-h-[320px] lg:min-h-[520px]">
                <MealEmoji name={meal.name} size="lg" className="text-7xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-accent-deep/10 to-transparent" />
            <Badge variant="accent" className="absolute left-4 top-4 shadow-sm">
              Udostępniony przepis
            </Badge>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
            <Eyebrow>Publiczna kartka przepisu</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 font-brand text-3xl font-semibold leading-[1.05] text-ink sm:text-5xl"
            >
              {meal.name}
            </motion.h1>
            {meal.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
              >
                {meal.description}
              </motion.p>
            )}
            <FolkDivider className="my-5 max-w-48" />

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
                value={recipe.nutrition?.calories ? `${recipe.nutrition.calories} kcal` : "—"}
                color="orange"
              />
              <StatCard
                icon={PortionStatIcon}
                label={portionStatLabel}
                value={portionStatValue}
                color="green"
              />
            </div>
            {recipeContextBadges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {recipeContextBadges.map((badge) => (
                  <Badge key={badge} variant="neutral">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

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
              title="Jak podać"
              content={recipe.servingSuggestion}
            />
          )}

          {recipe.storageInfo && (
            <SuggestionCard
              icon={Sparkles}
              title="Przechowywanie"
              content={recipe.storageInfo}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg border border-border bg-bg-inverse p-8 text-center text-ink-inverse shadow-md"
          >
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-medium">
              Chcesz więcej przepisów?
            </h2>
            <p className="mt-2 text-ink-inverse/80">
              MealGenie tworzy przepisy dopasowane do Twoich preferencji, diety
              i składników, które masz pod ręką.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-accent bg-accent px-8 py-3 text-sm font-semibold text-ink-inverse shadow-accent transition hover:bg-accent-hover"
            >
              Wypróbuj za darmo
            </Link>
          </motion.div>
        </div>
      </div>
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
