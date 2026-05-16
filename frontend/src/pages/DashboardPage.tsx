import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChefHat,
  Clock3,
  Coffee,
  Heart,
  Loader2,
  MessageSquare,
  Moon,
  Plus,
  ShoppingCart,
  Sparkles,
  Timer,
  Utensils,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

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

type QuickStartItem = {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
};

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

const quickStarts: QuickStartItem[] = [
  {
    to: "/generator?mealType=SNACK&prepTime=15",
    icon: Timer,
    title: "Mam 15 minut",
    description: "Szybki posiłek bez kombinowania",
    tone: "bg-accent-soft text-accent",
  },
  {
    to: "/generator?mealType=LUNCH&prepTime=30",
    icon: Utensils,
    title: "Obiad po pracy",
    description: "Porządnie, ale bez spiny",
    tone: "bg-basil-soft text-basil",
  },
  {
    to: "/generator?mealType=DINNER&prepTime=25",
    icon: Moon,
    title: "Lekka kolacja",
    description: "Konkretnie i spokojnie",
    tone: "bg-bordeaux/10 text-bordeaux",
  },
  {
    to: "/generator?mealType=BREAKFAST&prepTime=20",
    icon: Coffee,
    title: "Spokojne śniadanie",
    description: "Dobry start bez pośpiechu",
    tone: "bg-saffron-soft text-ink",
  },
  {
    to: "/generator?mealType=DESSERT&prepTime=30",
    icon: Sparkles,
    title: "Coś słodkiego",
    description: "Mała przyjemność",
    tone: "bg-accent-soft text-accent-deep",
  },
  {
    to: "/generator?mealType=ANY&prepTime=60",
    icon: ChefHat,
    title: "Wielkie gotowanie",
    description: "Na spokojnie, dla relaksu",
    tone: "bg-saffron-soft text-saffron",
  },
];

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

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const openGlobalChat = useChatStore((state) => state.openGlobalChat);
  const shoppingItems = useShoppingListStore((state) => state.items);
  const toggleObtained = useShoppingListStore((state) => state.toggleObtained);
  const clearShoppingList = useShoppingListStore((state) => state.clearAll);

  const greetingName = user?.name || "Kucharzu";

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
      className="min-h-full bg-bg px-4 py-5 text-ink sm:px-6 lg:px-8 lg:py-6"
      aria-labelledby="mealgenie-dashboard-title"
    >
      <div className="mx-auto flex max-w-[1760px] flex-col gap-6">
        <DashboardWelcomePanel
          greetingName={greetingName}
          metrics={dashboardMetrics}
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <MainActionBanner onOpenAssistant={openGlobalChat} />

            <QuickStartsSection />

            <RecentRecipesSection
              meals={recentMeals}
              isLoading={isHistoryLoading}
              isError={isHistoryError}
              errorMessage={getErrorMessage(historyError)}
            />

            <FavoriteRecipesSection
              meals={favoriteMeals}
              totalRecipes={totalRecipes}
              isLoading={isFavoritesLoading}
              isError={isFavoritesError}
              errorMessage={getErrorMessage(favoritesError)}
            />
          </div>

          <aside className="flex flex-col gap-6">
            <ShoppingListCard
              items={shoppingItems}
              onToggleObtained={toggleObtained}
              onClear={clearShoppingList}
              onExport={handleExportShoppingList}
            />

            <AssistantCard onOpen={openGlobalChat} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function DashboardWelcomePanel({
  greetingName,
  metrics,
}: {
  greetingName: string;
  metrics: DashboardMetricProps[];
}) {
  return (
    <header className="overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-sm">
      <div className="grid gap-6 p-5 sm:p-7 lg:p-8 2xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.48fr)] 2xl:items-end">
        <div className="max-w-4xl">
          <HandwrittenKicker>dobrze, że jesteś</HandwrittenKicker>

          <h1
            id="mealgenie-dashboard-title"
            className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl"
          >
            Cześć, {greetingName}.{" "}
            <span className="text-accent">Co dziś ugotujemy?</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            Zacznij od pomysłu, wróć do ostatniego przepisu albo dokończ listę
            zakupów. MealGenie ma zdjąć z Ciebie decyzję, nie dorzucić kolejną.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 2xl:grid-cols-1">
          {metrics.map((metric) => (
            <DashboardMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </header>
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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-bg-elevated text-accent shadow-xs">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block font-brand text-2xl font-semibold leading-none text-ink">
          {value}
        </span>
        <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {label} · {helper}
        </span>
      </span>
    </>
  );

  const className =
    "flex min-h-16 items-center gap-3 rounded-lg border border-border bg-bg-sunken px-4 py-3 text-left transition duration-fast hover:border-accent/45 hover:bg-accent-soft/55 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function MainActionBanner({
  onOpenAssistant,
}: {
  onOpenAssistant: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-accent/30 bg-bg-elevated shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-saffron/15 blur-3xl"
      />

      <div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent shadow-xs">
            <Wand2 className="h-6 w-6" aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <Eyebrow tone="accent">Pomysł na dziś</Eyebrow>
            <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Nie wiesz, co zjeść?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
              Opisz dzień, składniki albo nastrój, a MealGenie dobierze kilka
              sensownych propozycji. Bez przekopywania internetu.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link
            to="/generator"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Dobierz pomysł
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={onOpenAssistant}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition duration-fast hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            <MessageSquare className="h-4 w-4 text-accent" aria-hidden="true" />
            Zapytaj o resztki
          </button>
        </div>
      </div>
    </section>
  );
}

function QuickStartsSection() {
  return (
    <section className="pt-2">
      <div className="mb-4">
        <Eyebrow tone="muted">Szybki start</Eyebrow>
        <h2 className="mt-1 font-brand text-2xl font-semibold text-ink sm:text-3xl">
          Wybierz sytuację
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickStarts.map((item) => (
          <QuickStartCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

function QuickStartCard({ item }: { item: QuickStartItem }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className="group flex min-h-24 items-center gap-4 rounded-lg border border-border bg-bg-elevated p-4 shadow-xs transition duration-fast hover:-translate-y-0.5 hover:border-accent/50 hover:bg-bg-sunken hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.tone}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block font-brand text-lg font-semibold leading-tight text-ink">
          {item.title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-ink-soft">
          {item.description}
        </span>
      </span>
    </Link>
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
  return (
    <section
      className="pt-4"
      aria-labelledby="recent-recipes-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="muted">Ostatnio w kuchni</Eyebrow>
          <h2
            id="recent-recipes-heading"
            className="mt-1 flex items-center gap-2 font-brand text-2xl font-semibold text-ink sm:text-3xl"
          >
            <Clock3 className="h-6 w-6 text-accent" aria-hidden="true" />
            Ostatnie przepisy
          </h2>
        </div>

        <Link
          to="/recipes"
          className="inline-flex min-h-10 items-center gap-2 rounded-pill px-1 text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
        >
          Zobacz bibliotekę
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
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
        <EmptyPanel
          title="Pierwszy przepis dopiero czeka"
          description="Wybierz pomysł na dziś, a gdy przejdziesz do przepisu, wróci tutaj jako część Twojej kuchennej historii."
          action={
            <Link
              to="/generator"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse shadow-accent transition hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Stwórz pierwszy przepis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
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
      className="flex flex-1 flex-col rounded-xl border border-border bg-bg-elevated p-5 text-ink shadow-sm"
      aria-labelledby="shopping-list-heading"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <Eyebrow tone="saffron">Do koszyka</Eyebrow>
          <h2
            id="shopping-list-heading"
            className="mt-2 flex items-center gap-2 font-brand text-2xl font-semibold leading-tight text-ink"
          >
            <ShoppingCart className="h-5 w-5 text-accent" aria-hidden="true" />
            Lista zakupów
          </h2>
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
    <section className="rounded-xl border border-border bg-bg-elevated p-5 text-ink shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-basil/30 bg-basil-soft text-basil">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <Eyebrow tone="basil">Asystent kuchenny</Eyebrow>
          <h2 className="mt-2 font-brand text-2xl font-semibold leading-tight text-ink">
            Zapytaj przy blacie
          </h2>
        </div>
      </div>

      <p className="text-sm leading-6 text-ink-soft">
        Zamienniki, resztki i szybkie pytania w trakcie gotowania — bez
        wychodzenia z flow.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {assistantPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={onOpen}
            className="flex min-h-10 items-center justify-center rounded-lg bg-bg-sunken px-2 text-center text-xs font-semibold leading-tight text-ink-soft transition hover:bg-basil-soft hover:text-basil focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
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
      className="group block min-w-0 overflow-hidden rounded-xl border border-border-strong bg-bg-elevated text-ink shadow-md transition duration-base hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
    >
      <div className="grid min-w-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-56 overflow-hidden bg-bg-sunken">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={`Zdjęcie dania: ${meal.name}`}
                className="h-full min-h-56 w-full object-cover brightness-[0.94] contrast-[1.03] saturate-[1.03] transition duration-slow group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-accent/5 to-transparent" />
            </>
          ) : (
            <div className="flex h-full min-h-56 w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_45%),var(--bg-sunken)]">
              <MealEmoji size="lg" fallback="MG" className="text-accent" />
            </div>
          )}

          <Badge
            variant="accent"
            className="absolute left-4 top-4 gap-1.5 bg-bg-elevated/95 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Ostatnio gotowane
          </Badge>

          {meal.isFavorite && (
            <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated/95 text-bordeaux shadow-xs">
              <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
              <span className="sr-only">Ulubiony przepis</span>
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
          <div className="min-w-0">
            <Eyebrow tone="muted">Najnowsza karta</Eyebrow>

            <h3 className="mt-3 break-words font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              {meal.name}
            </h3>

            {meal.description ? (
              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-ink-soft sm:text-base">
                {meal.description}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              {meal.estimatedTime ? (
                <Badge variant="neutral" className="gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {meal.estimatedTime} min
                </Badge>
              ) : null}

              <Badge variant="saffron">{formatMealDate(meal.createdAt)}</Badge>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              Zobacz przepis
              <ArrowRight
                className="h-4 w-4 transition duration-fast group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
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
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-transparent px-5 text-center ${
        compact ? "min-h-40 py-8" : "min-h-64 py-12"
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
