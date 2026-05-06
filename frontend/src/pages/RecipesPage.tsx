import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, BookOpen, Loader2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

import { MealHistoryCard } from "../components/MealHistoryCard";
import { Badge, Eyebrow, FolkDivider, HandwrittenKicker } from "../components/ui";
import { getMealHistory } from "../services/api";

export function RecipesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mealHistory", "all"],
    queryFn: () => getMealHistory({ limit: 50 }),
  });

  const meals = data?.items ?? [];
  const favoriteCount = meals.filter((meal) => meal.isFavorite).length;

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8">
        <header className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
            <div className="min-w-0 p-5 sm:p-7 lg:p-8">
              <HandwrittenKicker>~ domowy zeszyt przepisów ~</HandwrittenKicker>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Eyebrow>Twoja biblioteka</Eyebrow>
                <Badge variant="neutral">{meals.length} przepisów</Badge>
                <Badge variant="accent">{favoriteCount} ulubionych</Badge>
              </div>
              <h1 className="mt-4 flex flex-wrap items-center gap-3 font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl">
                <BookOpen className="h-8 w-8 text-accent" aria-hidden="true" />
                Przepisy
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
                Wszystkie wygenerowane przepisy w jednym miejscu. Ulubione
                nadal są oznaczone sercem na kartach.
              </p>
              <div className="mt-6">
                <Link
                  to="/generator"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                >
                  Wygeneruj nowy przepis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <aside className="border-t border-dashed border-border-strong bg-bg-sunken p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
              <Eyebrow tone="muted">Stan biblioteki</Eyebrow>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatTile label="Wszystkie" value={data?.total ?? meals.length} />
                <StatTile label="Ulubione" value={favoriteCount} />
              </div>
              <FolkDivider className="my-5" />
              <p className="text-sm leading-6 text-ink-soft">
                Karty zachowują te same akcje i prowadzą do szczegółów przepisu.
              </p>
            </aside>
          </div>
        </header>

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

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-4 text-center shadow-xs">
      <div className="font-mono text-2xl font-semibold text-accent">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
    </div>
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
