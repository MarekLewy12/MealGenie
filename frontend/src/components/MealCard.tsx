import type { MealSuggestion } from "../types/meal";

type MealCardProps = {
  meal: MealSuggestion;
  onSelect: () => void;
  showAction?: boolean;
};

const difficultyColors: Record<MealSuggestion["difficulty"], string> = {
  Easy:
    "border border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-200",
  Medium:
    "border border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/15 dark:text-yellow-100",
  Hard:
    "border border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-200",
};

export function MealCard({ meal, onSelect, showAction = true }: MealCardProps) {
  const displayedIngredients = meal.ingredients.slice(0, 4);
  const remainingCount = meal.ingredients.length - displayedIngredients.length;
  const imageSrc = meal.imageUrl?.startsWith("/meal-images/")
    ? `http://localhost:3000${meal.imageUrl}`
    : meal.imageUrl;

  return (
    <div className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-xl shadow-indigo-100/60 transition hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-indigo-200/70 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/40 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-900/30">
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={meal.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 brightness-[0.92] contrast-[1.08] saturate-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600">
            <svg
              className="h-16 w-16 text-white opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {meal.name}
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {meal.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyColors[meal.difficulty]}`}
          >
            {meal.difficulty}
          </span>
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
            Czas: {meal.cookingTimeMinutes} min
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-[0_0_20px_rgba(245,158,11,0.15)] dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-100">
            Kalorie: {meal.calories ? `${meal.calories} kcal` : 'n/d'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
            Składniki
          </div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {displayedIngredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.08)]" />
                <span className="flex-1">{ingredient.name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {ingredient.amount}
                  {ingredient.unit ? ` ${ingredient.unit}` : ''}
                </span>
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="text-sm text-slate-500 dark:text-slate-400">
                + {remainingCount} więcej
              </li>
            )}
          </ul>
        </div>

        {showAction && (
          <div className="mt-auto pt-2">
            <button
              onClick={onSelect}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-200/70 transition hover:-translate-y-0.5 hover:shadow-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:shadow-amber-900/30 dark:hover:shadow-amber-900/50"
            >
              Wybieram to danie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
