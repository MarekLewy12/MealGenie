import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  PenLine,
  Refrigerator,
  RefreshCw,
  Sparkles,
  Scale,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { generateMealSuggestions } from "../services/api";
import { LoadingExperience } from "./LoadingExperience";
import { MealCard } from "./MealCard";
import { TagInput } from "./TagInput";
import type { MealSuggestion, MealType, PortionMode } from "../types/meal";

const mealTypeOptions: Array<{
  value: MealType;
  label: string;
  hint: string;
}> = [
  { value: "BREAKFAST", label: "Śniadanie", hint: "lekko i szybko" },
  { value: "LUNCH", label: "Lunch/Obiad", hint: "mocno i treściwie" },
  { value: "DINNER", label: "Kolacja", hint: "wieczorne inspiracje" },
  { value: "SNACK", label: "Przekąska", hint: "małe co nieco" },
  { value: "DESSERT", label: "Deser", hint: "słodkie inspiracje 🍰" },
];

const mealTypeValues = new Set<MealType>(
  mealTypeOptions.map((option) => option.value),
);

type GeneratorView = "form" | "loading" | "success" | "error";

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const successIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

type SuccessViewProps = {
  meals: MealSuggestion[];
  onReset: () => void;
  onSelectMeal: (meal: MealSuggestion) => void;
};

function SuccessView({ meals, onReset, onSelectMeal }: SuccessViewProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div className="space-y-4 text-center">
        <motion.div
          variants={successIconVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gotowe! 🎉
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Szef kuchni skończył pracę. Oto propozycje dopasowane do Ciebie:
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {meals.map((meal, index) => (
          <motion.div key={`${meal.name}-${index}`} variants={staggerItem}>
            <MealCard
              meal={meal}
              onSelect={() => onSelectMeal(meal)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={onReset}
          className="group flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Wróć do generatora i spróbuj ponownie
        </button>
      </motion.div>
    </motion.div>
  );
}

export function MealGenerator() {
  const [mealType, setMealType] = useState<MealType>("LUNCH");
  const [prepTime, setPrepTime] = useState(30);
  const [servingSize, setServingSize] = useState(2);
  const [userPrompt, setUserPrompt] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isThermomixMode, setIsThermomixMode] = useState(false);
  const [view, setView] = useState<GeneratorView>("form");
  const [portionMode, setPortionMode] = useState<PortionMode>("servings");
  const [targetWeight, setTargetWeight] = useState(250);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate, data, error } = useMutation({
    mutationFn: () =>
      generateMealSuggestions({
        mealType,
        prepTime,
        servingSize: portionMode === "servings" ? servingSize : undefined,
        targetWeightGrams: portionMode === "weight" ? targetWeight : undefined,
        userPrompt: userPrompt.length > 0 ? userPrompt : undefined,
        availableIngredients: ingredients,
        useEquipment: isThermomixMode ? ["THERMOMIX"] : [],
      }),
    onSuccess: () => {
      setTimeout(() => setView("success"), 500);
    },
    onError: () => {
      setView("error");
    },
  });

  const handleGenerate = () => {
    setView("loading");
    mutate();
  };

  const handleBackToForm = () => {
    setView("form");
  };

  useEffect(() => {
    const mealTypeParam = searchParams.get("mealType");
    const prepTimeParam = searchParams.get("prepTime");
    const servingSizeParam = searchParams.get("servingSize");

    if (mealTypeParam && mealTypeValues.has(mealTypeParam as MealType)) {
      setMealType(mealTypeParam as MealType);
    }
    if (prepTimeParam) {
      const parsedPrepTime = Number(prepTimeParam);
      if (Number.isFinite(parsedPrepTime)) {
        setPrepTime(Math.min(120, Math.max(15, parsedPrepTime)));
      }
    }
    if (servingSizeParam) {
      const parsedServingSize = Number(servingSizeParam);
      if (Number.isFinite(parsedServingSize)) {
        setServingSize(Math.min(10, Math.max(1, parsedServingSize)));
      }
    }
  }, [searchParams]);

  const LoadingSkeletons = () => (
    <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col gap-4 rounded-2xl border border-indigo-100/70 bg-white/90 p-6 shadow-lg shadow-indigo-100/50 dark:border-indigo-500/20 dark:bg-slate-900/80 dark:shadow-slate-950/40"
        >
          <div className="h-48 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/60" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200/80 dark:bg-slate-700/60" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-700/50" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50 md:p-8">
      <AnimatePresence mode="wait">
        {view === "form" && (
          <motion.div
            key="generator-form"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300/70">
                AI Kitchen
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Kreator Posiłków
              </h2>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                Opisz na co masz ochotę lub podaj składniki, a AI zrobi resztę.
              </p>
            </div>

            <div className="mb-8 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <PenLine className="h-4 w-4 text-indigo-500" />
                  Na co masz dzisiaj ochotę? (Opcjonalne)
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="np. Coś lekkiego po treningu, mam ochotę na kuchnię azjatycką..."
                  className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Refrigerator className="h-4 w-4 text-indigo-500" />
                  Jakie składniki posiadasz?
                </div>
                <TagInput
                  label=""
                  placeholder="Wpisz składnik i naciśnij Enter (np. kurczak, ryż)"
                  value={ingredients}
                  onChange={setIngredients}
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-900/10">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isThermomixMode ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700"}`}
                >
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Tryb Thermomix
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI przygotuje przepisy wykorzystujące robota.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsThermomixMode(!isThermomixMode)}
                className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isThermomixMode ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isThermomixMode ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 lg:grid-cols-3 lg:gap-4">
              <div className="min-w-0 w-full">
                <div className="mb-2 flex justify-between">
                  <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Maksymalny czas: {prepTime} min
                  </label>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Szybko (15m)</span>
                  <span>Uczta (2h)</span>
                </div>
              </div>

              <div className="min-w-0 w-full">
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Tryb porcji
                </label>
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={() => setPortionMode("servings")}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      portionMode === "servings"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                        : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    👨‍👩‍👧‍👦 Na osoby
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortionMode("weight")}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      portionMode === "weight"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                        : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Scale className="h-4 w-4" />
                    Na gramaturę
                  </button>
                </div>
              </div>

              <div className="min-w-0 w-full">
                {portionMode === "servings" ? (
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      Liczba osób: {servingSize}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setServingSize((s) => Math.max(1, s - 1))}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
                        {servingSize}
                      </span>
                      <button
                        type="button"
                        onClick={() => setServingSize((s) => Math.min(10, s + 1))}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      Docelowa waga
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={50}
                        max={5000}
                        step={50}
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(Number(e.target.value))}
                        className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        gramów
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      Idealne dla cukiernictwa i profesjonalnej gastronomii
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-100">
                Typ posiłku (priorytet)
              </p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {mealTypeOptions.map((option) => {
                  const isActive = option.value === mealType;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMealType(option.value)}
                      className={`flex cursor-pointer flex-col items-start rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        isActive
                          ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-md shadow-indigo-100/60 dark:border-indigo-400/80 dark:bg-indigo-500/20 dark:text-indigo-50"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-indigo-400/70 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
                        {option.label}
                      </span>
                      <span className="text-[10px] opacity-60">
                        {option.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleGenerate}
                className="group relative flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-base font-bold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-900/40 active:scale-95"
              >
                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Generuj Posiłki
              </button>
              <p className="mt-3 text-xs text-slate-400">
                Kliknij, a AI połączy Twoje składniki z preferencjami.
              </p>
            </div>
          </motion.div>
        )}

        {view === "loading" && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LoadingExperience />
            <LoadingSkeletons />
          </motion.div>
        )}

        {view === "success" && data?.meals && (
          <SuccessView
            key="success"
            meals={data.meals}
            onReset={handleBackToForm}
            onSelectMeal={(meal) =>
              navigate("/recipe", { state: { teaser: meal } })
            }
          />
        )}

        {view === "error" && (
          <motion.div
            key="error"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20"
            >
              <XCircle className="h-10 w-10 text-red-500" />
            </motion.div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Ups! Coś poszło nie tak 😅
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {error instanceof Error
                  ? error.message
                  : "Nie udało się wygenerować posiłków."}
              </p>
            </div>

            <button
              onClick={handleBackToForm}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <RefreshCw className="h-4 w-4" />
              Spróbuj ponownie
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
