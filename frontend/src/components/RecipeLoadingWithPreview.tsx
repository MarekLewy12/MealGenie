import { motion } from "framer-motion";
import { Scale, Users } from "lucide-react";

import type { MealSuggestion, RecipeGenerationContext } from "../types/meal";
import { formatRecipeContextPrimaryLabel } from "../utils/recipeGenerationContext";

type Props = {
  teaser?: MealSuggestion | null;
  recipeContext?: RecipeGenerationContext;
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-bg-sunken ${className}`} />;
}

export function RecipeLoadingWithPreview({ teaser, recipeContext }: Props) {
  const recipeContextLabel = formatRecipeContextPrimaryLabel(recipeContext);
  const RecipeContextIcon =
    recipeContext?.portionMode === "weight" ? Scale : Users;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-[1760px]"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">
        {teaser
          ? `Generuję pełny przepis dla: ${teaser.name}.`
          : "Generuję pełny przepis."}
      </span>

      <div className="overflow-hidden rounded-b-[2rem] border-x-0 border-b border-border bg-bg-elevated shadow-lg lg:grid lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[300px] overflow-hidden bg-bg-sunken sm:min-h-[400px] lg:min-h-[560px]">
          <SkeletonBlock className="absolute inset-0 h-full w-full rounded-none" />
          <div className="absolute left-5 top-5 h-7 w-36 animate-pulse rounded-pill bg-bg-elevated/80" />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <SkeletonBlock className="h-6 w-32 rounded-pill" />
          <SkeletonBlock className="mt-5 h-10 w-4/5 sm:h-14" />
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/4" />

          {recipeContextLabel ? (
            <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-pill border border-border bg-bg-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted">
              <RecipeContextIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {recipeContext.portionMode === "weight"
                  ? `Dopasowuję do ${recipeContextLabel}`
                  : recipeContextLabel}
              </span>
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-2 divide-x divide-y divide-border border-y border-border py-4 md:grid-cols-4 md:divide-y-0">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex min-h-[82px] flex-col items-center justify-center gap-2 px-3 py-3"
              >
                <SkeletonBlock className="h-3 w-16" />
                <SkeletonBlock className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12">
          <aside className="order-1 space-y-8 lg:order-2">
            <section>
              <SkeletonBlock className="mb-4 h-6 w-40" />
              <div className="grid grid-cols-2 overflow-hidden rounded-[1.25rem] border border-border bg-bg-elevated md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="border-border p-5">
                    <SkeletonBlock className="mx-auto h-1 w-8 rounded-pill" />
                    <SkeletonBlock className="mx-auto mt-4 h-7 w-16" />
                    <SkeletonBlock className="mx-auto mt-3 h-3 w-20" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SkeletonBlock className="mb-4 h-6 w-32" />
              <div className="space-y-5 rounded-[1.25rem] border border-border bg-bg-elevated p-5 sm:p-7">
                {[0, 1, 2].map((group) => (
                  <div
                    key={group}
                    className="border-b border-dotted border-border-dotted pb-5 last:border-0 last:pb-0"
                  >
                    <SkeletonBlock className="mb-4 h-4 w-28" />
                    <div className="space-y-3">
                      {[0, 1, 2].map((line) => (
                        <div key={line} className="flex items-center gap-3">
                          <SkeletonBlock className="h-4 flex-1" />
                          <SkeletonBlock className="h-4 w-14" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="order-2 space-y-8 lg:order-1">
            <SkeletonBlock className="h-7 w-44" />
            <div className="relative ml-4 space-y-10 border-l-2 border-dotted border-border-strong/60 pl-8">
              {[0, 1, 2, 3, 4].map((step) => (
                <div key={step} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[49px] top-0 h-8 w-8 rounded-full bg-accent-soft ring-4 ring-bg"
                  />
                  <SkeletonBlock className="h-6 w-2/3" />
                  <SkeletonBlock className="mt-4 h-4 w-full" />
                  <SkeletonBlock className="mt-2 h-4 w-11/12" />
                  <SkeletonBlock className="mt-2 h-4 w-3/4" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
