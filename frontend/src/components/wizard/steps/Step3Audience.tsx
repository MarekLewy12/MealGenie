import { Check, ChefHat, Scale, Users } from "lucide-react";

import { Eyebrow } from "../../ui";
import { hungerLevelOptions } from "../mealOptions";
import type { PortionMode } from "../../../types/meal";

const MIN_TARGET_WEIGHT = 50;
const MAX_TARGET_WEIGHT = 5000;

function clampTargetWeight(value: number) {
  if (!Number.isFinite(value)) {
    return MIN_TARGET_WEIGHT;
  }

  return Math.min(MAX_TARGET_WEIGHT, Math.max(MIN_TARGET_WEIGHT, value));
}

// ============================================
// Krok 3: Dla kogo? (porcje + glod + Thermomix)
// ============================================

type Step3AudienceProps = {
  portionMode: PortionMode;
  onPortionModeChange: (mode: PortionMode) => void;
  servingSize: number;
  onServingSizeChange: (size: number) => void;
  targetWeight: number;
  onTargetWeightChange: (weight: number) => void;
  hungerLevel: number;
  onHungerLevelChange: (level: number) => void;
  isThermomixMode: boolean;
  onThermomixToggle: (value: boolean) => void;
};

export function Step3Audience({
  portionMode,
  onPortionModeChange,
  servingSize,
  onServingSizeChange,
  targetWeight,
  onTargetWeightChange,
  hungerLevel,
  onHungerLevelChange,
  isThermomixMode,
  onThermomixToggle,
}: Step3AudienceProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="saffron">Krok 3 z 4 · Personalizacja</Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Dla kogo gotujesz?{" "}
          <span className="text-ink-soft">Dopasujemy porcje.</span>
        </h2>
        <p className="max-w-xl text-base leading-7 text-ink-soft">
          Możesz przejść dalej - mamy sensowne wartości domyślne (2 osoby, standardowy apetyt).
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Tryb porcji */}
        <fieldset className="rounded-xl border border-border/60 bg-bg-sunken/40 p-5">
          <legend className="mb-3 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
            Tryb porcji
          </legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tryb porcji">
            <button
              type="button"
              role="radio"
              aria-checked={portionMode === "servings"}
              onClick={() => onPortionModeChange("servings")}
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                portionMode === "servings"
                  ? "border-accent bg-accent text-ink-inverse shadow-accent"
                  : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
              }`}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Osoby
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={portionMode === "weight"}
              onClick={() => onPortionModeChange("weight")}
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                portionMode === "weight"
                  ? "border-accent bg-accent text-ink-inverse shadow-accent"
                  : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
              }`}
            >
              <Scale className="h-4 w-4" aria-hidden="true" />
              Gramy
            </button>
          </div>
        </fieldset>

        {/* Liczba osób LUB Docelowa waga */}
        <fieldset className="rounded-xl border border-border/60 bg-bg-sunken/40 p-5">
          {portionMode === "servings" ? (
            <>
              <legend className="mb-3 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
                Liczba osób: {servingSize}
              </legend>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onServingSizeChange(Math.max(1, servingSize - 1))}
                  className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-elevated text-lg font-semibold text-ink transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Zmniejsz liczbę osób"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono text-xl font-semibold text-ink">
                  {servingSize}
                </span>
                <button
                  type="button"
                  onClick={() => onServingSizeChange(Math.min(10, servingSize + 1))}
                  className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-elevated text-lg font-semibold text-ink transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Zwiększ liczbę osób"
                >
                  +
                </button>
              </div>
            </>
          ) : (
            <>
              <legend className="mb-3 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
                Docelowa waga
              </legend>
              <div className="flex items-center gap-3">
                <input
                  id="target-weight-input"
                  aria-label="Docelowa waga w gramach"
                  type="number"
                  min={MIN_TARGET_WEIGHT}
                  max={MAX_TARGET_WEIGHT}
                  step={50}
                  value={targetWeight}
                  onChange={(event) =>
                    onTargetWeightChange(
                      clampTargetWeight(Number(event.target.value)),
                    )
                  }
                  className="min-h-11 w-28 rounded-md border border-border bg-bg-elevated px-3 py-2 text-center font-mono font-semibold text-ink shadow-xs focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
                <span className="text-sm font-semibold text-ink-soft">
                  gramów
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-ink-muted">
                Idealne dla cukiernictwa i profesjonalnej gastronomii.
              </p>
            </>
          )}
        </fieldset>

        {/* Poziom apetytu - 5 kart wyboru */}
        <fieldset className="rounded-xl border border-border/60 bg-bg-sunken/40 p-5 md:col-span-2">
          <legend className="mb-4 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
            Poziom apetytu
          </legend>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
            role="radiogroup"
            aria-label="Poziom apetytu od 1 (lekko) do 5 (uczta)"
          >
            {hungerLevelOptions.map((option) => {
              const isActive = hungerLevel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onHungerLevelChange(option.value)}
                  className={`group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${
                    isActive
                      ? "border-accent bg-accent-soft text-ink shadow-[var(--shadow-accent)] ring-1 ring-accent/30"
                      : "border-border-strong bg-bg-elevated text-ink shadow-xs hover:-translate-y-0.5 hover:border-accent/70 hover:bg-bg hover:shadow-md"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-pill bg-accent text-ink-inverse shadow-sm"
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-3xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="font-brand text-sm font-semibold leading-tight text-ink">
                    {option.label}
                  </span>
                  <span className="text-xs leading-4 text-ink-soft">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Tryb Thermomix - wycentrowana karta toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={isThermomixMode}
          aria-describedby="thermomix-description"
          onClick={() => onThermomixToggle(!isThermomixMode)}
          className={`group relative flex w-full flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent md:col-span-2 sm:p-8 ${
            isThermomixMode
              ? "border-basil bg-basil-soft text-ink shadow-sm ring-1 ring-basil/30"
              : "border-border/60 bg-bg-sunken/40 text-ink hover:-translate-y-0.5 hover:border-basil/50 hover:bg-basil-soft/40 hover:shadow-sm"
          }`}
        >
          {isThermomixMode && (
            <span
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-pill bg-basil text-ink-inverse shadow-sm"
              aria-hidden="true"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
          )}

          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              isThermomixMode
                ? "bg-basil text-ink-inverse"
                : "bg-bg-elevated text-ink-muted group-hover:text-basil"
            }`}
            aria-hidden="true"
          >
            <ChefHat className="h-7 w-7" />
          </span>

          <p className="font-brand text-base font-bold text-ink sm:text-lg">
            Tryb Thermomix
          </p>
          <p
            id="thermomix-description"
            className="max-w-md text-sm leading-6 text-ink-soft"
          >
            AI dopasuje przepisy pod robota - czasy, obroty i kolejność kroków.
          </p>
        </button>
      </div>
    </div>
  );
}
