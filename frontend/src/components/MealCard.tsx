import type { MealSuggestion } from '../types/meal';

type MealCardProps = {
  meal: MealSuggestion;
  onSelect: () => void;
};

const difficultyColors: Record<MealSuggestion['difficulty'], string> = {
  Easy: 'bg-green-500/15 text-green-200 border border-green-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-100 border border-yellow-500/30',
  Hard: 'bg-red-500/15 text-red-200 border border-red-500/30',
};

export function MealCard({ meal, onSelect }: MealCardProps) {
  const displayedIngredients = meal.ingredients.slice(0, 4);
  const remainingCount = meal.ingredients.length - displayedIngredients.length;

  return (
    <div className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40 transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-indigo-900/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{meal.name}</h3>
          <p className="mt-2 text-sm text-slate-300">{meal.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyColors[meal.difficulty]}`}>
          {meal.difficulty}
        </span>
        <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-100">
          Czas: {meal.cookingTimeMinutes} min
        </span>
        <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          Kalorie: {meal.calories ? `${meal.calories} kcal` : 'n/d'}
        </span>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
          Składniki
        </div>
        <ul className="space-y-2 text-sm text-slate-200">
          {displayedIngredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.08)]" />
              <span className="flex-1">{ingredient.name}</span>
              <span className="text-slate-400">
                {ingredient.amount}
                {ingredient.unit ? ` ${ingredient.unit}` : ''}
              </span>
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="text-sm text-slate-400">+ {remainingCount} więcej</li>
          )}
        </ul>
      </div>

      <div className="mt-auto pt-2">
        <button
          onClick={onSelect}
          className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5 hover:shadow-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          Wybieram to danie
        </button>
      </div>
    </div>
  );
}
