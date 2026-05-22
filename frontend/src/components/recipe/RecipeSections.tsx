import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  Beef,
  Carrot,
  Lightbulb,
  Milk,
  Minus,
  Plus,
  RefreshCw,
  Sparkle,
  Timer,
  UtensilsCrossed,
} from "lucide-react";

import { notify } from "../../store/notificationStore";
import { useShoppingListStore } from "../../store/shoppingListStore";
import type { FullRecipe, FullRecipeIngredient } from "../../types/meal";
import { Badge, Eyebrow, IconButton } from "../ui";

// Kept for backwards compatibility while RecipePage and SharedRecipePage are migrated.
export function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: string;
  color: "blue" | "purple" | "orange" | "green";
}) {
  const colors = {
    blue: "bg-bg-elevated text-ink",
    purple: "bg-accent-soft text-accent-deep",
    orange: "bg-saffron-soft text-ink",
    green: "bg-basil-soft text-ink",
  };

  return (
    <div
      className={`flex min-h-[76px] items-center gap-2 rounded-xl border border-border p-3 shadow-xs sm:gap-3 sm:p-4 ${colors[color]}`}
    >
      <div className="rounded-lg bg-bg-elevated/70 p-2 text-accent shadow-xs">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="font-brand text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </p>
        <p className="truncate font-serif text-lg font-medium leading-tight text-ink">
          {value}
        </p>
      </div>
    </div>
  );
}

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
      accent: "bg-accent",
    },
    { label: "Białko", value: nutrition.protein, unit: "g", accent: "bg-basil" },
    {
      label: "Węglowod.",
      value: nutrition.carbs,
      unit: "g",
      accent: "bg-saffron",
    },
    { label: "Tłuszcze", value: nutrition.fat, unit: "g", accent: "bg-accent-deep" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-4">
        <Eyebrow tone="muted">Szybki przegląd</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
          Makro na porcję
        </h2>
      </div>
      <div className="flex flex-wrap divide-y divide-dotted divide-border-dotted overflow-hidden rounded-[1.25rem] border border-border bg-bg-elevated shadow-sm sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="min-w-[45%] flex-1 p-4 text-center sm:min-w-[20%] sm:p-5"
          >
            <div className={`mx-auto mb-2.5 h-1 w-8 rounded-pill ${item.accent}`} />
            <p className="font-serif text-2xl font-medium leading-none text-ink">
              {item.value}
              <span className="ml-1 font-sans text-xs font-normal text-ink-muted">
                {item.unit}
              </span>
            </p>
            <p
              className="mt-2 w-full truncate px-1 font-brand text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted"
              title={item.label}
            >
              {item.label}
            </p>
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

      <div className="space-y-6 rounded-[1.25rem] border border-border bg-bg-elevated p-5 shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] sm:p-7">
        {Object.entries(grouped).map(([category, items], index) => {
          const IconComponent = categoryIcons[category] || UtensilsCrossed;
          const isLast = index === Object.keys(grouped).length - 1;

          return (
            <div
              key={category}
              className={`pb-6 ${!isLast ? "border-b border-dotted border-border-dotted" : "pb-0"}`}
            >
              <h3 className="mb-4 flex items-center gap-2 font-brand text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                <IconComponent className="h-4 w-4 text-accent" aria-hidden="true" />
                {category}
              </h3>
              <ul role="list" className="space-y-3.5">
                {items.map((ing, idx) => {
                  const itemKey = buildKey(ing);
                  const isInList = shoppingItems.some((item) => item.key === itemKey);

                  return (
                    <li key={idx} className="group">
                      <div className="flex w-full items-baseline gap-3">
                        <span
                          className="min-w-0 flex-auto truncate font-medium leading-tight text-ink"
                          title={`${ing.name}${ing.notes ? ` (${ing.notes})` : ""}`}
                        >
                          {ing.name}
                          {ing.notes ? (
                            <span className="pl-1.5 text-xs italic text-ink-soft">
                              ({ing.notes})
                            </span>
                          ) : null}
                        </span>
                        <span
                          className="mb-1 min-w-4 flex-1 border-b border-dotted border-border-strong"
                          aria-hidden="true"
                        />
                        <span className="w-24 shrink-0 text-right text-sm font-medium text-ink-muted">
                          {ing.amount} {ing.unit}
                        </span>
                        <div className="flex w-10 shrink-0 items-center justify-center gap-1 pl-1 sm:w-[4.75rem]">
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
                              className={`min-h-9 min-w-9 rounded-lg p-2 ${
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
                          {allowShoppingList ? (
                            <button
                              type="button"
                              title="Zamienniki - wkrótce dostępne!"
                              aria-label={`Zamienniki dla składnika: ${ing.name}`}
                              className="hidden min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-lg text-ink-muted opacity-0 transition hover:bg-bg-sunken group-hover:opacity-100 sm:inline-flex"
                              onClick={(event) => {
                                event.preventDefault();
                                alert("🔜 Funkcja zamienników będzie dostępna wkrótce!");
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
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
      <div className="mb-8">
        <Eyebrow tone="accent">Krok po kroku</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
          Przygotowanie
        </h2>
      </div>

      <ol className="relative ml-4 space-y-10 border-l-2 border-dotted border-border-strong/60 sm:ml-5">
        {steps.map((step, idx) => (
          <motion.li
            key={step.stepNumber}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="relative pl-6 sm:pl-8"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-brand text-sm font-bold text-accent-deep ring-4 ring-bg sm:-left-[19px] sm:h-9 sm:w-9 sm:text-base"
            >
              {step.stepNumber}
            </span>

            <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="font-serif text-xl font-medium leading-tight text-ink">
                {step.title}
              </h3>
              {step.duration ? (
                <Badge
                  variant="neutral"
                  className="flex shrink-0 items-center gap-1.5 border border-border bg-bg-sunken"
                >
                  <Timer className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {step.duration}
                </Badge>
              ) : null}
            </div>

            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              {step.instruction}
            </p>

            {step.tip ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-saffron/20 bg-saffron-soft/40 p-4 dark:bg-saffron/10">
                <Lightbulb
                  className="mt-0.5 h-5 w-5 shrink-0 text-saffron"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-semibold">Wskazówka:</span> {step.tip}
                </p>
              </div>
            ) : null}
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}

export function TipsSection({ tips }: { tips: string[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-saffron/30 bg-[radial-gradient(ellipse_at_top_right,var(--saffron-soft),transparent_80%),var(--bg-elevated)] p-6 shadow-sm sm:p-8"
    >
      <Eyebrow tone="saffron">Dobre rady</Eyebrow>
      <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
        Wskazówki szefa kuchni
      </h2>
      <ul role="list" className="mt-5 space-y-3.5">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saffron/20 font-brand text-xs font-bold text-saffron dark:bg-saffron/30"
            >
              {idx + 1}
            </span>
            <span className="leading-relaxed text-ink-soft">{tip}</span>
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
      className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-sunken text-accent">
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
