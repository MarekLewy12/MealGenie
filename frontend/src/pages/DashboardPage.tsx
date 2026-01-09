import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Calendar,
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
import { getMealHistory } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { MealHistoryCard } from "../components/MealHistoryCard";
import type { MealHistoryItem } from "../types/meal";

export function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const openChat = useChatStore((state) => state.openChat);
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
        .slice(0, 6);
    const favoriteMeals = favoritesData?.items ?? [];

    return (
        // Layout główny
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white">

            {/* Tło dekoracyjne */}
            <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
                <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute right-[5%] top-[20%] h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
            </div>

            <main className="mx-auto max-w-[1920px] p-4 md:p-8">

                {/* Nagłówek */}
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Centrum Dowodzenia
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                            Dzień dobry, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">{greetingName}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-300">
                        <span>{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </header>

                {/* Siatka */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

                    {/* Kolumna lewa */}
                    <div className="flex flex-col gap-6 lg:col-span-4 xl:col-span-3">

                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-1 text-white shadow-2xl shadow-indigo-900/20 dark:bg-white/5 dark:shadow-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 opacity-90" />
                            <div className="relative flex flex-col items-start gap-4 p-6 sm:p-8">
                                <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Nie wiesz co zjeść?</h2>
                                    <p className="mt-1 text-indigo-100 opacity-90">
                                        Sztuczna inteligencja dobierze posiłek do Twoich zapasów.
                                    </p>
                                </div>
                                <Link
                                    to="/generator"
                                    className="mt-2 w-full rounded-xl bg-white py-3.5 text-center text-sm font-bold text-indigo-600 shadow-lg transition hover:bg-indigo-50 hover:scale-[1.02] active:scale-95"
                                >
                                    Uruchom Generator &rarr;
                                </Link>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-lg shadow-emerald-100/60 dark:border-emerald-500/20 dark:bg-slate-900/60 dark:shadow-none">
                            <div className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl dark:bg-emerald-500/20" />
                            <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-teal-200/40 blur-2xl dark:bg-teal-500/20" />
                            <div className="relative flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Asystent AI
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Zapytaj o przepisy i triki kuchenne
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Szybkie odpowiedzi, zamienniki składników i plan
                                    na dziś bez wychodzenia z Dashboardu.
                                </p>
                                <button
                                    type="button"
                                    onClick={openChat}
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
                                >
                                    Otwórz asystenta
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/settings" className="group flex flex-col items-center justify-center rounded-3xl border border-indigo-200/90 bg-white p-6 text-center shadow-sm transition hover:border-fuchsia-300/80 dark:border-indigo-400/30 dark:bg-white/5 dark:hover:bg-white/10">
                                <Settings className="mb-3 h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                <span className="text-sm font-semibold">Preferencje</span>
                                <span className="text-xs text-slate-500">Edytuj globalne ustawienia</span>
                            </Link>
                            <Link
                                to="/favorites"
                                className="group flex flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-white p-6 text-center shadow-sm transition hover:border-rose-300/90 hover:bg-rose-50/40 dark:border-rose-400/30 dark:bg-white/5 dark:hover:bg-white/10"
                            >
                                <Heart className="mb-3 h-6 w-6 text-slate-400 group-hover:text-red-500" />
                                <span className="text-sm font-semibold">Ulubione</span>
                                <span className="text-xs text-slate-500">
                                    {isFavoritesLoading ? (
                                        <Loader2 className="inline h-3 w-3 animate-spin" />
                                    ) : (
                                        `${favoriteMeals.length} przepisów`
                                    )}
                                </span>
                            </Link>
                        </div>

                    </div>

                    {/* Kolumna środkowa */}
                    <div className="lg:col-span-8 xl:col-span-6 flex flex-col gap-8">

                        {/* Ostatnie przepisy */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Clock3 className="h-5 w-5 text-slate-400" />
                                    Ostatnie przepisy
                                </h3>
                                {recentMeals.length > 0 && (
                                    <span className="text-sm text-slate-500">
                                        {historyData?.total || 0} łącznie
                                    </span>
                                )}
                            </div>

                            {isHistoryLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                </div>
                            ) : recentMeals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-300/70 bg-indigo-50/40 py-16 text-center dark:border-indigo-400/30 dark:bg-white/5">
                                    <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-white/5">
                                        <Utensils className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold">Pusto w kuchni?</h4>
                                    <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Nie wygenerowano jeszcze żadnego posiłku. Generator pomoże wystartować.
                                    </p>
                                    <Link
                                        to="/generator"
                                        className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                    >
                                        Wygeneruj pierwszy przepis
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <HeroMealCard meal={recentMeals[0]} />
                                    {recentMeals.length > 1 && (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {recentMeals.slice(1).map((meal) => (
                                                <MealHistoryCard key={meal.id} meal={meal} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {favoriteMeals.length > 0 && (
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-red-400" />
                                        Ulubione przepisy
                                    </h3>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {favoriteMeals.slice(0, 4).map((meal) => (
                                        <MealHistoryCard key={meal.id} meal={meal} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Szybki Start - NOWA SEKCJA */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Wand2 className="h-5 w-5 text-indigo-500" />
                                Szybki Start
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                <Link
                                    to="/generator?mealType=SNACK&prepTime=15"
                                    className="group flex flex-col items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/80 p-4 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-3xl">🚀</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Szybki posiłek
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Gotowe w 15 minut
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=BREAKFAST&prepTime=30"
                                    className="group flex flex-col items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/80 p-4 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-3xl">🌅</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Śniadanie
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Dobry start dnia
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=LUNCH&prepTime=45"
                                    className="group flex flex-col items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/80 p-4 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-3xl">🍽️</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Pełny obiad
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Czas na ucztę
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=DINNER&prepTime=30"
                                    className="group flex flex-col items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/80 p-4 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-3xl">🌙</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Lekka kolacja
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Na koniec dnia
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=DESSERT&prepTime=30"
                                    className="group flex flex-col items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/80 p-4 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-3xl">🍰</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Deser
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Słodka chwila
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Kolumna prawa: lista zakupów */}
                    <div className="hidden xl:col-span-3 xl:flex flex-col gap-6">
                        <div className="sticky top-24 rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-indigo-400/30 dark:bg-[#0c0f1d] dark:shadow-none">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-indigo-500" />
                                    Lista Zakupów
                                </h3>
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-white/10">0</span>
                            </div>

                            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center opacity-60">
                                <div className="rounded-full bg-slate-100 p-3 dark:bg-white/5">
                                    <Plus className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm text-slate-500">Brak produktów.</p>
                                <p className="text-xs text-slate-400 max-w-[150px]">
                                    Wybierz przepis, aby automatycznie dodać składniki.
                                </p>
                            </div>

                            <div className="mt-6 border-t border-indigo-200/80 pt-4 dark:border-indigo-500/20">
                                <button disabled className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 dark:bg-white/5">
                                    Idę na zakupy
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
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
            className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
        >
            <div className="flex flex-col md:flex-row">
                <div className="relative h-56 w-full md:h-auto md:w-1/2">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={meal.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                            <Utensils className="h-16 w-16 text-white/50" />
                        </div>
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-lg backdrop-blur dark:bg-slate-900/95 dark:text-indigo-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        Ostatnio gotowane
                    </div>

                    {meal.isFavorite && (
                        <div className="absolute right-4 top-4">
                            <Heart className="h-6 w-6 fill-red-500 text-red-500 drop-shadow-lg" />
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {meal.name}
                        </h3>
                        {meal.description && (
                            <p className="mt-3 line-clamp-2 text-slate-600 dark:text-slate-300">
                                {meal.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            {meal.estimatedTime && (
                                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                    <Clock3 className="h-4 w-4" />
                                    {meal.estimatedTime} min
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                <Calendar className="h-4 w-4" />
                                {new Date(meal.createdAt).toLocaleDateString("pl-PL", {
                                    day: "numeric",
                                    month: "long",
                                })}
                            </span>
                        </div>

                        <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            Zobacz przepis
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
