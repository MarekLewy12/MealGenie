import { useNavigate } from "react-router-dom";
import { OnboardingForm } from "../components/OnboardingForm";
import { useAuthStore } from "../store/authStore";
import { Sparkles } from "lucide-react";

export function OnboardingPage() {
  const user = useAuthStore((state) => state.user);

  const userName = user?.name || "Kucharzu";

  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden px-6 py-12 md:py-20">
      {/* Tło dekoracyjne (opcjonalne, subtelne glow) */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5" />

      <div className="mx-auto max-w-2xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 backdrop-blur-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Sparkles className="h-3 w-3" />
          <span>Startujemy</span>
        </div>

        {/* Nagłówek z personalizacją */}
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Witaj,{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
            {userName}
          </span>
          ! 👋
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Pozwól MealGenie poznać Twój styl gotowania, aby propozycje były
          idealnie trafione.
        </p>

        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          Spokojnie, zawsze możesz zmienić te ustawienia później w swoim
          profilu.
        </p>
      </div>

      <div className="mt-12 md:mt-16">
        <OnboardingForm />
      </div>
    </section>
  );
}
