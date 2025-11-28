import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { generateMealSuggestions } from "../services/api";
import { MealCard } from "./MealCard";
import type { MealSuggestion, MealType } from "../types/meal";

const DEV_USER_ID = "e4d2ae12-7632-426d-86d1-417651604866";

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
  const { mutate, data, status, isError, error } = useMutation({
    mutationFn: () =>
      generateMealSuggestions({
        userId: DEV_USER_ID,
        mealType,
      }),
  });

  const mealsToDisplay = useMemo<MealSuggestion[] | null>(() => {
    if (!data) return null;
    return data.meals.slice(0, 3);
  }, [data]);

  const handleGenerate = () => mutate();

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300/70">
            AI Kitchen
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Generowanie Posiłków AI
          </h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            MealGenie dobierze przepisy dopasowane do Twoich preferencji. To
            może potrwać kilka sekund.
          </p>
        </div>
        <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100">
          Dev User
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-100">
          Wybierz typ posiłku
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
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-lg shadow-indigo-100/60 dark:border-indigo-400/80 dark:bg-indigo-500/20 dark:text-indigo-50 dark:shadow-indigo-900/40"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-indigo-400/50 dark:hover:text-white"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-200/80">
                  {option.label}
                </span>
                <span className="text-[12px] text-indigo-600 dark:text-indigo-100/80">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error instanceof Error
            ? error.message
            : "Nie udało się wygenerować posiłków."}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white/80 px-8 py-10 text-center shadow-lg shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-800/60">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Ups! Coś poszło nie tak przy generowaniu.
          </p>
          <p className="max-w-xl text-sm text-slate-700 dark:text-slate-300">
            Sprawdź połączenie i spróbuj ponownie uruchomić naszego kuchennego
            asystenta.
          </p>
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5 hover:shadow-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white/85 px-8 py-12 text-center shadow-lg shadow-indigo-100/50 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Gotowy na pomysły kuchni AI?
          </p>
          <p className="max-w-xl text-sm text-slate-700 dark:text-slate-300">
            Kliknij poniżej, a Szef Kuchni MealGenie przygotuje listę posiłków
            dopasowanych do Twoich preferencji i czasu.
          </p>
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5 hover:shadow-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            Generuj Posiłki
          </button>
        </div>
      )}

      {status === "pending" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-8 py-12 text-center text-indigo-800 shadow-lg shadow-indigo-100/60 dark:border-indigo-500/30 dark:bg-indigo-500/5 dark:text-indigo-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-300/70 border-t-transparent dark:border-indigo-400/60" />
          <p className="text-lg font-semibold">Twój szef kuchni myśli...</p>
          <p className="max-w-xl text-sm text-indigo-700 dark:text-indigo-100/80">
            Daj mu chwilę, aby dopracować listę przepisów specjalnie dla Ciebie.
            🍃
          </p>
        </div>
      )}

      {status === "success" && mealsToDisplay && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mealsToDisplay.map((meal, index) => (
              <MealCard
                key={`${meal.name}-${index}`}
                meal={meal}
                onSelect={() => console.log("Wybrano posiłek:", meal.name)}
              />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              className="text-sm font-semibold text-amber-700 underline-offset-4 hover:text-amber-800 hover:underline dark:text-amber-200 dark:hover:text-amber-100"
            >
              Wylosuj inne
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
