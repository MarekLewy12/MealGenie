import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Clock3, Heart, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteMealHistory } from "../services/api";
import { notify } from "../store/notificationStore";
import type { MealHistoryItem } from "../types/meal";
import { Badge, MealEmoji } from "./ui";

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

  const createdAt = new Date(meal.createdAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-border-strong bg-bg-elevated text-ink shadow-[0_14px_30px_-26px_rgba(58,40,24,0.55),0_1px_0_rgba(255,255,255,0.42)_inset] outline outline-1 outline-offset-2 outline-border-strong/80 transition duration-base ease-out hover:-translate-y-0.5 hover:border-accent/55 hover:outline-accent/35 hover:shadow-[0_20px_38px_-28px_rgba(58,40,24,0.65),0_1px_0_rgba(255,255,255,0.45)_inset]">
      <Link
        to={`/recipe/${meal.id}`}
        className="flex min-w-0 gap-3 p-4 pr-24 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:gap-5 sm:p-5 sm:pr-32"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-bg-sunken sm:h-24 sm:w-24">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={`Zdjęcie dania: ${meal.name}`}
                className="h-full w-full object-cover brightness-[0.94] contrast-[1.03] saturate-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-accent/5 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_45%),var(--bg-sunken)]">
              <MealEmoji size="md" fallback="MG" className="text-accent" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h4 className="truncate font-brand text-lg font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-xl">
            {meal.name}
          </h4>
          {meal.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-soft">
              {meal.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            {meal.estimatedTime && (
              <Badge variant="neutral" className="gap-1.5">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                {meal.estimatedTime} min
              </Badge>
            )}
            <Badge variant="accent">{createdAt}</Badge>
            {meal.isFavorite && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-accent-soft px-2.5 py-1 text-xs font-bold leading-none text-accent-deep">
                <Heart
                  className="h-3.5 w-3.5 fill-current"
                  aria-hidden="true"
                />
                <span>ulubione</span>
              </span>
            )}
          </div>
        </div>

        <ArrowRight
          className="mt-1 hidden h-4 w-4 shrink-0 text-ink-muted transition duration-fast group-hover:translate-x-0.5 group-hover:text-accent sm:block"
          aria-hidden="true"
        />
      </Link>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          deleteMutation.mutate();
        }}
        disabled={deleteMutation.isPending}
        className="absolute right-3 top-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border border-border-strong bg-bg-elevated px-3 text-xs font-bold leading-none text-bordeaux shadow-xs transition duration-fast ease-out hover:border-bordeaux hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-sunken disabled:text-ink-disabled disabled:shadow-none"
        aria-label={`Usuń przepis: ${meal.name}`}
        title={`Usuń przepis: ${meal.name}`}
      >
        {deleteMutation.isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            <span>Usuwam</span>
          </>
        ) : (
          <>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Usuń</span>
          </>
        )}
      </button>
    </article>
  );
}
