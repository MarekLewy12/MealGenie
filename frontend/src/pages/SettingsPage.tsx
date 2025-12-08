import { useQuery } from "@tanstack/react-query";
import { getPreferences } from "../services/api";
import { OnboardingForm } from "../components/OnboardingForm";
import { User, ChefHat } from "lucide-react";

export function SettingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-10 text-red-500">
        Nie udało się pobrać ustawień. Spróbuj odświeżyć stronę.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Ustawienia
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Zarządzaj swoim profilem i preferencjami kulinarnymi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        {/* LEWA KOLUMNA - NAWIGACJA (WIZUALNA) */}
        <aside className="lg:col-span-3">
          <nav className="sticky top-24 space-y-1">
            <h3 className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Twoje Konto
            </h3>

            <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors dark:bg-indigo-500/10 dark:text-indigo-100">
              <ChefHat className="h-5 w-5" />
              Preferencje Smakowe
            </button>

            <button
              disabled
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 opacity-50 cursor-not-allowed"
            >
              <User className="h-5 w-5" />
              Dane logowania
            </button>
          </nav>
        </aside>

        {/* PRAWA KOLUMNA - TREŚĆ (FORMULARZ) */}
        <div className="lg:col-span-9">
          <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Profil Kulinarny
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Te ustawienia są używane przez AI do generowania Twoich
                posiłków.
              </p>
            </div>

            {/* Przekazujemy dane z bazy do formularza */}
            {/* @ts-expect-error - Prisma types vs Zod types loose match */}
            <OnboardingForm
              initialValues={data || undefined}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
