import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Clock3, Heart, Loader2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteMealHistory } from "../services/api";
import type { MealHistoryItem } from "../types/meal";
import { notify } from "../store/notificationStore";

type MealHistoryCardProps = {
  meal: MealHistoryItem;
};

export function MealHistoryCard({ meal }: MealHistoryCardProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteMealHistory(meal.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
      notify.success("Usunięto przepis z historii.");
    },
    onError: (err) => {
      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć przepisu.",
        "Błąd usuwania",
      );
    },
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageUrl = meal.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal.imageUrl;

  return (
    <Link
      to={`/recipe/${meal.id}`}
      className="group relative flex gap-3 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="h-14 w-14 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
            <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h4 className="truncate text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
          {meal.name}
        </h4>
        {meal.description && (
          <p className="truncate text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {meal.description}
          </p>
        )}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400">
          {meal.estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {meal.estimatedTime} min
            </span>
          )}
          <span>
            {new Date(meal.createdAt).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex items-center gap-1.5 sm:gap-2">
        {meal.isFavorite && (
          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
        )}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteMutation.mutate();
          }}
          disabled={deleteMutation.isPending}
          className="cursor-pointer rounded-full bg-red-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          aria-label="Usuń z historii"
          title="Usuń z historii"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
          ) : (
            "usuń"
          )}
        </button>
      </div>

      <div className="flex items-center">
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
      </div>
    </Link>
  );
}
