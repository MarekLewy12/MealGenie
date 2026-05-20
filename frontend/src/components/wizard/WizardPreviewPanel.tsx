import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Flame,
  PenLine,
  Refrigerator,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

import { Eyebrow } from "../ui";
import type { MealType, PortionMode } from "../../types/meal";
import {
  findHungerLevelOption,
  findMealTypeOption,
  findPrepTimeOption,
} from "./mealOptions";
import {
  previewFlashTransition,
  previewItemVariants,
} from "./wizardMotion";

// ============================================
// Sticky panel "Twoj przepis" - live preview budujacy sie z krokami
// ============================================

type WizardPreviewPanelProps = {
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
};

export function WizardPreviewPanel({
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
}: WizardPreviewPanelProps) {
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

  // Tablica elementow preview - kolejnosc odpowiada krokom wizarda
  const items: PreviewItemConfig[] = [
    {
      key: "prompt",
      icon: PenLine,
      label: "Inspiracja",
      value: promptValue || "—",
      placeholder: "Powiedz, czego masz ochotę",
      tone: "accent",
      revealAtStep: 1,
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
        isFilled: true,
      },
    );

    if (isThermomixMode) {
      items.push({
        key: "thermomix",
        icon: Sparkles,
        label: "Tryb",
        value: "Przepis na TM",
        placeholder: "Bez sprzętu",
        tone: "basil",
        revealAtStep: 3,
        isFilled: true,
      });
    }
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
    isFilled: true,
  });

  const filledCount = items.filter(
    (item) => item.isFilled && step >= item.revealAtStep,
  ).length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-accent-soft/15 p-6 shadow-[var(--shadow-accent)] dark:to-accent/[0.04]">
      {/* dekoracyjny blur w rogu */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-[60px] dark:bg-accent/5"
        aria-hidden="true"
      />

      <div className="relative">
        <Eyebrow tone="accent">Twój przepis</Eyebrow>
        <h3 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
          {filledCount === 0
            ? "Zaczynamy..."
            : filledCount < 3
              ? "Buduje się..."
              : "Prawie gotowe."}
        </h3>
        <p className="mt-1 text-sm leading-5 text-ink-muted">
          {filledCount === 0
            ? "Wybierz parametry, a podsumowanie pojawi się tutaj."
            : `${filledCount} ${filledCount === 1 ? "wybór" : filledCount < 5 ? "wybory" : "wyborów"}`}
        </p>

        <ul className="mt-6 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              if (step < item.revealAtStep) return null;
              return (
                <motion.li
                  key={item.key}
                  variants={previewItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.18 } }}
                  layout
                >
                  <PreviewItem item={item} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// Pojedynczy item w panelu preview
// ============================================

type PreviewTone = "accent" | "basil" | "saffron";

type PreviewItemConfig = {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder: string;
  tone: PreviewTone;
  revealAtStep: number;
  isFilled: boolean;
};

const toneClasses: Record<PreviewTone, string> = {
  accent: "bg-accent-soft text-accent dark:bg-accent/20",
  basil: "bg-basil-soft text-basil dark:bg-basil/20",
  saffron: "bg-saffron-soft text-saffron dark:bg-saffron/25",
};

function PreviewItem({ item }: { item: PreviewItemConfig }) {
  const Icon = item.icon;
  const displayValue = item.isFilled ? item.value : item.placeholder;

  return (
    <motion.div
      className="flex items-start gap-3 rounded-xl border border-border/60 bg-bg-elevated/60 p-3 backdrop-blur-sm dark:bg-white/[0.03]"
      animate={{ scale: [1, 1.015, 1] }}
      transition={previewFlashTransition}
      key={item.value}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[item.tone]}`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-brand text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
          {item.label}
        </p>
        <p
          className={`mt-1.5 truncate text-sm leading-5 ${
            item.isFilled ? "text-ink" : "italic text-ink-muted"
          }`}
        >
          {displayValue}
        </p>
      </div>
    </motion.div>
  );
}
