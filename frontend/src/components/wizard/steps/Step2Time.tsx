import { Check } from "lucide-react";

import { Eyebrow } from "../../ui";
import { prepTimeOptions } from "../mealOptions";

// ============================================
// Krok 2: Ile masz czasu? (4 wielkie karty maks. czas)
// ============================================

type Step2TimeProps = {
  prepTime: number;
  onPrepTimeChange: (value: number) => void;
  isGuestMode: boolean;
  totalSteps: number;
};

export function Step2Time({
  prepTime,
  onPrepTimeChange,
  totalSteps,
}: Step2TimeProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="basil">Krok 2 z {totalSteps} · Tempo</Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Ile masz czasu?{" "}
          <span className="text-ink-soft">Wybierz tempo gotowania.</span>
        </h2>
        <p className="max-w-3xl text-base leading-7 text-ink-soft">
          MealGenie dobierze przepisy mieszczące się w wybranym czasie - bez naciągania.
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Maksymalny czas gotowania</legend>
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          role="radiogroup"
          aria-label="Maksymalny czas gotowania"
        >
          {prepTimeOptions.map((option) => {
            const isActive =
              prepTime === option.value ||
              (option.value === 60 && prepTime > 60);
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onPrepTimeChange(option.value)}
                className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border p-5 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:min-h-[200px] ${
                  isActive
                    ? "border-accent bg-accent-soft text-ink shadow-[var(--shadow-accent)] ring-1 ring-accent/30"
                    : "border-border-strong bg-bg-elevated text-ink shadow-xs hover:-translate-y-0.5 hover:border-accent/70 hover:bg-bg hover:shadow-md"
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
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border transition ${
                    isActive
                      ? "border-accent/30 bg-bg-elevated text-accent-deep"
                      : "border-border bg-bg-sunken text-ink-soft group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:text-accent-deep"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-brand text-xl font-semibold leading-tight text-ink">
                  {option.label}
                </span>
                <span className="text-base leading-6 text-ink-soft">
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
