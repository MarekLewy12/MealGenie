import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

import { generateMealSuggestions } from "../services/api";
import { MealCard } from "./MealCard";
import type { MealSuggestion } from "../types/meal";

const DEV_USER_ID = "e4d2ae12-7632-426d-86d1-417651604866";

export function MealGenerator() {
  const { mutate, data, status, isError, error } = useMutation({
    mutationFn: () => generateMealSuggestions(DEV_USER_ID),
  });

  const mealsToDisplay = useMemo<MealSuggestion[] | null>(() => {
    if (!data) return null;
    return data.meals.slice(0, 3);
  }, [data]);

  const handleGenerate = () => mutate();

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/70">
            AI Kitchen
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Generowanie Posiłków AI
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            MealGenie dobierze przepisy dopasowane do Twoich preferencji. To
            może potrwać kilka sekund.
          </p>
        </div>
        <div className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-100">
          Dev User
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error instanceof Error
            ? error.message
            : "Nie udało się wygenerować posiłków."}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-800 bg-slate-800/60 px-8 py-10 text-center">
          <p className="text-lg font-semibold text-white">
            Ups! Coś poszło nie tak przy generowaniu.
          </p>
          <p className="max-w-xl text-sm text-slate-300">
            Sprawdź połączenie i spróbuj ponownie uruchomić naszego kuchennego
            asystenta.
          </p>
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-900/50 transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 px-8 py-12 text-center">
          <p className="text-lg font-semibold text-white">
            Gotowy na pomysły kuchni AI?
          </p>
          <p className="max-w-xl text-sm text-slate-300">
            Kliknij poniżej, a Szef Kuchni MealGenie przygotuje listę posiłków
            dopasowanych do Twoich preferencji i czasu.
          </p>
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-900/50 transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Generuj Posiłki
          </button>
        </div>
      )}

      {status === "pending" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-8 py-12 text-center text-indigo-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-400/60 border-t-transparent" />
          <p className="text-lg font-semibold">Twój szef kuchni myśli...</p>
          <p className="max-w-xl text-sm text-indigo-100/80">
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
              className="text-sm font-semibold text-indigo-200 underline-offset-4 hover:text-indigo-100 hover:underline"
            >
              Wylosuj inne
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
