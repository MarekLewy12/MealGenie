import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  Beef,
  Carrot,
  Lightbulb,
  Milk,
  Minus,
  Plus,
  Sparkle,
  Timer,
  UtensilsCrossed,
} from "lucide-react";

import { notify } from "../../store/notificationStore";
import { useShoppingListStore } from "../../store/shoppingListStore";
import type { FullRecipe, FullRecipeIngredient } from "../../types/meal";
import { Badge, Eyebrow, IconButton } from "../ui";

export function NutritionSection({
  nutrition,
}: {
  nutrition: FullRecipe["nutrition"];
}) {
  const items = [
    {
      label: "Kalorie",
      value: nutrition.calories,
      unit: "kcal",
      color: "bg-accent",
    },
    { label: "Białko", value: nutrition.protein, unit: "g", color: "bg-basil" },
    {
      label: "Węglowodany",
      value: nutrition.carbs,
      unit: "g",
      color: "bg-saffron",
    },
    {
      label: "Tłuszcze",
      value: nutrition.fat,
      unit: "g",
      color: "bg-accent-deep",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-6">
        <Eyebrow tone="muted">Szybki przegląd</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
          Makro na porcję
        </h2>
      </div>

      <div className="flex flex-col rounded-[1.25rem] border border-border bg-bg-elevated p-2 shadow-sm">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between py-3.5 pl-4 pr-7 ${
              index !== items.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`}
                aria-hidden="true"
              />
              <span className="font-brand text-xs font-bold uppercase tracking-[0.1em] text-ink-muted">
                {item.label}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-serif text-xl font-medium text-ink">
                {item.value}
              </span>
              <span className="ml-1 text-xs text-ink-soft">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

const categoryIcons: Record<string, ElementType> = {
  Mięso: Beef,
  Warzywa: Carrot,
  Nabiał: Milk,
  Przyprawy: Sparkle,
};

function getIngredientAmountDisplay(amount: string, unit: string) {
  const value = [amount, unit].filter(Boolean).join(" ").trim();
  const match = value.match(/^(.*?)\s*(\(.+\))$/);

  if (!match) {
    return { primary: value, detail: null };
  }

  return {
    primary: match[1].trim(),
    detail: match[2].trim(),
  };
}

export function IngredientsSection({
  ingredients,
  allowShoppingList = true,
}: {
  ingredients: FullRecipeIngredient[];
  allowShoppingList?: boolean;
}) {
  const addItem = useShoppingListStore((state) => state.addItem);
  const removeItem = useShoppingListStore((state) => state.removeItem);
  const shoppingItems = useShoppingListStore((state) => state.items);
  const normalize = (value: string) => value.trim().toLowerCase();
  const buildKey = (item: FullRecipeIngredient) =>
    [item.name, item.amount, item.unit].map(normalize).join("|");

  const grouped = ingredients.reduce(
    (acc, ing) => {
      const cat = ing.category || "Inne";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ing);
      return acc;
    },
    {} as Record<string, FullRecipeIngredient[]>,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-4">
        <Eyebrow tone="basil">Mise en place</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
          Składniki
        </h2>
      </div>

      <div className="rounded-[1.25rem] border border-border bg-bg-elevated shadow-sm">
        <div className="space-y-4 p-3 lg:max-h-[calc(100dvh-14rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
          {Object.entries(grouped).map(([category, items], index) => {
            const IconComponent = categoryIcons[category] || UtensilsCrossed;
            const isLast = index === Object.keys(grouped).length - 1;

            return (
              <div
                key={category}
                className={`pb-4 ${!isLast ? "border-b border-border/40" : "pb-0"}`}
              >
                <h3 className="mb-3 flex items-center gap-2 px-3 pt-1 font-brand text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  <IconComponent className="h-4 w-4 text-accent" aria-hidden="true" />
                  {category}
                </h3>
                <ul role="list" className="space-y-1">
                  {items.map((ing, idx) => {
                    const itemKey = buildKey(ing);
                    const isInList = shoppingItems.some(
                      (item) => item.key === itemKey,
                    );
                    const amountDisplay = getIngredientAmountDisplay(
                      ing.amount,
                      ing.unit,
                    );

                    return (
                      <li
                        key={idx}
                        className="group flex items-start justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-sunken"
                      >
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="truncate text-sm font-semibold leading-tight text-ink">
                            {ing.name}
                          </p>
                          {ing.notes ? (
                            <p className="mt-0.5 truncate text-xs text-ink-soft">
                              {ing.notes}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 items-start justify-end gap-2">
                          <span className="w-36 text-right sm:w-44 lg:w-36 xl:w-40 2xl:w-48">
                            <span className="block text-sm font-medium leading-tight text-ink-muted">
                              {amountDisplay.primary}
                            </span>
                            {amountDisplay.detail ? (
                              <span className="mt-0.5 block text-xs leading-tight text-ink-soft">
                                {amountDisplay.detail}
                              </span>
                            ) : null}
                          </span>

                          {allowShoppingList ? (
                            <IconButton
                              aria-label={
                                isInList
                                  ? `Usuń z listy zakupów: ${ing.name}`
                                  : `Dodaj do listy zakupów: ${ing.name}`
                              }
                              variant={isInList ? "ghost" : "secondary"}
                              icon={
                                isInList ? (
                                  <Minus className="h-3.5 w-3.5" />
                                ) : (
                                  <Plus className="h-3.5 w-3.5" />
                                )
                              }
                              onClick={() => {
                                if (isInList) {
                                  const wasRemoved = removeItem({
                                    name: ing.name,
                                    amount: ing.amount,
                                    unit: ing.unit,
                                    notes: ing.notes ?? null,
                                  });
                                  if (wasRemoved) {
                                    notify.success("Usunięto z listy zakupów.");
                                  }
                                  return;
                                }
                                const wasAdded = addItem({
                                  name: ing.name,
                                  amount: ing.amount,
                                  unit: ing.unit,
                                  notes: ing.notes ?? null,
                                });
                                notify[wasAdded ? "success" : "info"](
                                  wasAdded
                                    ? "Dodano do listy zakupów."
                                    : "Ten składnik jest już na liście.",
                                );
                              }}
                              className={`min-h-8 min-w-8 rounded-lg p-1.5 ${
                                isInList
                                  ? "text-bordeaux hover:bg-bordeaux/10"
                                  : "text-basil hover:border-basil/30 hover:bg-basil-soft"
                              }`}
                              title={
                                isInList
                                  ? "Usuń z listy zakupów"
                                  : "Dodaj do listy zakupów"
                              }
                            />
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export function StepsSection({ steps }: { steps: FullRecipe["steps"] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="mb-6">
        <Eyebrow tone="accent">Krok po kroku</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
          Przygotowanie
        </h2>
      </div>

      <div className="space-y-5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="group relative overflow-hidden rounded-[1.35rem] border border-border/80 bg-bg-elevated/90 p-6 shadow-sm transition-colors duration-300 ease-out hover:border-border-strong hover:bg-bg/50 hover:shadow-md sm:p-8"
          >
            <div
              className="absolute bottom-0 left-0 top-0 z-0 w-px bg-gradient-to-b from-transparent via-accent/45 to-transparent opacity-70 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 right-6 z-0 w-28 select-none text-center font-sans text-[4.5rem] font-bold leading-none text-accent/10 tabular-nums transition-colors group-hover:text-accent/16 sm:bottom-4 sm:right-8 sm:w-32 sm:text-[6rem]"
              aria-hidden="true"
            >
              {String(step.stepNumber).padStart(2, "0")}
            </div>

            {step.duration ? (
              <Badge
                variant="neutral"
                className="mb-4 w-fit shrink-0 justify-center border border-accent/25 bg-bg-elevated/90 px-3.5 py-2 text-sm text-ink-soft shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_18px_-16px_rgba(194,87,40,0.35)] sm:absolute sm:right-8 sm:top-6 sm:z-10 sm:mb-0 sm:w-32 dark:bg-bg-sunken/85"
              >
                <Timer className="mr-1.5 h-4 w-4 text-accent" aria-hidden="true" />
                {step.duration}
              </Badge>
            ) : null}

            <div className="relative z-10">
              <div className="mb-5 flex flex-col gap-4">
                <div className="flex items-start sm:pr-36">
                  <div>
                    <p className="font-brand text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                      Krok {step.stepNumber}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-medium leading-tight text-ink sm:text-2xl">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="max-w-[85%] text-base leading-relaxed text-ink-soft sm:max-w-[75%]">
                {step.instruction}
              </p>

              {step.tip ? (
                <div className="mt-6 max-w-[85%] border-t border-dotted border-border-dotted pt-4 sm:max-w-[75%]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-bg-elevated text-accent-deep shadow-xs dark:text-saffron">
                      <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-brand text-[10px] font-bold uppercase tracking-[0.16em] text-accent-deep dark:text-saffron">
                        Wskazówka szefa
                      </p>
                      <p className="mt-1 font-serif text-sm italic leading-relaxed text-ink-soft">
                        {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export function TipsSection({ tips }: { tips: string[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="group rounded-2xl border border-saffron/30 bg-[radial-gradient(ellipse_at_top_right,var(--saffron-soft),transparent_76%),var(--bg-elevated)] p-6 shadow-sm transition-colors duration-300 ease-out hover:border-saffron/50 hover:bg-bg/50 hover:shadow-md sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-saffron/30 bg-bg-elevated text-accent-deep shadow-xs transition-colors duration-300 group-hover:border-saffron/50 dark:text-saffron">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <Eyebrow tone="saffron">Warto wiedzieć</Eyebrow>
          <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
            Ogólne porady do przepisu
          </h2>
        </div>
      </div>

      <ul
        role="list"
        className="mt-6 overflow-hidden rounded-[1.1rem] border border-border/70 bg-bg-elevated/60"
      >
        {tips.map((tip, idx) => (
          <li
            key={idx}
            className={`group/tip flex items-start gap-3.5 px-4 py-4 transition-colors duration-300 hover:bg-bg-elevated ${
              idx !== tips.length - 1 ? "border-b border-dotted border-border-dotted" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rotate-45 border border-saffron bg-bg-elevated transition-colors duration-300 group-hover/tip:bg-saffron"
            />
            <span className="text-base leading-relaxed text-ink-soft">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function SuggestionCard({
  icon: Icon,
  title,
  content,
}: {
  icon: ElementType;
  title: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="group rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm transition-colors duration-300 ease-out hover:border-border-strong hover:bg-bg/50 hover:shadow-md sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-sunken text-accent transition-colors duration-300 group-hover:border-accent/25 group-hover:bg-bg-elevated">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-brand text-xl font-semibold leading-tight text-ink">
            {title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}
