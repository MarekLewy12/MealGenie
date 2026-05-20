import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChefHat, Minus, Plus, Scale, Users } from "lucide-react";

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
  totalSteps: number;
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
  totalSteps,
}: Step3AudienceProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="saffron">
          Krok 3 z {totalSteps} · Personalizacja
        </Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Jaką porcję przygotować?{" "}
          <span className="text-ink-soft">MealGenie dopasuje ilość.</span>
        </h2>
        <p className="max-w-3xl text-base leading-7 text-ink-soft">
          Wybierz liczbę osób albo docelową gramaturę. Domyślnie ustawione są 2 osoby i standardowy apetyt.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Tryb porcji */}
        <fieldset className="flex flex-col rounded-xl border border-border/60 bg-bg-sunken/40 p-5">
          <legend className="mb-3 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
            Tryb porcji
          </legend>
          <div
            className="grid min-h-[5.5rem] flex-1 grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Tryb porcji"
          >
            <button
              type="button"
              role="radio"
              aria-checked={portionMode === "servings"}
              onClick={() => onPortionModeChange("servings")}
              className={`flex h-full min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                portionMode === "servings"
                  ? "border-accent bg-accent text-ink-inverse shadow-accent"
                  : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
              }`}
            >
              <Users className="h-6 w-6" aria-hidden="true" />
              <span className="font-brand text-lg font-semibold leading-tight">
                Osoby
              </span>
              <span className="text-sm font-semibold leading-5 opacity-80">
                Liczba porcji
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={portionMode === "weight"}
              onClick={() => onPortionModeChange("weight")}
              className={`flex h-full min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                portionMode === "weight"
                  ? "border-accent bg-accent text-ink-inverse shadow-accent"
                  : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
              }`}
            >
              <Scale className="h-6 w-6" aria-hidden="true" />
              <span className="font-brand text-lg font-semibold leading-tight">
                Gramy
              </span>
              <span className="text-sm font-semibold leading-5 opacity-80">
                Waga porcji
              </span>
            </button>
          </div>
        </fieldset>

        {/* Liczba osób LUB Docelowa waga */}
        <fieldset className="rounded-xl border border-border/60 bg-bg-sunken/40 p-5">
          <legend className="mb-3 font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
            {portionMode === "servings"
              ? `Liczba osób: ${servingSize}`
              : "Docelowa waga"}
          </legend>
          <AnimatePresence mode="wait" initial={false}>
            {portionMode === "servings" ? (
              <motion.div
                key="servings"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="flex min-h-[5.5rem] items-center justify-center">
                  <div className="grid w-full max-w-sm grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center rounded-2xl border border-border-strong bg-bg-elevated p-2 shadow-xs">
                    <button
                      type="button"
                      disabled={servingSize <= 1}
                      onClick={() =>
                        onServingSizeChange(Math.max(1, servingSize - 1))
                      }
                      className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-ink-soft transition hover:bg-accent-soft hover:text-accent-deep disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent disabled:hover:text-ink-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label="Zmniejsz liczbę osób"
                    >
                      <Minus className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="flex min-w-0 flex-col items-center justify-center px-2 text-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={servingSize}
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, y: 6, scale: 0.96 }
                          }
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={
                            prefersReducedMotion
                              ? undefined
                              : { opacity: 0, y: -6, scale: 0.96 }
                          }
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="font-mono text-4xl font-semibold leading-none text-ink"
                        >
                          {servingSize}
                        </motion.span>
                      </AnimatePresence>
                      <span className="mt-1 text-sm font-semibold leading-none text-ink-soft">
                        {servingSize === 1 ? "osoba" : "osoby"}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={servingSize >= 10}
                      onClick={() =>
                        onServingSizeChange(Math.min(10, servingSize + 1))
                      }
                      className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-ink-soft transition hover:bg-accent-soft hover:text-accent-deep disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent disabled:hover:text-ink-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label="Zwiększ liczbę osób"
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-5 text-ink-muted">
                  Wygodne do codziennego gotowania dla domowników i gości.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="weight"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="flex min-h-[5.5rem] items-center justify-center">
                  <div className="grid w-full max-w-sm grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center rounded-2xl border border-border-strong bg-bg-elevated p-2 shadow-xs">
                    <button
                      type="button"
                      disabled={targetWeight <= MIN_TARGET_WEIGHT}
                      onClick={() =>
                        onTargetWeightChange(
                          clampTargetWeight(targetWeight - 50),
                        )
                      }
                      className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-ink-soft transition hover:bg-accent-soft hover:text-accent-deep disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent disabled:hover:text-ink-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label="Zmniejsz wagę o 50 gramów"
                    >
                      <Minus className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="flex min-w-0 flex-col items-center justify-center px-2 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="font-mono text-3xl font-semibold leading-none text-ink sm:text-4xl">
                          {targetWeight}
                        </span>
                        <span className="font-mono text-lg font-semibold leading-none text-ink-soft sm:text-xl">
                          g
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={targetWeight >= MAX_TARGET_WEIGHT}
                      onClick={() =>
                        onTargetWeightChange(
                          clampTargetWeight(targetWeight + 50),
                        )
                      }
                      className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-ink-soft transition hover:bg-accent-soft hover:text-accent-deep disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent disabled:hover:text-ink-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label="Zwiększ wagę o 50 gramów"
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {[250, 500, 750, 1000, 1500, 2000].map((preset) => {
                    const isActive = targetWeight === preset;

                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => onTargetWeightChange(preset)}
                        className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "border-accent bg-accent/10 font-bold text-accent-deep"
                            : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent/40 hover:bg-bg hover:text-ink"
                        }`}
                      >
                        {preset} g
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <span className="font-brand text-lg font-semibold leading-tight text-ink">
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

        {/* Tryb Thermomix - wycentrowany, horyzontalny wiersz z dopieszczonym suwakiem */}
        <div className="flex justify-center md:col-span-2">
          <button
            type="button"
            role="switch"
            aria-checked={isThermomixMode}
            aria-describedby="thermomix-description"
            onClick={() => onThermomixToggle(!isThermomixMode)}
            className={`group relative flex w-full max-w-2xl items-center justify-between gap-6 rounded-2xl border p-5 text-left transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${
              isThermomixMode
                ? "border-basil bg-basil-soft text-ink shadow-sm ring-1 ring-basil/30"
                : "border-border/60 bg-bg-sunken/40 text-ink hover:-translate-y-0.5 hover:border-basil/50 hover:bg-basil-soft/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isThermomixMode
                    ? "bg-basil text-ink-inverse"
                    : "bg-bg-elevated text-ink-muted group-hover:text-basil"
                }`}
                aria-hidden="true"
              >
                <ChefHat className="h-6 w-6" />
              </span>

              <div className="space-y-0.5">
                <p className="font-brand text-lg font-bold text-ink">
                  Tryb Thermomix
                </p>
                <p
                  id="thermomix-description"
                  className="pr-2 text-sm leading-relaxed text-ink-soft"
                >
                  Przepisy uwzględnią robota - czasy, obroty i kolejność kroków.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center">
              <div
                className={`relative h-7 w-12 rounded-full transition-all duration-fast ease-out ${
                  isThermomixMode
                    ? "bg-basil ring-4 ring-basil/10"
                    : "bg-border-strong group-hover:bg-border-strong/80"
                }`}
              >
                <div
                  className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-fast ease-out ${
                    isThermomixMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
