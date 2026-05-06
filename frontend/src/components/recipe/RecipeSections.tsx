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
import { Badge, Card, DottedRow, Eyebrow, IconButton } from "../ui";

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
      className={`flex min-h-[76px] items-center gap-2 rounded-lg border border-border p-2.5 shadow-xs sm:gap-3 sm:p-4 ${colors[color]}`}
    >
      <div className="rounded-md bg-bg-elevated/70 p-1.5 text-accent shadow-xs">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </p>
        <p className="truncate font-serif text-base font-medium leading-tight text-ink">
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
      label: "Węglowodany",
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
        <Eyebrow>Na porcję</Eyebrow>
        <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
          Wartości odżywcze
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <Card
            key={item.label}
            className="p-4 text-center"
          >
            <div className={`mx-auto mb-3 h-1.5 w-12 rounded-pill ${item.accent}`} />
            <p className="font-serif text-2xl font-medium leading-none text-ink">
              {item.value}
              <span className="font-sans text-sm font-normal text-ink-muted">
                {" "}
                {item.unit}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-muted">{item.label}</p>
          </Card>
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
        <Eyebrow>Lista do przygotowania</Eyebrow>
        <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
          Składniki
        </h2>
      </div>
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => {
          const IconComponent = categoryIcons[category] || UtensilsCrossed;
          return (
            <Card
              key={category}
              className="p-4 sm:p-5"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <IconComponent className="h-4 w-4 text-accent" aria-hidden="true" />
                {category}
              </h3>
              <ul role="list" className="space-y-2.5">
                {items.map((ing, idx) => {
                  const itemKey = buildKey(ing);
                  const isInList = shoppingItems.some(
                    (item) => item.key === itemKey,
                  );

                  return (
                    <li key={idx} className="group">
                      <div className="flex items-start gap-2 sm:items-center">
                        <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent sm:mt-0" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <DottedRow
                            label={
                              <span>
                                <span className="font-medium text-ink">{ing.name}</span>
                                {ing.notes && (
                                  <span className="ml-1 text-xs text-ink-muted sm:text-sm">
                                    ({ing.notes})
                                  </span>
                                )}
                              </span>
                            }
                            value={`${ing.amount} ${ing.unit}`}
                            className="font-serif text-base"
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {allowShoppingList && (
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
                              className={`min-h-9 min-w-9 rounded-pill p-2 ${
                                isInList
                                  ? "text-bordeaux hover:bg-accent-soft hover:text-bordeaux"
                                  : "text-basil hover:text-basil"
                              }`}
                              title={
                                isInList
                                  ? "Usuń z listy zakupów"
                                  : "Dodaj do listy zakupów"
                              }
                            />
                          )}
                          {allowShoppingList && (
                            <button
                              type="button"
                              title="Zamienniki - wkrótce dostępne!"
                              aria-label={`Zamienniki dla składnika: ${ing.name}`}
                              className="hidden min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-pill text-ink-muted opacity-0 transition hover:bg-bg-sunken group-hover:opacity-100 sm:inline-flex"
                              onClick={(event) => {
                                event.preventDefault();
                                alert("🔜 Funkcja zamienników będzie dostępna wkrótce!");
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
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
      <div className="mb-4">
        <Eyebrow>Jak ugotować</Eyebrow>
        <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
          Przygotowanie
        </h2>
      </div>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <motion.li
            key={step.stepNumber}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="rounded-lg border border-border bg-bg-elevated p-4 shadow-sm sm:p-5"
          >
            <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-pill bg-accent-soft font-mono text-sm font-semibold text-accent-deep ring-1 ring-border"
                >
                  {step.stepNumber}
                </span>
                <h3 className="font-serif text-lg font-medium leading-tight text-ink">
                  {step.title}
                </h3>
              </div>
              {step.duration && (
                <Badge variant="neutral" className="flex flex-shrink-0 items-center gap-1">
                  <Timer className="h-3 w-3" aria-hidden="true" />
                  {step.duration}
                </Badge>
              )}
            </div>
            <p className="border-t border-dotted border-border-dotted pt-3 text-base leading-relaxed text-ink-soft">
              {step.instruction}
            </p>
            {step.tip && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-saffron/30 bg-saffron-soft p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink">
                  {step.tip}
                </p>
              </div>
            )}
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
      className="rounded-lg border border-border bg-bg-elevated p-5 shadow-sm"
    >
      <Eyebrow tone="saffron">Dobre rady</Eyebrow>
      <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink">
        Wskazówki szefa kuchni
      </h2>
      <ul role="list" className="mt-4 space-y-3">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-pill bg-saffron-soft font-mono text-xs font-semibold text-saffron"
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
      className="rounded-lg border border-border bg-bg-elevated p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-serif text-xl font-medium leading-tight text-ink">
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-ink-soft">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}
