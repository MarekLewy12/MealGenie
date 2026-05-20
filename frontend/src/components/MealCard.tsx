import { ArrowRight, Clock3, Flame, Gauge, ListChecks } from "lucide-react";

import type { MealSuggestion } from "../types/meal";
import { Badge, Button, MealEmoji } from "./ui";

type MealCardProps = {
  meal: MealSuggestion;
  onSelect: () => void;
  showAction?: boolean;
  variant?: "default" | "premium";
};

const difficultyBadgeVariant: Record<
  MealSuggestion["difficulty"],
  "basil" | "saffron" | "danger"
> = {
  Easy: "basil",
  Medium: "saffron",
  Hard: "danger",
};

const difficultyLabel: Record<MealSuggestion["difficulty"], string> = {
  Easy: "łatwe",
  Medium: "średnie",
  Hard: "trudne",
};

export function MealCard({
  meal,
  onSelect,
  showAction = true,
  variant = "default",
}: MealCardProps) {
  const displayedIngredients = meal.ingredients.slice(0, 4);
  const remainingCount = meal.ingredients.length - displayedIngredients.length;
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageSrc = meal.imageUrl?.startsWith("/meal-images/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal.imageUrl;
  const isPremium = variant === "premium";

  const innerContent = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-sunken sm:aspect-[16/10]">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={`Zdjęcie dania: ${meal.name}`}
              className="h-full w-full object-cover brightness-[0.94] contrast-[1.04] saturate-[1.04] transition duration-slow ease-out group-hover:scale-[1.025]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-sunken">
            <MealEmoji size="lg" fallback="MG" className="h-20 w-20 text-2xl text-accent" />
          </div>
        )}
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-bg-elevated/92 px-2.5 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur">
            <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {meal.cookingTimeMinutes} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-bg-elevated/92 px-2.5 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur">
            <Flame className="h-3.5 w-3.5 text-saffron" aria-hidden="true" />
            {meal.calories ? `${meal.calories} kcal` : "kcal n/d"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-accent">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            {difficultyLabel[meal.difficulty]}
          </div>
          <h3 className="font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
            {meal.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">
            {meal.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant={difficultyBadgeVariant[meal.difficulty]}>
              {difficultyLabel[meal.difficulty]}
            </Badge>
            <Badge variant="neutral">{meal.cookingTimeMinutes} min</Badge>
            <Badge variant="accent">
              {meal.calories ? `${meal.calories} kcal` : "kcal n/d"}
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-bg/65 p-4">
            <div className="mb-3 flex items-center gap-2 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-accent">
              <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
              Główne składniki
            </div>
            <ul className="flex flex-wrap gap-2" role="list">
              {displayedIngredients.map((ingredient, index) => (
                <li key={`${ingredient.name}-${index}`}>
                  <span className="inline-flex max-w-full items-center rounded-pill border border-border bg-bg-elevated px-2.5 py-1 text-xs font-semibold leading-none text-ink-soft">
                    <span className="truncate">{ingredient.name}</span>
                  </span>
                </li>
              ))}
              {remainingCount > 0 && (
                <li className="inline-flex items-center rounded-pill bg-bg-sunken px-2.5 py-1 text-xs font-semibold leading-none text-ink-muted">
                  + {remainingCount} więcej
                </li>
              )}
            </ul>
          </div>

          {showAction && (
            <div className="pt-1">
              <Button
                onClick={onSelect}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full rounded-lg shadow-accent"
              >
                Rozwiń w pełny przepis
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isPremium) {
    return (
      <div className="group relative flex h-full w-full flex-col rounded-[14px] p-[2px] shadow-[0_18px_48px_-38px_rgba(32,37,31,0.62),0_0_34px_-24px_rgba(232,111,69,0.32)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_24px_56px_-42px_rgba(32,37,31,0.58),0_0_46px_-26px_rgba(232,111,69,0.45)]">
        <div
          aria-hidden="true"
          className="hero-card-border-flow absolute inset-0 rounded-[14px] opacity-95 dark:opacity-100"
        />
        <div
          aria-hidden="true"
          className="hero-card-border-glow absolute inset-[-10px] rounded-[18px] opacity-15 blur-xl transition duration-300 group-hover:opacity-30 dark:opacity-45 dark:group-hover:opacity-70"
        />

        <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-bg-elevated text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] transition duration-300 ease-out dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
          {innerContent}
        </article>
      </div>
    );
  }

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-border bg-bg-elevated text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] transition duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_56px_-42px_rgba(32,37,31,0.58),0_0_46px_-26px_rgba(232,111,69,0.4)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
      {innerContent}
    </article>
  );
}
