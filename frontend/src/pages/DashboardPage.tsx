import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Heart,
  Loader2,
  MessageSquare,
  Plus,
  ShoppingCart,
  Sparkles,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { AppPageHeader } from "../components/AppPageHeader";
import { MealHistoryCard } from "../components/MealHistoryCard";
import {
  Badge,
  Eyebrow,
  HandwrittenKicker,
  MealEmoji,
} from "../components/ui";
import { getMealHistory } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import {
  useShoppingListStore,
  type ShoppingItem,
} from "../store/shoppingListStore";
import type { MealHistoryItem } from "../types/meal";
import {
  DashboardEmptyState,
  DashboardHowItWorks,
  DashboardInspirationMarquee,
  QuickStartCard,
  quickStarts,
} from "../components/dashboard";

type ShoppingListCardProps = {
  items: ShoppingItem[];
  onToggleObtained: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
};

type DashboardMetricProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
};

const assistantPrompts = [
  "Co z resztek?",
  "Czym zastąpić składnik?",
  "Jak uratować danie?",
  "Co bez piekarnika?",
];

const getShoppingLabel = (item: ShoppingItem) => {
  const amountPart = [item.amount, item.unit].filter(Boolean).join(" ");
  return amountPart ? `${amountPart} ${item.name}` : item.name;
};

const formatMealDate = (createdAt: string) =>
  new Date(createdAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
  });

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Nie udało się pobrać danych.";

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "Dobranoc";
  if (hour < 12) return "Dzień dobry";
  if (hour < 18) return "Cześć";
  return "Dobry wieczór";
};

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const openGlobalChat = useChatStore((state) => state.openGlobalChat);
  const shoppingItems = useShoppingListStore((state) => state.items);
  const toggleObtained = useShoppingListStore((state) => state.toggleObtained);
  const clearShoppingList = useShoppingListStore((state) => state.clearAll);

  const greetingName = user?.name || "Kucharzu";
  const timeGreeting = getTimeGreeting();

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
  } = useQuery({
    queryKey: ["mealHistory"],
    queryFn: () => getMealHistory({ limit: 12 }),
  });

  const {
    data: favoritesData,
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
    error: favoritesError,
  } = useQuery({
    queryKey: ["mealHistory", "favorites"],
    queryFn: () => getMealHistory({ limit: 10, favoritesOnly: true }),
  });

  const recentMeals = (historyData?.items ?? []).slice(0, 3);
  const isOnboarding = recentMeals.length === 0 && !isHistoryLoading;
  const favoriteMeals = favoritesData?.items ?? [];
  const totalRecipes = historyData?.total ?? 0;
  const totalFavorites = favoritesData?.total ?? favoriteMeals.length;
  const pendingShoppingCount = shoppingItems.filter(
    (item) => !item.obtained,
  ).length;

  const dashboardMetrics: DashboardMetricProps[] = [
    {
      label: "Przepisy",
      value: isHistoryLoading ? "..." : String(totalRecipes),
      helper: "w bibliotece",
      icon: BookOpen,
      to: "/recipes",
    },
    {
      label: "Zakupy",
      value: String(pendingShoppingCount),
      helper: "do odhaczenia",
      icon: ShoppingCart,
      href: "#shopping-list",
    },
    {
      label: "Ulubione",
      value: isFavoritesLoading ? "..." : String(totalFavorites),
      helper: "do powtórzenia",
      icon: Heart,
      to: "/recipes",
    },
  ];

  const handleExportShoppingList = () => {
    if (shoppingItems.length === 0) return;

    const lines = shoppingItems.map((item) => {
      const label = getShoppingLabel(item);
      return `- [${item.obtained ? "x" : " "}] ${label}`;
    });

    const content = `Lista zakupów (MealGenie)\n\n${lines.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `mealgenie-lista-zakupow-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="min-h-full bg-bg text-ink"
      aria-labelledby="mealgenie-dashboard-title"
    >
      <DashboardHeader
        greetingName={greetingName}
        timeGreeting={timeGreeting}
        metrics={dashboardMetrics}
      />

      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8">
        <div className={`grid min-w-0 gap-6 ${isOnboarding ? "" : "xl:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_22rem]"}`}>
          <div className="min-w-0 space-y-8">
            {isOnboarding ? (
              <div className="space-y-12 lg:space-y-16">
                <DashboardEmptyState />
                <DashboardHowItWorks />
                <DashboardInspirationMarquee />
              </div>
            ) : (
              <>
                <RecentRecipesSection
                  meals={recentMeals}
                  isLoading={isHistoryLoading}
                  isError={isHistoryError}
                  errorMessage={getErrorMessage(historyError)}
                />

                <QuickStartsSection />

                <DashboardDivider />

                <FavoriteRecipesSection
                  meals={favoriteMeals}
                  totalRecipes={totalRecipes}
                  isLoading={isFavoritesLoading}
                  isError={isFavoritesError}
                  errorMessage={getErrorMessage(favoritesError)}
                />
              </>
            )}
          </div>

          {!isOnboarding && (
            <aside className="flex flex-col gap-6">
              <ShoppingListCard
                items={shoppingItems}
                onToggleObtained={toggleObtained}
                onClear={clearShoppingList}
                onExport={handleExportShoppingList}
              />

              <AssistantCard onOpen={openGlobalChat} />
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

function DashboardHeader({
  greetingName,
  timeGreeting,
  metrics,
}: {
  greetingName: string;
  timeGreeting: string;
  metrics: DashboardMetricProps[];
}) {
  return (
    <AppPageHeader
      titleId="mealgenie-dashboard-title"
      eyebrow={
        <HandwrittenKicker>
          {timeGreeting === "Cześć"
            ? "dobrze, że jesteś"
            : timeGreeting.toLowerCase()}
        </HandwrittenKicker>
      }
      title={
        <>
          {timeGreeting},{" "}
          <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
            {greetingName}
          </span>
          .
          <br className="hidden min-[480px]:inline" />
          <span className="text-ink-soft"> Co dziś ugotujemy?</span>
        </>
      }
      sideContent={metrics.map((metric) => (
        <DashboardMetricCard key={metric.label} {...metric} />
      ))}
    />
  );
}

function DashboardMetricCard({
  label,
  value,
  helper,
  icon: Icon,
  to,
  href,
}: DashboardMetricProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent dark:bg-accent/15">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-brand text-2xl font-semibold leading-none text-ink">
          {value}
        </span>
        <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {label} · {helper}
        </span>
      </span>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-xl border border-border/40 bg-bg-sunken/50 px-4 py-3.5 backdrop-blur-md transition duration-fast hover:border-accent/30 hover:bg-bg-elevated hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-accent/30 dark:hover:bg-white/[0.1]";

  if (to) return <Link to={to} className={className}>{content}</Link>;
  if (href) return <a href={href} className={className}>{content}</a>;
  return <div className={className}>{content}</div>;
}


function QuickStartsSection() {
  return (
    <section aria-labelledby="dashboard-quick-start-title">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-basil" aria-hidden="true" />
        <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
          Szybki start
        </p>
      </div>
      <h2
        id="dashboard-quick-start-title"
        className="mt-2 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl"
      >
        Nie wiesz, co zjeść?{" "}
        <span className="text-ink-soft">Wybierz sytuację.</span>
      </h2>

      <div
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        role="list"
      >
        {quickStarts.map((item) => (
          <QuickStartCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

function RecentRecipesSection({
  meals,
  isLoading,
  isError,
  errorMessage,
}: {
  meals: MealHistoryItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) {
  if (!isLoading && !isError && meals.length === 0) {
    return null;
  }

  return (
    <section
      className="pt-4"
      aria-labelledby="recent-recipes-heading"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
              Ostatnio w kuchni
            </p>
          </div>
          <h2
            id="recent-recipes-heading"
            className="mt-2 flex items-center gap-3 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl"
          >
            <Clock3 className="h-5 w-5 text-accent" aria-hidden="true" />
            Ostatnie przepisy
          </h2>
        </div>

        {meals.length > 0 && (
          <Link
            to="/recipes"
            className="inline-flex min-h-10 items-center gap-2 rounded-pill px-1 text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Zobacz bibliotekę
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <LoadingPanel label="Sprawdzam ostatnie przepisy..." />
      ) : isError ? (
        <StatePanel
          tone="error"
          title="Nie mogę teraz pobrać historii"
          description={errorMessage}
          compact
        />
      ) : meals.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-accent-soft/15 px-6 py-10 text-center dark:to-accent/[0.04] sm:px-10 sm:py-14">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-[60px] dark:bg-accent/5"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-saffron/8 blur-[50px] dark:bg-saffron/4"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft/60 text-accent dark:bg-accent/15">
              <Utensils className="h-7 w-7" aria-hidden="true" />
            </div>

            <h3 className="font-brand text-xl font-semibold text-ink sm:text-2xl">
              Pierwszy przepis dopiero czeka
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
              Wybierz pomysł na dziś, a gdy przejdziesz do przepisu, wróci tutaj
              jako część Twojej kuchennej historii.
            </p>

            <Link
              to="/generator"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-6 py-2.5 text-sm font-semibold text-ink-inverse shadow-[0_0_20px_-6px_rgba(232,111,69,0.35)] transition duration-fast hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_0_28px_-6px_rgba(232,111,69,0.45)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Stwórz pierwszy przepis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <HeroMealCard meal={meals[0]} />

          {meals.length > 1 && (
            <div className="grid gap-3 lg:grid-cols-2">
              {meals.slice(1).map((meal) => (
                <MealHistoryCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function FavoriteRecipesSection({
  meals,
  totalRecipes,
  isLoading,
  isError,
  errorMessage,
}: {
  meals: MealHistoryItem[];
  totalRecipes: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) {
  if (!isLoading && !isError && totalRecipes === 0) {
    return null;
  }

  return (
    <section
      className="pt-4 pb-8"
      aria-labelledby="favorite-recipes-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="accent">Do powtórzenia</Eyebrow>
          <h2
            id="favorite-recipes-heading"
            className="mt-1 flex items-center gap-2 font-brand text-2xl font-semibold text-ink sm:text-3xl"
          >
            <Heart className="h-6 w-6 text-bordeaux" aria-hidden="true" />
            Ulubione przepisy
          </h2>
        </div>

        <Link
          to="/recipes"
          className="inline-flex min-h-10 items-center gap-2 rounded-pill px-1 text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
        >
          Wszystkie przepisy
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <LoadingPanel label="Sprawdzam ulubione przepisy..." compact />
      ) : isError ? (
        <StatePanel
          tone="error"
          title="Nie mogę teraz pobrać ulubionych"
          description={errorMessage}
          compact
        />
      ) : meals.length === 0 ? (
        <EmptyPanel
          title="Nie masz jeszcze dań do powtórzenia"
          description="Gdy trafisz na przepis wart drugiego gotowania, oznacz go sercem — pokażemy go tutaj."
          compact
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {meals.slice(0, 4).map((meal) => (
            <MealHistoryCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}

function ShoppingListCard({
  items,
  onToggleObtained,
  onClear,
  onExport,
}: ShoppingListCardProps) {
  const obtainedCount = items.filter((item) => item.obtained).length;
  const pendingCount = items.length - obtainedCount;
  const progress = items.length > 0 ? (obtainedCount / items.length) * 100 : 0;
  const visibleItems = items.slice(0, 7);
  const hiddenCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <section
      id="shopping-list"
      className="flex flex-1 flex-col rounded-xl border border-border/60 bg-bg-elevated p-6 text-ink"
      aria-labelledby="shopping-list-heading"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Do koszyka
          </p>
          <h2
            id="shopping-list-heading"
            className="mt-1 flex items-center gap-2 font-brand text-lg font-semibold text-ink"
          >
            <ShoppingCart className="h-4.5 w-4.5 text-basil" aria-hidden="true" />
            Lista zakupów
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-basil/30 via-basil/10 to-transparent" />
        </div>

        <Badge variant={pendingCount > 0 ? "accent" : "neutral"}>
          {pendingCount}
        </Badge>
      </div>

      <div className="flex-1">
        {items.length > 0 ? (
          <>
            <div className="mb-4 rounded-lg border border-border bg-bg-sunken p-3">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-muted">
                <span>Odhaczone</span>
                <span>
                  {obtainedCount}/{items.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-pill bg-bg-elevated">
                <div
                  className="h-full rounded-pill bg-basil transition-all duration-base"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul role="list" className="space-y-2">
              {visibleItems.map((item) => {
                const label = getShoppingLabel(item);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onToggleObtained(item.id)}
                      className="group flex min-h-12 w-full items-start gap-3 rounded-lg border border-transparent px-2 py-2 text-left transition duration-fast hover:border-border hover:bg-bg-sunken focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                      aria-label={
                        item.obtained
                          ? `Oznacz jako do kupienia: ${label}`
                          : `Oznacz jako kupione: ${label}`
                      }
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border transition ${
                          item.obtained
                            ? "border-basil bg-basil text-ink-inverse"
                            : "border-border-strong bg-bg-elevated text-transparent group-hover:border-basil"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-semibold leading-5 ${
                            item.obtained
                              ? "text-ink-muted line-through"
                              : "text-ink"
                          }`}
                        >
                          {label}
                        </span>

                        {item.notes ? (
                          <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
                            {item.notes}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {hiddenCount > 0 ? (
              <p className="mt-3 rounded-lg bg-bg-sunken px-3 py-2 text-center text-xs font-semibold text-ink-muted">
                I jeszcze {hiddenCount} na liście.
              </p>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border-strong bg-bg-sunken px-4 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-bg-elevated text-accent shadow-xs">
              <Plus className="h-6 w-6" aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-brand text-lg font-semibold text-ink">
              Lista czeka na składniki
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink-soft">
              Wybierz przepis, a brakujące produkty pojawią się tutaj do
              odhaczenia.
            </p>

            <Link
              to="/generator"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-semibold text-accent shadow-xs transition hover:border-accent/45 hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Wygeneruj przepis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClear}
            disabled={items.length === 0}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg-sunken px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-bordeaux/40 hover:bg-accent-soft hover:text-bordeaux disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:bg-bg-sunken disabled:hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Wyczyść
          </button>

          <button
            type="button"
            onClick={onExport}
            disabled={items.length === 0}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg-sunken px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-accent/45 hover:bg-accent-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:bg-bg-sunken disabled:hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Eksport
          </button>
        </div>
      </div>
    </section>
  );
}

function AssistantCard({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="rounded-xl border border-border/60 bg-bg-elevated p-6 text-ink">
      <div className="mb-4">
        <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Asystent kuchenny
        </p>
        <h2 className="mt-1 flex items-center gap-2 font-brand text-lg font-semibold text-ink">
          <MessageSquare className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
          Zapytaj przy blacie
        </h2>
        <div className="mt-2 h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />
      </div>

      <p className="text-sm leading-6 text-ink-soft">
        Zamienniki, resztki i szybkie pytania w trakcie gotowania — bez
        wychodzenia z flow.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {assistantPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={onOpen}
            className="rounded-lg border border-border-strong bg-bg-sunken px-3.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-basil-soft hover:text-basil focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            {prompt}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-accent shadow-xs transition hover:border-basil hover:bg-basil-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      >
        Otwórz asystenta
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}

function HeroMealCard({ meal }: { meal: MealHistoryItem }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageUrl = meal.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal.imageUrl;

  return (
    <Link
      to={`/recipe/${meal.id}`}
      className="group relative block min-h-72 overflow-hidden rounded-2xl text-ink shadow-lg transition duration-base hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:min-h-80"
    >
      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Zdjęcie dania: ${meal.name}`}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.92] contrast-[1.04] saturate-[1.04] transition duration-slow group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_45%),var(--bg-sunken)]">
          <div className="flex h-full w-full items-center justify-center">
            <MealEmoji size="lg" fallback="MG" className="text-accent" />
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <Badge
          variant="accent"
          className="gap-1.5 bg-bg-elevated/90 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Ostatnio gotowane
        </Badge>

        {meal.isFavorite && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated/90 text-bordeaux shadow-sm backdrop-blur-sm">
            <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
            <span className="sr-only">Ulubiony przepis</span>
          </span>
        )}
      </div>

      {/* Bottom content - on image */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <h3 className="break-words font-brand text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
          {meal.name}
        </h3>

        {meal.description ? (
          <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-white/75 sm:text-base">
            {meal.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {meal.estimatedTime ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                {meal.estimatedTime} min
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {formatMealDate(meal.createdAt)}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            Zobacz przepis
            <ArrowRight
              className="h-4 w-4 transition duration-fast group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function DashboardDivider() {
  return (
    <div aria-hidden="true" className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border-strong/60 to-transparent" />
    </div>
  );
}

function LoadingPanel({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-border bg-bg-sunken px-5 text-center ${
        compact ? "min-h-40 py-8" : "min-h-64 py-12"
      }`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold text-ink-soft">{label}</p>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
  action,
  compact = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl px-5 text-center ${
        compact
          ? "min-h-40 border border-dashed border-border-strong bg-transparent py-8"
          : "min-h-64 overflow-hidden border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-accent-soft/10 py-12 dark:to-accent/[0.04]"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-bg-elevated text-accent shadow-xs">
        <Utensils className="h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-brand text-xl font-semibold text-ink">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function StatePanel({
  tone,
  title,
  description,
  action,
  compact = false,
}: {
  tone: "error" | "empty";
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  const isError = tone === "error";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border px-5 text-center shadow-sm ${
        compact ? "min-h-40 py-8" : "min-h-64 py-12"
      } ${
        isError
          ? "border-bordeaux/35 bg-accent-soft text-bordeaux"
          : "border-dashed border-border-strong bg-bg-sunken text-ink"
      }`}
      role={isError ? "alert" : undefined}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          isError ? "bg-bg-elevated text-bordeaux" : "bg-bg-elevated text-accent"
        }`}
      >
        {isError ? (
          <Sparkles className="h-7 w-7" aria-hidden="true" />
        ) : (
          <Utensils className="h-7 w-7" aria-hidden="true" />
        )}
      </div>

      <h3 className="mt-4 font-brand text-xl font-semibold text-ink">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
