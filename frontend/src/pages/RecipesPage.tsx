import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, BookOpen, Loader2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

import { AppPageHeader } from "../components/AppPageHeader";
import { MealHistoryCard } from "../components/MealHistoryCard";
import { Eyebrow, HandwrittenKicker } from "../components/ui";
import { getMealHistory } from "../services/api";

export function RecipesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mealHistory", "all"],
    queryFn: () => getMealHistory({ limit: 50 }),
  });

  const meals = data?.items ?? [];

  return (
    <main className="min-h-screen bg-bg text-ink">
      <AppPageHeader
        maxWidthClassName="max-w-screen-2xl"
        eyebrow={<HandwrittenKicker>~ domowy zeszyt przepisów ~</HandwrittenKicker>}
        title={
          <span className="inline-flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-accent sm:h-8 sm:w-8" aria-hidden="true" />
            Przepisy
          </span>
        }
        description="Wszystkie wygenerowane przepisy w jednym miejscu. Ulubione nadal są oznaczone sercem na kartach."
        action={
          <Link
            to="/generator"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Generuj nowy przepis
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-8 pt-6 sm:px-6 sm:pb-12 lg:px-8 lg:pt-8">
        {isLoading ? (
          <StatePanel
            tone="loading"
            title="Ładuję bibliotekę przepisów"
            description="Zbieram Twoje ostatnio wygenerowane dania."
          />
        ) : isError ? (
          <StatePanel
            tone="error"
            title="Nie udało się załadować przepisów"
            description={
              error instanceof Error
                ? error.message
                : "Spróbuj ponownie za chwilę."
            }
          />
        ) : meals.length === 0 ? (
          <StatePanel
            tone="empty"
            title="Biblioteka jest jeszcze pusta"
            description="Wygeneruj pierwszy przepis, a pojawi się tutaj jako papierowa karta."
            action={
              <Link
                to="/generator"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Przejdź do generatora
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        ) : (
          <section aria-labelledby="recipes-list-heading">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow tone="muted">Zapisane dania</Eyebrow>
                <h2
                  id="recipes-list-heading"
                  className="mt-2 font-brand text-2xl font-semibold text-ink"
                >
                  Ostatnie przepisy
                </h2>
              </div>
              <span className="text-sm text-ink-muted">
                Pokazuję {meals.length} z {data?.total ?? meals.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {meals.map((meal) => (
                <MealHistoryCard key={meal.id} meal={meal} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatePanel({
  tone,
  title,
  description,
  action,
}: {
  tone: "loading" | "error" | "empty";
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const isLoading = tone === "loading";
  const isError = tone === "error";

  return (
    <section
      className={`flex min-h-80 flex-col items-center justify-center rounded-lg border px-5 py-14 text-center shadow-sm ${
        isError
          ? "border-bordeaux/40 bg-accent-soft text-bordeaux"
          : "border-dashed border-border-strong bg-bg-elevated text-ink"
      }`}
      role={isLoading ? "status" : undefined}
      aria-live={isLoading ? "polite" : undefined}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          isError ? "bg-bg-elevated text-bordeaux" : "bg-bg-sunken text-accent"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
        ) : isError ? (
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        ) : (
          <Utensils className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
      <h2 className="mt-5 font-brand text-2xl font-semibold text-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-soft">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
