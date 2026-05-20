import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

import { MealCard } from "../MealCard";
import { Button, FolkDivider, HandwrittenKicker } from "../ui";
import type { MealSuggestion } from "../../types/meal";
import {
  successIconVariants,
  successItem,
  successStagger,
  viewVariants,
} from "./wizardMotion";

// ============================================
// View "success" - 3 karty MealCard + CTA (regenerate / reset / guest)
// ============================================

type SuccessViewProps = {
  meals: MealSuggestion[];
  isGuestMode: boolean;
  onReset: () => void;
  onRegenerate: () => void;
  onGuestCta: () => void;
  onSelectMeal: (meal: MealSuggestion) => void;
};

export function SuccessView({
  meals,
  isGuestMode,
  onReset,
  onRegenerate,
  onGuestCta,
  onSelectMeal,
}: SuccessViewProps) {
  return (
    <motion.div
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <motion.div
          variants={successIconVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill border border-basil/30 bg-basil-soft text-basil shadow-sm"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-3"
        >
          <HandwrittenKicker>~ z Twojej lodówki ~</HandwrittenKicker>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {isGuestMode
              ? "Gotowe! Oto darmowy podgląd"
              : `${meals.length} pomysły na dziś`}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-ink-soft">
            {isGuestMode
              ? "To wersja pokazowa bez personalizacji. Załóż konto, aby zapisać plan i przejść do pełnych przepisów."
              : "Szef kuchni skończył pracę. Oto propozycje dopasowane do Ciebie:"}
          </p>
          <FolkDivider className="mx-auto max-w-56 text-border-strong" />
        </motion.div>
      </div>

      <motion.div
        variants={successStagger}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {meals.map((meal, index) => (
          <motion.div key={`${meal.name}-${index}`} variants={successItem}>
            <MealCard
              meal={meal}
              onSelect={() => onSelectMeal(meal)}
              showAction={!isGuestMode}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 pt-4"
      >
        {isGuestMode && (
          <Button
            onClick={onGuestCta}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="rounded-lg"
          >
            Załóż konto i gotuj dalej
          </Button>
        )}
        <Button
          onClick={onRegenerate}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="rounded-lg"
        >
          Generuj ponownie
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="rounded-lg"
        >
          {isGuestMode
            ? "Wróć i zmień parametry podglądu"
            : "Wróć do generatora i zmień parametry"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
