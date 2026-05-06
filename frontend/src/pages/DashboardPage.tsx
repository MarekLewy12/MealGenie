import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock3,
  Heart,
  Loader2,
  MessageSquare,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
  Utensils,
  Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { MealHistoryCard } from "../components/MealHistoryCard";
import {
  Badge,
  Eyebrow,
  FolkDivider,
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

const quickStarts = [
  {
    to: "/generator?mealType=SNACK&prepTime=15",
    icon: "15",
    title: "Szybki posiłek",
    description: "Gotowe w kwadrans",
  },
  {
    to: "/generator?mealType=BREAKFAST&prepTime=30",
    icon: "Pn",
    title: "Śniadanie",
    description: "Spokojny start dnia",
  },
  {
    to: "/generator?mealType=LUNCH&prepTime=45",
    icon: "Ob",
    title: "Pełny obiad",
    description: "Coś porządnego",
  },
  {
    to: "/generator?mealType=DINNER&prepTime=30",
    icon: "Ko",
    title: "Lekka kolacja",
    description: "Bez ciężaru na noc",
  },
  {
    to: "/generator?mealType=DESSERT&prepTime=30",
    icon: "Ds",
    title: "Deser",
    description: "Mała przyjemność",
  },
];

const formatDashboardDate = () =>
  new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const formatMealDate = (createdAt: string) =>
  new Date(createdAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
  });

const getShoppingLabel = (item: ShoppingItem) => {
  const amountPart = [item.amount, item.unit].filter(Boolean).join(" ");
  return amountPart ? `${amountPart} ${item.name}` : item.name;
};

type ShoppingListCardProps = {
  items: ShoppingItem[];
  onToggleObtained: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
};

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const openGlobalChat = useChatStore((state) => state.openGlobalChat);
  const shoppingItems = useShoppingListStore((state) => state.items);
  const toggleObtained = useShoppingListStore((state) => state.toggleObtained);
  const clearShoppingList = useShoppingListStore((state) => state.clearAll);
  const greetingName = user?.name || "Kucharzu";

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["mealHistory"],
    queryFn: () => getMealHistory({ limit: 12 }),
  });

  const { data: favoritesData, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ["mealHistory", "favorites"],
    queryFn: () => getMealHistory({ limit: 10, favoritesOnly: true }),
  });

  const recentMeals = (historyData?.items ?? [])
    .filter((meal) => !meal.isFavorite)
    .slice(0, 3);
  const favoriteMeals = favoritesData?.items ?? [];
  const totalRecipes = historyData?.total ?? 0;

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
    <main className="min-h-screen bg-bg px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated/70 px-5 py-6 shadow-sm sm:px-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <HandwrittenKicker>~ dobrze, że jesteś ~</HandwrittenKicker>
            <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
              Cześć, {greetingName}.{" "}
              <em className="text-accent">Co dziś ugotujemy?</em>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              Twoje przepisy, ulubione dania i lista zakupów w jednym spokojnym
              miejscu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <Badge variant="neutral" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDashboardDate()}
            </Badge>
            <Badge variant="accent">{totalRecipes} przepisów</Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
          <aside className="flex min-w-0 flex-col gap-5 xl:col-span-4 2xl:col-span-3">
            <section className="relative overflow-hidden rounded-lg border border-accent/25 bg-bg-elevated p-5 text-ink shadow-md sm:p-6">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-soft/70 blur-2xl" />
              <div className="absolute -bottom-14 left-8 h-28 w-28 rounded-full bg-saffron-soft/70 blur-2xl" />
              <div className="relative">
                <Eyebrow>Start generatora</Eyebrow>
                <div className="mt-5 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border-strong bg-bg-sunken text-accent shadow-xs">
                    <Sparkles className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-brand text-2xl font-semibold leading-tight text-ink">
                      Nie wiesz, co zjeść?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      Podaj składniki i czas, a MealGenie dobierze coś do
                      Twojej kuchni.
                    </p>
                  </div>
                </div>
                <FolkDivider className="my-5" />
                <Link
                  to="/generator"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                >
                  Uruchom generator
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-bg-elevated p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border-strong bg-basil-soft text-basil">
                  <MessageSquare className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <Eyebrow tone="basil">Asystent kuchenny</Eyebrow>
                  <h2 className="mt-2 font-brand text-xl font-semibold text-ink">
                    Zapytaj bez wychodzenia z dashboardu
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Zamienniki składników, pomysły na resztki i szybkie triki
                    do gotowania.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openGlobalChat}
                className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold leading-none text-accent shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Otwórz asystenta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </section>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Link
                to="/settings"
                className="group flex min-w-0 items-center gap-4 rounded-lg border border-border bg-bg-elevated p-4 text-left shadow-sm transition duration-fast hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent-soft/45 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border-strong bg-bg-sunken text-ink-soft group-hover:text-accent">
                  <Settings className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-brand text-base font-semibold text-ink">
                    Preferencje
                  </span>
                  <span className="block text-sm text-ink-soft">
                    Ustawienia gotowania
                  </span>
                </span>
              </Link>
              <Link
                to="/recipes"
                className="group flex min-w-0 items-center gap-4 rounded-lg border border-border bg-bg-elevated p-4 text-left shadow-sm transition duration-fast hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent-soft/45 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border-strong bg-bg-sunken text-ink-soft group-hover:text-accent">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-brand text-base font-semibold text-ink">
                    Przepisy
                  </span>
                  <span className="block text-sm text-ink-soft">
                    {isHistoryLoading ? "Ładowanie..." : `${totalRecipes} w bibliotece`}
                  </span>
                </span>
              </Link>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-8 xl:col-span-5 2xl:col-span-6">
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow tone="muted">Ostatnio w kuchni</Eyebrow>
                  <h2 className="mt-2 flex items-center gap-2 font-brand text-2xl font-semibold text-ink">
                    <Clock3 className="h-5 w-5 text-accent" aria-hidden="true" />
                    Ostatnie przepisy
                  </h2>
                </div>
                {recentMeals.length > 0 && (
                  <span className="text-sm text-ink-muted">
                    {historyData?.total || 0} łącznie
                  </span>
                )}
              </div>

              {isHistoryLoading ? (
                <LoadingPanel label="Ładuję ostatnie przepisy..." />
              ) : recentMeals.length === 0 ? (
                <EmptyPanel
                  title="Jeszcze nic nie pachnie z piekarnika"
                  description="Wygeneruj pierwszy przepis, a tutaj pojawi się historia ostatnich dań."
                  action={
                    <Link
                      to="/generator"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse transition hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    >
                      Wygeneruj pierwszy przepis
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  <HeroMealCard meal={recentMeals[0]} />
                  {recentMeals.length > 1 && (
                    <div className="grid gap-3 lg:grid-cols-2">
                      {recentMeals.slice(1).map((meal) => (
                        <MealHistoryCard key={meal.id} meal={meal} />
                      ))}
                    </div>
                  )}
                  {totalRecipes > recentMeals.length && (
                    <Link
                      to="/recipes"
                      className="inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    >
                      Zobacz wszystkie przepisy
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow tone="accent">Do powtórzenia</Eyebrow>
                  <h2 className="mt-2 flex items-center gap-2 font-brand text-2xl font-semibold text-ink">
                    <Heart className="h-5 w-5 text-bordeaux" aria-hidden="true" />
                    Ulubione przepisy
                  </h2>
                </div>
                {favoriteMeals.length > 0 && (
                  <Link
                    to="/recipes"
                    className="text-sm font-semibold text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                  >
                    Otwórz bibliotekę
                  </Link>
                )}
              </div>

              {isFavoritesLoading ? (
                <LoadingPanel label="Sprawdzam ulubione przepisy..." compact />
              ) : favoriteMeals.length === 0 ? (
                <EmptyPanel
                  title="Ulubione jeszcze czekają"
                  description="Oznacz sercem przepisy, do których chcesz wracać."
                  compact
                />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {favoriteMeals.slice(0, 4).map((meal) => (
                    <MealHistoryCard key={meal.id} meal={meal} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-accent" aria-hidden="true" />
                <h2 className="font-brand text-2xl font-semibold text-ink">
                  Szybki start
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {quickStarts.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-4 shadow-sm transition duration-fast hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent-soft/40 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border-strong bg-bg-sunken font-mono text-sm font-semibold text-accent">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block font-brand text-base font-semibold leading-tight text-ink">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-ink-soft">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="min-w-0 xl:col-span-3">
            <ShoppingListCard
              items={shoppingItems}
              onToggleObtained={toggleObtained}
              onClear={clearShoppingList}
              onExport={handleExportShoppingList}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function ShoppingListCard({
  items,
  onToggleObtained,
  onClear,
  onExport,
}: ShoppingListCardProps) {
  const obtainedCount = items.filter((item) => item.obtained).length;
  const progress = items.length > 0 ? (obtainedCount / items.length) * 100 : 0;

  return (
    <section className="sticky top-24 rounded-lg border border-border-strong bg-bg-elevated p-5 text-ink shadow-md sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <Eyebrow tone="saffron">Lista zakupów</Eyebrow>
          <h2 className="mt-2 flex items-center gap-2 font-brand text-2xl font-semibold text-ink">
            <ShoppingCart className="h-5 w-5 text-accent" aria-hidden="true" />
            Papierowa lista
          </h2>
        </div>
        <Badge variant="neutral">{items.length}</Badge>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-bg-sunken px-5 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-accent shadow-xs">
            <Plus className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-brand text-lg font-semibold text-ink">
            Lista jest pusta
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-ink-soft">
            Dodaj składniki z przepisu, a pojawią się tutaj do odhaczenia.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-muted">
              <span>{obtainedCount} odhaczone</span>
              <span>{items.length - obtainedCount} zostało</span>
            </div>
            <div className="h-2 overflow-hidden rounded-pill bg-bg-sunken">
              <div
                className="h-full rounded-pill bg-accent transition-all duration-base"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="mb-3 text-sm leading-6 text-ink-soft">
            Zaznacz produkt, gdy trafi już do koszyka.
          </p>
          <ul className="max-h-[360px] space-y-2 overflow-y-auto pr-1" role="list">
            {items.map((item) => {
              const label = getShoppingLabel(item);
              return (
                <li key={item.id}>
                  <label
                    className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm transition duration-fast ${
                      item.obtained
                        ? "border-border bg-bg-sunken text-ink-muted"
                        : "border-border-strong bg-bg-elevated text-ink hover:border-accent/60 hover:bg-accent-soft/35"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.obtained}
                      onChange={() => onToggleObtained(item.id)}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border-strong text-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                      aria-label={`Oznacz jako ${
                        item.obtained ? "niekupione" : "kupione"
                      }: ${label}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block break-words font-semibold ${
                          item.obtained ? "line-through" : ""
                        }`}
                      >
                        {label}
                      </span>
                      {item.notes && (
                        <span className="mt-1 block break-words text-xs text-ink-muted">
                          {item.notes}
                        </span>
                      )}
                    </span>
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        item.obtained ? "text-basil" : "text-ink-disabled"
                      }`}
                      aria-hidden="true"
                    />
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-dashed border-border-strong pt-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClear}
          disabled={items.length === 0}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-ink-soft transition duration-fast hover:border-bordeaux hover:bg-accent-soft hover:text-bordeaux focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-sunken disabled:text-ink-disabled"
        >
          Wyczyść listę
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={items.length === 0}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-ink-inverse transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-sunken disabled:text-ink-disabled"
        >
          Eksportuj listę
        </button>
      </div>
    </section>
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
      className={`flex items-center justify-center rounded-lg border border-dashed border-border-strong bg-bg-elevated text-center text-ink-soft ${
        compact ? "min-h-40 p-6" : "min-h-64 p-8"
      }`}
      role="status"
      aria-live="polite"
    >
      <div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold">{label}</p>
      </div>
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
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-bg-elevated px-5 text-center ${
        compact ? "min-h-40 py-8" : "min-h-64 py-12"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-sunken text-accent">
        <Utensils className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-brand text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
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
      className="group block min-w-0 overflow-hidden rounded-lg border border-border-strong bg-bg-elevated text-ink shadow-md transition duration-base hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
    >
      <div className="grid min-w-0 gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
            {meal.description && (
              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-ink-soft sm:text-base">
                {meal.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              {meal.estimatedTime && (
                <Badge variant="neutral" className="gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {meal.estimatedTime} min
                </Badge>
              )}
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
