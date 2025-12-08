import {
    ArrowRight,
    ChefHat,
    Clock3,
    Heart,
    Plus,
    Settings,
    ShoppingCart,
    Sparkles,
    Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const greetingName = user?.name || "Kucharzu";

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
                            <Link to="/onboarding" className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                                <Settings className="mb-3 h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                <span className="text-sm font-semibold">Preferencje</span>
                                <span className="text-xs text-slate-500">Edytuj globalne ustawienia</span>
                            </Link>
                            <div className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition dark:border-white/10 dark:bg-white/5">
                                <Heart className="mb-3 h-6 w-6 text-slate-400 group-hover:text-red-500" />
                                <span className="text-sm font-semibold">Ulubione</span>
                                <span className="text-xs text-slate-500">0 przepisów</span>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20">
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

                        {/* Ostatnie aktywności */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Clock3 className="h-5 w-5 text-slate-400" />
                                    Ostatnie aktywności
                                </h3>
                            </div>

                            {/* Pusty stan historii */}
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center dark:border-white/10 dark:bg-white/5">
                                <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-white/5">
                                    <Utensils className="h-8 w-8 text-slate-400" />
                                </div>
                                <h4 className="text-lg font-semibold">Pusto w kuchni?</h4>
                                <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Nie wygenerowałeś jeszcze żadnego posiłku. Użyj generatora, aby zacząć.
                                </p>
                            </div>
                        </div>

                        {/* Warto wiedzieć */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Warto wiedzieć</h3>
                            <div className="space-y-4">
                                {[
                                    { title: "Zmień czas w generatorze", desc: "Możesz wymusić szybki obiad (15 min) w ustawieniach suwaka." },
                                    { title: "Thermomix ready", desc: "Włącz obsługę robota w preferencjach, by widzieć dedykowane kroki." },
                                    { title: "Eksperymentuj", desc: "AI uczy się Twoich smaków z każdym wyborem." }
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                            <ChefHat className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{tip.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{tip.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Kolumna prawa: lista zakupów */}
                    <div className="hidden xl:col-span-3 xl:flex flex-col gap-6">
                        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#0c0f1d] dark:shadow-none">
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

                            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-white/5">
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
