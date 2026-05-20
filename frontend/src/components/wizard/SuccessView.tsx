import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

import { MealCard } from "../MealCard";
import { Button } from "../ui";
import type { MealSuggestion } from "../../types/meal";
import {
  successItem,
  successStagger,
  viewVariants,
} from "./wizardMotion";

type SuccessViewProps = {
  meals: MealSuggestion[];
  isGuestMode: boolean;
  onReset: () => void;
  onRegenerate: () => void;
  onGuestCta: () => void;
  onSelectMeal: (meal: MealSuggestion) => void;
};

const floatingElements = [
  {
    emoji: "🍅",
    top: "10%",
    left: "5%",
    delay: 0,
    duration: 15,
    size: "text-2xl",
    blur: "blur-sm",
    opacity: "opacity-15 dark:opacity-20",
    yMap: [0, -20, 10, 0],
    xMap: [0, 15, -10, 0],
    rotateMap: [0, 20, -10, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🌿",
    top: "40%",
    right: "8%",
    delay: 2,
    duration: 18,
    size: "text-xl",
    blur: "blur-[2px]",
    opacity: "opacity-20",
    yMap: [0, 25, -15, 0],
    xMap: [0, -10, 20, 0],
    rotateMap: [0, -30, 20, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🧅",
    top: "70%",
    left: "12%",
    delay: 1,
    duration: 16,
    size: "text-3xl",
    blur: "blur-sm",
    opacity: "opacity-10 dark:opacity-15",
    yMap: [0, -15, 20, 0],
    xMap: [0, 20, -15, 0],
    rotateMap: [0, 40, -10, 0],
    scaleMap: [0.95, 1.05, 0.95],
  },
  {
    emoji: "🧄",
    top: "85%",
    right: "15%",
    delay: 3,
    duration: 14,
    size: "text-2xl",
    blur: "blur-[1px]",
    opacity: "opacity-20",
    yMap: [0, -20, 15, 0],
    xMap: [0, -15, 10, 0],
    rotateMap: [0, -20, 15, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🥑",
    top: "25%",
    right: "18%",
    delay: 0.5,
    duration: 12,
    size: "text-3xl",
    blur: "blur-[1px]",
    opacity: "opacity-25",
    yMap: [0, -25, 15, 0],
    xMap: [0, -15, 10, 0],
    rotateMap: [0, -15, 20, 0],
    scaleMap: [1.05, 0.95, 1.05],
  },
  {
    emoji: "🥕",
    top: "55%",
    left: "20%",
    delay: 1.5,
    duration: 13,
    size: "text-4xl",
    blur: "blur-[1px]",
    opacity: "opacity-20",
    yMap: [0, 20, -20, 0],
    xMap: [0, 20, -10, 0],
    rotateMap: [0, 30, -15, 0],
    scaleMap: [0.95, 1.1, 0.95],
  },
  {
    emoji: "🍄",
    top: "15%",
    right: "35%",
    delay: 2.5,
    duration: 11,
    size: "text-2xl",
    blur: "blur-0",
    opacity: "opacity-30",
    yMap: [0, -15, 10, 0],
    xMap: [0, 10, -15, 0],
    rotateMap: [0, -20, 10, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🌶️",
    top: "45%",
    right: "3%",
    delay: 1,
    duration: 9,
    size: "text-5xl",
    blur: "blur-0",
    opacity: "opacity-30 dark:opacity-40",
    yMap: [0, 30, -15, 0],
    xMap: [0, -20, 15, 0],
    rotateMap: [0, 25, -20, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🍋",
    top: "80%",
    left: "3%",
    delay: 0,
    duration: 10,
    size: "text-5xl",
    blur: "blur-0",
    opacity: "opacity-25 dark:opacity-30",
    yMap: [0, -25, 15, 0],
    xMap: [0, 20, -15, 0],
    rotateMap: [0, -30, 15, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🥦",
    top: "30%",
    left: "4%",
    delay: 2,
    duration: 9.5,
    size: "text-4xl",
    blur: "blur-0",
    opacity: "opacity-30 dark:opacity-40",
    yMap: [0, -20, 20, 0],
    xMap: [0, -15, 20, 0],
    rotateMap: [0, 15, -15, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🧀",
    top: "65%",
    right: "25%",
    delay: 1.2,
    duration: 10.5,
    size: "text-3xl",
    blur: "blur-0",
    opacity: "opacity-25",
    yMap: [0, 20, -15, 0],
    xMap: [0, 15, -20, 0],
    rotateMap: [0, -20, 25, 0],
    scaleMap: [0.95, 1.05, 0.95],
  },
  {
    emoji: "🥖",
    top: "5%",
    left: "25%",
    delay: 3,
    duration: 14,
    size: "text-3xl",
    blur: "blur-sm",
    opacity: "opacity-20",
    yMap: [0, -15, 20, 0],
    xMap: [0, 10, -15, 0],
    rotateMap: [0, 20, -10, 0],
    scaleMap: [1, 1.05, 1],
  },
];

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
      className="relative flex w-full flex-col items-center space-y-5 pb-6 sm:space-y-6 sm:pb-8"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block">
        {floatingElements.map((element, index) => (
          <motion.div
            key={`${element.emoji}-${index}`}
            className={`absolute drop-shadow-sm grayscale-[0.1] ${element.size} ${element.blur} ${element.opacity}`}
            style={{
              top: element.top,
              left: "left" in element ? element.left : undefined,
              right: "right" in element ? element.right : undefined,
            }}
            animate={{
              y: element.yMap,
              x: element.xMap,
              rotate: element.rotateMap,
              scale: element.scaleMap,
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center pt-4 text-center sm:pt-7 lg:pt-8">
        <h2 className="font-brand text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-[3.25rem]">
          Trzy propozycje, <br className="hidden sm:block" />
          <span className="text-summary-gradient">wskaż swój smak</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          {isGuestMode
            ? "Oto darmowy podgląd. Załóż konto, aby wybrać danie, zapisać je i przejść do pełnego przepisu."
            : "Wybierz jeden wariant, a system ułoży pełny przepis krok po kroku."}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={onReset}
            variant="secondary"
            leftIcon={
              isGuestMode ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" />
              )
            }
            className="rounded-full border-border-strong bg-bg-elevated px-5 py-2.5 shadow-md hover:border-accent hover:bg-accent-soft"
          >
            {isGuestMode ? "Zmień parametry" : "Zmień założenia"}
          </Button>

          <Button
            onClick={onRegenerate}
            variant="primary"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="rounded-full px-5 py-2.5 shadow-accent"
          >
            Losuj nowe
          </Button>

          {isGuestMode && (
            <Button
              onClick={onGuestCta}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="rounded-full px-6 shadow-accent"
            >
              Załóż konto
            </Button>
          )}
        </div>
      </div>

      <motion.div
        variants={successStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-[1400px]"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal, index) => (
            <motion.div
              key={`${meal.name}-${index}`}
              variants={successItem}
              className="h-full"
            >
              <MealCard
                meal={meal}
                onSelect={() => onSelectMeal(meal)}
                showAction={!isGuestMode}
                variant="premium"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
