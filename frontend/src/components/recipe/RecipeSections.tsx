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
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 sm:gap-3 sm:p-4 dark:border-slate-800 ${colors[color]}`}
    >
      <div className="rounded-lg bg-white/50 p-1.5 dark:bg-black/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
          {label}
        </p>
        <p className="truncate text-sm font-bold">{value}</p>
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
      color: "bg-orange-500",
    },
    { label: "Białko", value: nutrition.protein, unit: "g", color: "bg-red-500" },
    {
      label: "Węglowodany",
      value: nutrition.carbs,
      unit: "g",
      color: "bg-amber-500",
    },
    { label: "Tłuszcze", value: nutrition.fat, unit: "g", color: "bg-yellow-500" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        📊 Wartości odżywcze
        <span className="text-sm font-normal text-slate-500">(na porcję)</span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className={`mx-auto mb-2 h-1.5 w-12 rounded-full ${item.color}`} />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {item.value}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                {item.unit}
              </span>
            </p>
            <p className="text-xs text-slate-500">{item.label}</p>
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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        🥗 Składniki
      </h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => {
          const IconComponent = categoryIcons[category] || UtensilsCrossed;
          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <IconComponent className="h-4 w-4" />
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((ing, idx) => {
                  const itemKey = buildKey(ing);
                  const isInList = shoppingItems.some(
                    (item) => item.key === itemKey,
                  );

                  return (
                    <li key={idx} className="group flex items-start gap-2 sm:gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                      <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                        <div className="flex flex-1 items-center gap-1.5">
                          {allowShoppingList && (
                            <button
                              type="button"
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
                              className={`flex-shrink-0 cursor-pointer rounded-lg border p-1 transition ${
                                isInList
                                  ? "border-red-200/80 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/20"
                                  : "border-emerald-200/80 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                              }`}
                              title={
                                isInList
                                  ? "Usuń z listy zakupów"
                                  : "Dodaj do listy zakupów"
                              }
                            >
                              {isInList ? (
                                <Minus className="h-3.5 w-3.5" />
                              ) : (
                                <Plus className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {ing.name}
                          </span>
                          {ing.notes && (
                            <span className="hidden text-slate-500 sm:inline">
                              ({ing.notes})
                            </span>
                          )}
                          {allowShoppingList && (
                            <button
                              type="button"
                              title="Zamienniki - wkrótce dostępne!"
                              className="ml-1 hidden cursor-not-allowed rounded-lg p-1 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 sm:block dark:hover:bg-slate-800"
                              onClick={(event) => {
                                event.preventDefault();
                                alert("🔜 Funkcja zamienników będzie dostępna wkrótce!");
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          )}
                        </div>
                        <div
                          className={`flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2 ${
                            allowShoppingList ? "pl-7 sm:pl-0" : "pl-0"
                          }`}
                        >
                          {ing.notes && (
                            <span className="text-xs text-slate-400 sm:hidden">
                              {ing.notes}
                            </span>
                          )}
                          <span className="text-sm font-medium text-slate-500 sm:text-base">
                            {ing.amount} {ing.unit}
                          </span>
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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        👨‍🍳 Przygotowanie
      </h2>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
                  {step.stepNumber}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                  {step.title}
                </h3>
              </div>
              {step.duration && (
                <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 sm:text-xs dark:bg-slate-800 dark:text-slate-400">
                  <Timer className="h-3 w-3" />
                  {step.duration}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700 sm:text-base dark:text-slate-300">
              {step.instruction}
            </p>
            {step.tip && (
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 sm:mt-3 sm:p-3 dark:bg-amber-500/10">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600 sm:h-4 sm:w-4 dark:text-amber-400" />
                <p className="text-xs text-amber-800 sm:text-sm dark:text-amber-200">
                  {step.tip}
                </p>
              </div>
            )}
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
      className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-100">
        💡 Wskazówki szefa kuchni
      </h2>
      <ul className="space-y-3">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-500/30 dark:text-amber-200">
              {idx + 1}
            </span>
            <span className="text-amber-800 dark:text-amber-100">{tip}</span>
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
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{content}</p>
    </motion.div>
  );
}
