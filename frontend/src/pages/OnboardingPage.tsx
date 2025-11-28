import { Link } from "react-router-dom";
import { OnboardingForm } from "../components/OnboardingForm";

export function OnboardingPage() {
  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
            Onboarding
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Skonfiguruj MealGenie pod siebie
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Ustal preferencje, alergie, sprzęt i czas. Robisz to raz – AI
            pamięta każdy detal.
          </p>
        </div>
        <Link
          to="/generator"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/60 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-100 transition hover:-translate-y-0.5 hover:border-fuchsia-400 hover:text-white"
        >
          Przejdź do generatora
        </Link>
      </div>
      <OnboardingForm />
    </section>
  );
}
