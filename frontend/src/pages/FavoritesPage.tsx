import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, Utensils } from "lucide-react";
import { MealHistoryCard } from "../components/MealHistoryCard";
import { getMealHistory } from "../services/api";

export function FavoritesPage() {
  const {
    data: favoritesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["mealHistory", "favorites", "all"],
    queryFn: () => getMealHistory({ favoritesOnly: true, limit: 50 }),
  });

  const favoriteMeals = favoritesData?.items ?? [];

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Twoja kolekcja
        </p>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          <Heart className="h-6 w-6 text-red-400" />
          Ulubione przepisy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Szybki dostęp do zapisanych przepisów z historii.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error instanceof Error
            ? error.message
            : "Nie udało się załadować ulubionych przepisów."}
        </div>
      ) : favoriteMeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-rose-300/70 bg-rose-50/40 py-16 text-center dark:border-rose-400/30 dark:bg-white/5">
          <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-white/5">
            <Utensils className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold">Brak ulubionych</h4>
          <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Dodaj serduszko przy przepisie, aby pojawił się tutaj.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {favoriteMeals.map((meal) => (
            <MealHistoryCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}
