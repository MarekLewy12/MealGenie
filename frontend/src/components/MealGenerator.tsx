import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Refrigerator, PenLine } from "lucide-react";

import { generateMealSuggestions } from "../services/api";
import { MealCard } from "./MealCard";
import { TagInput } from "./TagInput";
import type { MealSuggestion, MealType } from "../types/meal";

const mealTypeOptions: Array<{
  value: MealType;
  label: string;
  hint: string;
}> = [
  { value: "BREAKFAST", label: "Śniadanie", hint: "lekko i szybko" },
  { value: "LUNCH", label: "Lunch/Obiad", hint: "mocno i treściwie" },
  { value: "DINNER", label: "Kolacja", hint: "wieczorne inspiracje" },
  { value: "SNACK", label: "Przekąska", hint: "małe co nieco" },
];

export function MealGenerator() {
  const [mealType, setMealType] = useState<MealType>("LUNCH");
  const [prepTime, setPrepTime] = useState(30);
  const [servingSize, setServingSize] = useState(2);
  const [userPrompt, setUserPrompt] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const { mutate, data, status, isError, error } = useMutation({
    mutationFn: () =>
      generateMealSuggestions({
        mealType,
        prepTime,
        servingSize,
        userPrompt: userPrompt.length > 0 ? userPrompt : undefined,
        availableIngredients: ingredients,
      }),
  });

  const mealsToDisplay = useMemo<MealSuggestion[] | null>(() => {
    if (!data) return null;
    return data.meals.slice(0, 3);
  }, [data]);

  const handleGenerate = () => mutate();

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50 md:p-8">
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
            Co masz w lodówce?
          </div>
          <TagInput
            label=""
            placeholder="Wpisz składnik i naciśnij Enter (np. kurczak, ryż)"
            value={ingredients}
            onChange={setIngredients}
          />
        </div>
      </div>

      <div className="mb-8 grid gap-6 rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 md:grid-cols-2">
        <div>
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

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Liczba osób: {servingSize}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServingSize((s) => Math.max(1, s - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
              {servingSize}
            </span>
            <button
              type="button"
              onClick={() => setServingSize((s) => Math.min(10, s + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-100">
          Typ posiłku (priorytet)
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {mealTypeOptions.map((option) => {
            const isActive = option.value === mealType;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setMealType(option.value)}
                className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  isActive
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-md shadow-indigo-100/60 dark:border-indigo-400/80 dark:bg-indigo-500/20 dark:text-indigo-50"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-indigo-400/50"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
                  {option.label}
                </span>
                <span className="text-[10px] opacity-60">{option.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error instanceof Error
            ? error.message
            : "Nie udało się wygenerować posiłków."}
        </div>
      )}

      {status === "idle" || status === "success" || status === "error" ? (
        <div className="flex flex-col items-center">
          <button
            onClick={handleGenerate}
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-base font-bold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-900/40 active:scale-95"
          >
            <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            Generuj Posiłki
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Kliknij, a AI połączy Twoje składniki z preferencjami.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-8 py-8 text-center text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/5 dark:text-indigo-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-300/70 border-t-transparent dark:border-indigo-400/60" />
          <p className="font-semibold">Tworzę magię...</p>
        </div>
      )}

      {status === "success" && mealsToDisplay && (
        <div className="mt-12 animate-fade-in-up space-y-8 border-t border-slate-100 pt-8 dark:border-slate-800">
          <h3 className="text-center text-xl font-bold text-slate-900 dark:text-white">
            Oto propozycje szefa kuchni:
          </h3>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mealsToDisplay.map((meal, index) => (
              <MealCard
                key={`${meal.name}-${index}`}
                meal={meal}
                onSelect={() => console.log("Wybrano posiłek:", meal.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
