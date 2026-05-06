import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ChefHat,
  Flame,
  BookOpen,
  Clock,
  UtensilsCrossed,
} from "lucide-react";
import type { MealSuggestion } from "../types/meal";

const loadingStages = [
  { icon: Sparkles, text: "Analizuję składniki...", color: "text-accent" },
  {
    icon: Flame,
    text: "Przygotowuję instrukcje krok po kroku...",
    color: "text-saffron",
  },
  {
    icon: BookOpen,
    text: "Finalizuję przepis i wartości odżywcze...",
    color: "text-basil",
  },
];

type Props = {
  teaser?: MealSuggestion | null;
};

export function RecipeLoadingWithPreview({ teaser }: Props) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % loadingStages.length);
    }, 3000);

    return () => {
      clearInterval(stageInterval);
    };
  }, []);

  const currentStage = loadingStages[stageIndex];
  const StageIcon = currentStage.icon;

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageUrl = teaser?.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${teaser.imageUrl}`
    : teaser?.imageUrl;

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-16">
      {teaser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-md"
        >
          <div className="flex items-center gap-4 p-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={teaser.name}
                className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-brand text-lg font-semibold text-ink">
                {teaser.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                {teaser.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>{teaser.cookingTimeMinutes} min</span>
                {teaser.calories && (
                  <>
                    <span className="text-border-strong">•</span>
                    <span>{teaser.calories} kcal</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-dotted border-border-dotted bg-accent-soft px-5 py-2.5">
            <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
              MealGenie rozbudowuje ten przepis dla Ciebie...
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col items-center gap-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-accent"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.div
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent text-ink-inverse shadow-accent"
            animate={{
              boxShadow: [
                "var(--shadow-accent)",
                "0 18px 32px -10px rgba(194, 87, 40, 0.52)",
                "var(--shadow-accent)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChefHat className="h-12 w-12" />
          </motion.div>
        </div>

        <div className="h-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <StageIcon className={`h-5 w-5 ${currentStage.color}`} />
              <span className="text-base font-medium text-ink">
                {currentStage.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="w-full max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-bg-sunken">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "5%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 20, ease: "easeOut" }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Generowanie szczegółowego przepisu zajmuje ok. 15-25 sekund
        </p>
      </div>
    </div>
  );
}
