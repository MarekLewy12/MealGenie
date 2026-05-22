import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, Flame, Gauge, ListChecks } from "lucide-react";

import type { MealSuggestion } from "../types/meal";
import { Badge, Button, MealEmoji } from "./ui";

type MealCardProps = {
  meal: MealSuggestion;
  onSelect: () => void;
  showAction?: boolean;
  variant?: "default" | "premium";
  showAllIngredients?: boolean;
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
  showAllIngredients = false,
}: MealCardProps) {
  const displayedIngredients = meal.ingredients.slice(0, 4);
  const hiddenIngredients = meal.ingredients.slice(4);
  const remainingCount = meal.ingredients.length - displayedIngredients.length;
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageSrc = meal.imageUrl?.startsWith("/meal-images/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal.imageUrl;
  const isPremium = variant === "premium";

  const innerContent = (
    <>
      <motion.div
        layout
        className="relative aspect-[4/3] w-full overflow-hidden bg-bg-sunken sm:aspect-[16/10]"
      >
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={`Zdjęcie dania: ${meal.name}`}
              className="h-full w-full object-cover brightness-[0.94] contrast-[1.04] saturate-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-sunken">
            <MealEmoji
              size="lg"
              fallback="MG"
              className="h-20 w-20 text-2xl text-accent"
            />
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
      </motion.div>

      <motion.div layout className="flex flex-1 flex-col p-5 sm:p-6">
        <motion.div layout className="min-w-0">
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
        </motion.div>

        <motion.div layout className="mt-auto flex flex-col gap-4 pt-6">
          <motion.div layout className="flex flex-wrap gap-2">
            <Badge variant={difficultyBadgeVariant[meal.difficulty]}>
              {difficultyLabel[meal.difficulty]}
            </Badge>
            <Badge variant="neutral">{meal.cookingTimeMinutes} min</Badge>
            <Badge variant="accent">
              {meal.calories ? `${meal.calories} kcal` : "kcal n/d"}
            </Badge>
          </motion.div>

          <motion.div layout className="relative flex flex-col rounded-lg border border-border bg-bg-sunken p-4 transition-colors duration-300 group-hover:border-accent/20 group-hover:bg-bg/70 group-focus-within:border-accent/30 group-focus-within:bg-bg/70">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-accent">
                <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                Składniki ({meal.ingredients.length})
              </div>
            </div>

            <ul className="flex flex-col text-sm" role="list">
              {displayedIngredients.map((ingredient, index) => (
                <li
                  key={`displayed-${ingredient.name}-${index}`}
                  className="flex items-baseline justify-between gap-4 border-b border-border/40 py-2.5 first:pt-0 last:border-0 last:pb-0"
                >
                  <span className="text-ink-soft">{ingredient.name}</span>
                  <span className="shrink-0 text-xs font-medium text-ink-muted">
                    {ingredient.amount}
                  </span>
                </li>
              ))}

              <AnimatePresence initial={false}>
                {!showAllIngredients && remainingCount > 0 && (
                  <motion.li
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 text-center text-xs font-medium italic text-ink-muted"
                  >
                    ... i {remainingCount} innych składników
                  </motion.li>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {showAllIngredients && remainingCount > 0 && (
                  <motion.li
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col">
                      {hiddenIngredients.map((ingredient, index) => (
                        <li
                          key={`hidden-${ingredient.name}-${index}`}
                          className="flex items-baseline justify-between gap-4 border-b border-border/40 py-2.5 last:border-0 last:pb-0"
                        >
                          <span className="text-ink-soft">
                            {ingredient.name}
                          </span>
                          <span className="shrink-0 text-xs font-medium text-ink-muted">
                            {ingredient.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                )}
              </AnimatePresence>
            </ul>
          </motion.div>

          {showAction && (
            <motion.div layout className="pt-1">
              <Button
                onClick={onSelect}
                rightIcon={
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5" />
                }
                className="w-full rounded-lg shadow-accent transition duration-300 group-hover:bg-accent-hover group-hover:shadow-[var(--shadow-accent)] group-focus-within:bg-accent-hover group-focus-within:shadow-[var(--shadow-accent)]"
              >
                Rozwiń w pełny przepis
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );

  if (isPremium) {
    return (
      <motion.div
        layout
        className="group relative flex h-full w-full flex-col rounded-[14px] p-[2px] shadow-[0_18px_48px_-38px_rgba(32,37,31,0.62),0_0_34px_-24px_rgba(232,111,69,0.32)] outline-none transition-shadow duration-300 ease-out hover:shadow-[0_22px_54px_-42px_rgba(32,37,31,0.56),0_0_42px_-28px_rgba(232,111,69,0.4)] focus-within:shadow-[0_22px_54px_-42px_rgba(32,37,31,0.56),0_0_42px_-28px_rgba(232,111,69,0.4)]"
      >
        <motion.div
          layout
          aria-hidden="true"
          className="hero-card-border-flow absolute inset-0 rounded-[14px] opacity-95 dark:opacity-100"
        />
        <motion.div
          layout
          aria-hidden="true"
          className="hero-card-border-glow absolute inset-[-10px] rounded-[18px] opacity-15 blur-xl transition-opacity duration-300 group-hover:opacity-40 group-focus-within:opacity-40 dark:opacity-45 dark:group-hover:opacity-65 dark:group-focus-within:opacity-65"
        />

        <motion.article
          layout
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-bg-elevated text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
        >
          {innerContent}
        </motion.article>
      </motion.div>
    );
  }

  return (
    <motion.article
      layout
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-border bg-bg-elevated text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] transition duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_56px_-42px_rgba(32,37,31,0.58),0_0_46px_-26px_rgba(232,111,69,0.4)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
    >
      {innerContent}
    </motion.article>
  );
}
