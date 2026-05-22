import { Check } from "lucide-react";

import { Eyebrow } from "../../ui";
import type { MealType } from "../../../types/meal";
import { mealTypeOptions } from "../mealOptions";

// ============================================
// Krok 4: Co jemy? (5 wielkich kart typu posilku)
// ============================================

type Step4MealTypeProps = {
  mealType: MealType;
  onMealTypeChange: (value: MealType) => void;
  isGuestMode: boolean;
  displayStep: number;
  totalSteps: number;
};

export function Step4MealType({
  mealType,
  onMealTypeChange,
  displayStep,
  totalSteps,
}: Step4MealTypeProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="accent">
          Krok {displayStep} z {totalSteps} · Kierunek
        </Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Co jesz dzisiaj?{" "}
          <span className="text-ink-soft">Wybierz typ posiłku.</span>
        </h2>
        <p className="max-w-3xl text-base leading-7 text-ink-soft">
          Ostatni wybór - potem MealGenie pokaże 3 propozycje, z których
          wybierzesz jedną do rozwinięcia w pełny przepis.
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Typ posiłku</legend>
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4"
          role="radiogroup"
          aria-label="Typ posiłku"
        >
          {mealTypeOptions.map((option, index) => {
            const isActive = option.value === mealType;
            const isLast = index === mealTypeOptions.length - 1;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onMealTypeChange(option.value)}
                className={`group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:min-h-[180px] sm:p-5 ${
                  isActive
                    ? "border-accent bg-accent-soft text-ink shadow-[var(--shadow-accent)] ring-1 ring-accent/30"
                    : "border-border-strong bg-bg-elevated text-ink shadow-xs hover:-translate-y-0.5 hover:border-accent/70 hover:bg-bg hover:shadow-md"
                } ${
                  isLast
                    ? "col-span-2 sm:col-span-2 lg:col-span-1"
                    : "col-span-1"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-pill bg-accent text-ink-inverse shadow-sm"
                    aria-hidden="true"
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                )}
                <span className="text-4xl" aria-hidden="true">
                  {option.emoji}
                </span>
                <span className="font-brand text-lg font-semibold leading-tight text-ink">
                  {option.label}
                </span>
                <span className="text-sm leading-5 text-ink-soft">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
