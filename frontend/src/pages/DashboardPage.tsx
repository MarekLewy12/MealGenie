import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    Clock3,
    Heart,
    Loader2,
    Plus,
    Settings,
    ShoppingCart,
    Sparkles,
    Utensils,
    Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deleteMealHistory, getMealHistory } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { MealHistoryItem } from "../types/meal";

export function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const greetingName = user?.name || "Kucharzu";

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["mealHistory"],
        queryFn: () => getMealHistory({ limit: 6 }),
    });

    const { data: favoritesData, isLoading: isFavoritesLoading } = useQuery({
        queryKey: ["mealHistory", "favorites"],
        queryFn: () => getMealHistory({ limit: 10, favoritesOnly: true }),
    });

    const recentMeals = historyData?.items ?? [];
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

                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/settings" className="group flex flex-col items-center justify-center rounded-3xl border border-indigo-200/90 bg-white p-6 text-center shadow-sm transition hover:border-fuchsia-300/80 dark:border-indigo-400/30 dark:bg-white/5 dark:hover:bg-white/10">
                                <Settings className="mb-3 h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                <span className="text-sm font-semibold">Preferencje</span>
                                <span className="text-xs text-slate-500">Edytuj globalne ustawienia</span>
                            </Link>
                            <div className="group flex flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-white p-6 text-center shadow-sm transition dark:border-rose-400/30 dark:bg-white/5">
                                <Heart className="mb-3 h-6 w-6 text-slate-400 group-hover:text-red-500" />
                                <span className="text-sm font-semibold">Ulubione</span>
                                <span className="text-xs text-slate-500">
                                    {isFavoritesLoading ? (
                                        <Loader2 className="inline h-3 w-3 animate-spin" />
                                    ) : (
                                        `${favoriteMeals.length} przepisów`
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50 p-6 dark:border-indigo-400/40 dark:bg-indigo-900/10">
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2">Beta Testy</h4>
                            <p className="text-xs text-indigo-700/80 dark:text-indigo-300/70 mb-3">
                                Twoja opinia kształtuje tę aplikację. Masz pomysł?
                            </p>
                            <a href="mailto:hello@mealgenie.ai" className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
                                Napisz, co chcesz zobaczyć w aplikacji
                            </a>
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
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {recentMeals.map((meal) => (
                                        <MealHistoryCard key={meal.id} meal={meal} />
                                    ))}
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
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    to="/generator?mealType=SNACK&prepTime=15"
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-indigo-200/60 bg-white/80 p-6 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-4xl">🚀</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">
                                            Szybki posiłek
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Gotowe w 15 minut
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=BREAKFAST&prepTime=30"
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-indigo-200/60 bg-white/80 p-6 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-4xl">🌅</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">
                                            Śniadanie
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Dobry start dnia
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=LUNCH&prepTime=45"
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-indigo-200/60 bg-white/80 p-6 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-4xl">🍽️</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">
                                            Pełny obiad
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Czas na ucztę
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/generator?mealType=DINNER&prepTime=30"
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-indigo-200/60 bg-white/80 p-6 text-center shadow-sm shadow-indigo-100/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300/70 hover:shadow-md dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-fuchsia-400/40"
                                >
                                    <div className="text-4xl">🌙</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">
                                            Lekka kolacja
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Spokojne zakończenie dnia
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

function MealHistoryCard({ meal }: { meal: MealHistoryItem }) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: () => deleteMealHistory(meal.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
        },
    });
    const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    const imageUrl = meal.imageUrl?.startsWith("/")
        ? `${apiBaseUrl}${meal.imageUrl}`
        : meal.imageUrl;

    return (
        <Link
            to={`/recipe/${meal.id}`}
            className="group relative flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
        >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={meal.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                        <Utensils className="h-6 w-6 text-white/70" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-center min-w-0">
                <h4 className="font-semibold text-slate-900 truncate dark:text-white">
                    {meal.name}
                </h4>
                {meal.description && (
                    <p className="text-sm text-slate-500 truncate dark:text-slate-400">
                        {meal.description}
                    </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
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

            <div className="absolute right-3 top-3 flex items-center gap-2">
                {meal.isFavorite && (
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                )}
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        deleteMutation.mutate();
                    }}
                    disabled={deleteMutation.isPending}
                    className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer"
                    aria-label="Usuń z historii"
                    title="Usuń z historii"
                >
                    {deleteMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        "usuń"
                    )}
                </button>
            </div>

            <div className="flex items-center">
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
            </div>
        </Link>
    );
}
