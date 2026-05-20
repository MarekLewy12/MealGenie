import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Flame,
  Pencil,
  PenLine,
  Refrigerator,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

import { Eyebrow } from "../ui";
import type { MealType, PortionMode } from "../../types/meal";
import { cn } from "../../utils/cn";
import {
  findHungerLevelOption,
  findMealTypeOption,
  findPrepTimeOption,
} from "./mealOptions";
import {
  previewFlashTransition,
  wizardStepLayoutTransition,
} from "./wizardMotion";

export type WizardSummaryCardProps = {
  step: number;
  isGuestMode: boolean;
  userPrompt: string;
  ingredients: string[];
  prepTime: number;
  portionMode: PortionMode;
  servingSize: number;
  targetWeight: number;
  hungerLevel: number;
  isThermomixMode: boolean;
  mealType: MealType;
  variant?: "preview" | "summary";
  onEditStep?: (step: number) => void;
};

export function WizardSummaryCard({
  step,
  isGuestMode,
  userPrompt,
  ingredients,
  prepTime,
  portionMode,
  servingSize,
  targetWeight,
  hungerLevel,
  isThermomixMode,
  mealType,
  variant = "preview",
  onEditStep,
}: WizardSummaryCardProps) {
  const { items } = getPreviewItems({
    isGuestMode,
    userPrompt,
    ingredients,
    prepTime,
    portionMode,
    servingSize,
    targetWeight,
    hungerLevel,
    mealType,
  });
  const isSummary = variant === "summary";

  const filledCount = items.filter(
    (item) => item.isFilled && (isSummary || step >= item.revealAtStep),
  ).length;

  return (
    <motion.div
      layout
      transition={wizardStepLayoutTransition}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-accent-soft/15 shadow-[var(--shadow-accent)] dark:to-accent/[0.04]",
        isSummary ? "p-6 sm:p-8 lg:p-10" : "p-6",
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-[60px] dark:bg-accent/5"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="accent">
            {isSummary ? "Podsumowanie" : "Twój przepis"}
          </Eyebrow>
          {!isGuestMode && (
            <ThermomixStatusBadge isEnabled={isThermomixMode} />
          )}
        </div>
        <h3
          className={cn(
            "mt-2 font-serif font-medium leading-tight text-ink",
            isSummary ? "text-summary-gradient text-3xl sm:text-4xl" : "text-2xl",
          )}
        >
          {isSummary
            ? "Gotowe do generowania."
            : filledCount === 0
              ? "Zaczynamy..."
              : filledCount < 3
                ? "Buduje się..."
                : "Prawie gotowe."}
        </h3>
        <p
          className={cn(
            "mt-1 text-ink-muted",
            isSummary ? "max-w-3xl text-base leading-7" : "text-sm leading-5",
          )}
        >
          {isSummary
            ? "Sprawdź wybory przed wysłaniem. MealGenie użyje ich do przygotowania propozycji posiłków."
            : filledCount === 0
              ? "Wybierz parametry, a podsumowanie pojawi się tutaj."
              : `${filledCount} ${filledCount === 1 ? "wybór" : filledCount < 5 ? "wybory" : "wyborów"}`}
        </p>

        <ul
          className={cn(
            "mt-6",
            isSummary ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3",
          )}
        >
          {items.map((item) => (
            <li key={item.key}>
              <SummaryItem
                item={item}
                isRevealed={isSummary || step >= item.revealAtStep}
                variant={variant}
                onEditStep={onEditStep}
              />
            </li>
          ))}
        </ul>

        {isSummary && (
          <div className="mt-7 flex items-center justify-center gap-3 rounded-2xl border border-accent/20 bg-accent-soft/35 px-4 py-3 text-center dark:bg-accent/10">
            <Sparkles
              className="h-5 w-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <p className="font-brand text-base font-semibold leading-7 text-ink">
              Wszystko się zgadza? Magia zaczyna się po kliknięciu.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

type PreviewTone = "accent" | "basil" | "saffron";

type PreviewItemConfig = {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder: string;
  tone: PreviewTone;
  revealAtStep: number;
  editStep: number;
  isFilled: boolean;
};

type PreviewItemsOptions = Pick<
  WizardSummaryCardProps,
  | "isGuestMode"
  | "userPrompt"
  | "ingredients"
  | "prepTime"
  | "portionMode"
  | "servingSize"
  | "targetWeight"
  | "hungerLevel"
  | "mealType"
>;

function getPreviewItems({
  isGuestMode,
  userPrompt,
  ingredients,
  prepTime,
  portionMode,
  servingSize,
  targetWeight,
  hungerLevel,
  mealType,
}: PreviewItemsOptions) {
  const prepTimeOption = findPrepTimeOption(prepTime);
  const mealTypeOption = findMealTypeOption(mealType);
  const hungerOption = findHungerLevelOption(hungerLevel);

  const promptValue = userPrompt.trim();
  const hasIngredients = ingredients.length > 0;
  const portionValue =
    portionMode === "servings"
      ? `${servingSize} ${servingSize === 1 ? "osoba" : servingSize < 5 ? "osoby" : "osób"}`
      : `${targetWeight} g`;
  const hungerLabel = `${hungerOption.label} (${hungerLevel}/5)`;

  const items: PreviewItemConfig[] = [
    {
      key: "prompt",
      icon: PenLine,
      label: "Inspiracja",
      value: promptValue || "—",
      placeholder: "Powiedz, czego masz ochotę",
      tone: "accent",
      revealAtStep: 1,
      editStep: 1,
      isFilled: promptValue.length > 0,
    },
  ];

  if (!isGuestMode) {
    items.push({
      key: "ingredients",
      icon: Refrigerator,
      label: "Składniki",
      value: hasIngredients ? ingredients.join(", ") : "—",
      placeholder: "Co masz w lodówce",
      tone: "basil",
      revealAtStep: 1,
      editStep: 1,
      isFilled: hasIngredients,
    });
  }

  items.push({
    key: "prepTime",
    icon: Clock3,
    label: "Czas",
    value: `${prepTimeOption.label} · ${prepTimeOption.hint}`,
    placeholder: "Wybierz tempo",
    tone: "saffron",
    revealAtStep: 2,
    editStep: 2,
    isFilled: true,
  });

  if (!isGuestMode) {
    items.push(
      {
        key: "portion",
        icon: Users,
        label: portionMode === "servings" ? "Osoby" : "Waga",
        value: portionValue,
        placeholder: "Dla kogo",
        tone: "accent",
        revealAtStep: 3,
        editStep: 3,
        isFilled: true,
      },
      {
        key: "hunger",
        icon: Flame,
        label: "Apetyt",
        value: hungerLabel,
        placeholder: "Lekko czy uczta",
        tone: "saffron",
        revealAtStep: 3,
        editStep: 3,
        isFilled: true,
      },
    );
  }

  items.push({
    key: "mealType",
    icon: Utensils,
    label: "Typ",
    value: mealTypeOption
      ? `${mealTypeOption.emoji} ${mealTypeOption.label}`
      : "—",
    placeholder: "Co jemy",
    tone: "accent",
    revealAtStep: 4,
    editStep: 4,
    isFilled: true,
  });

  return { items };
}

const toneClasses: Record<PreviewTone, string> = {
  accent: "bg-accent-soft text-accent dark:bg-accent/20",
  basil: "bg-basil-soft text-basil dark:bg-basil/20",
  saffron: "bg-saffron-soft text-saffron dark:bg-saffron/25",
};

function SummaryItem({
  item,
  isRevealed,
  variant,
  onEditStep,
}: {
  item: PreviewItemConfig;
  isRevealed: boolean;
  variant: WizardSummaryCardProps["variant"];
  onEditStep?: WizardSummaryCardProps["onEditStep"];
}) {
  const Icon = item.icon;
  const displayValue =
    isRevealed && item.isFilled ? item.value : item.placeholder;
  const isSummary = variant === "summary";

  return (
    <motion.div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border/60 bg-bg-elevated/60 backdrop-blur-sm transition duration-fast ease-out dark:bg-white/[0.03]",
        isSummary ? "p-4" : "p-3",
        !isRevealed && "border-border/40 bg-bg-sunken/35 opacity-70",
      )}
      animate={isRevealed ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      transition={previewFlashTransition}
      key={item.value}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg",
          isSummary ? "h-10 w-10" : "h-9 w-9",
          isRevealed ? toneClasses[item.tone] : "bg-bg-elevated text-ink-muted",
        )}
        aria-hidden="true"
      >
        <Icon className={isSummary ? "h-5 w-5" : "h-4 w-4"} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-brand text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
            {item.label}
          </p>
          {isSummary && onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(item.editStep)}
              className="-mr-1 -mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-ink-muted transition hover:bg-bg-sunken hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Zmień: ${item.label}`}
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
              Zmień
            </button>
          )}
        </div>
        <p
          className={cn(
            "mt-1.5 leading-5",
            isSummary ? "text-base" : "truncate text-sm",
            isRevealed && item.isFilled ? "text-ink" : "italic text-ink-muted",
          )}
        >
          {displayValue}
        </p>
      </div>
    </motion.div>
  );
}

function ThermomixStatusBadge({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-1 font-brand text-[10px] font-bold uppercase leading-none tracking-[0.12em]",
        isEnabled
          ? "border-basil/30 bg-basil-soft text-basil"
          : "border-bordeaux/25 bg-bordeaux/10 text-bordeaux",
      )}
      aria-label={
        isEnabled ? "Tryb Thermomix włączony" : "Tryb Thermomix wyłączony"
      }
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {!isEnabled && (
          <span
            className="absolute h-px w-5 rotate-[-35deg] rounded-full bg-current"
            aria-hidden="true"
          />
        )}
      </span>
      {isEnabled ? "Thermomix" : "Bez Thermomixa"}
    </span>
  );
}
