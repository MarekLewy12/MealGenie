import { Link } from "react-router-dom";
import { MealGenerator } from "../components/MealGenerator";

export function GuestGeneratorPage() {
  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-200">
            Podgląd AI
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Wypróbuj MealGenie bez konta
          </h1>
          <p className="max-w-2xl text-sm text-slate-700 dark:text-slate-300">
            Jedna darmowa generacja (3 dania), aby szybko zobaczyć jak działa
            system. Potem możesz założyć konto i przejść do pełnego generatora.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm shadow-indigo-100 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:text-indigo-900 dark:border-indigo-400/60 dark:bg-white/5 dark:text-indigo-100 dark:hover:border-fuchsia-400 dark:hover:text-white"
          >
            Zaloguj się
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
          >
            Wróć na start
          </Link>
        </div>
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="text-xs font-semibold uppercase tracking-wide">
            Co masz teraz
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>1 darmowa generacja (3 dania),</li>
            <li>typ posiłku + maksymalny czas,</li>
            <li>krótki opis czego szukasz (opcjonalnie),</li>
            <li>brak historii, zapisu i pełnego flow przepisu.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-100">
          <p className="text-xs font-semibold uppercase tracking-wide">
            Co odblokujesz po logowaniu
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>składniki z lodówki i tryb Thermomix,</li>
            <li>tryb porcji: liczba osób albo docelowa gramatura,</li>
            <li>regulacja poziomu głodu (kaloryczność porcji),</li>
            <li>globalne preferencje: dieta, alergie, budżet, sprzęt, poziom pikantności,</li>
            <li>wybór dania i przejście do pełnego przepisu,</li>
            <li>zapis, historia i kolejne generacje bez limitu próby.</li>
          </ul>
        </div>
      </div>
      <MealGenerator mode="guest" />
    </section>
  );
}
