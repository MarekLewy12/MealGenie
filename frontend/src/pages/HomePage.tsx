import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  ShieldCheck,
  Smile,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MealCard } from "../components/MealCard";
import type { MealSuggestion } from "../types/meal";

const sampleMeals: MealSuggestion[] = [
  {
    name: "Keto Power Bowl z łososiem",
    description:
      "Soczysty łosoś na kremowym puree z kalafiora z chrupiącym jarmużem i dressingiem cytrynowym.",
    difficulty: "Medium",
    cookingTimeMinutes: 20,
    calories: 520,
    ingredients: [
      { name: "filet z łososia", amount: "200g" },
      { name: "kalafior", amount: "1 mała główka" },
      { name: "jarmuż", amount: "2 garści" },
      { name: "oliwa i cytryna", amount: "do smaku" },
    ],
    stepsSummary: [
      "Upiecz łososia z cytryną i oliwą",
      "Ugotuj i zblenduj kalafior na aksamitne puree",
      "Podsmaż jarmuż na chrupko",
      "Podaj z dressingiem cytrynowym",
    ],
  },
  {
    name: "Pho z tygodniowym prepem",
    description:
      "Lekki bulion, ryżowy makaron i aromatyczne zioła – gotowe w 15 minut dzięki meal prep.",
    difficulty: "Easy",
    cookingTimeMinutes: 15,
    calories: 430,
    ingredients: [
      { name: "bulion drobiowy", amount: "500 ml" },
      { name: "makaron ryżowy", amount: "120g" },
      { name: "pierś z kurczaka", amount: "150g" },
      { name: "limonka i zioła", amount: "do podania" },
    ],
    stepsSummary: [
      "Podgrzej bulion z przyprawami",
      "Ugotuj makaron ryżowy",
      "Dodaj mięso i zioła",
      "Wykończ limonką i chili",
    ],
  },
  {
    name: "Szakszuka nocna zmiana",
    description:
      "Błyskawiczne jajka w pomidorach z fetą i oliwkami – ratunek po długim dniu.",
    difficulty: "Easy",
    cookingTimeMinutes: 12,
    calories: 380,
    ingredients: [
      { name: "jajka", amount: "3 szt." },
      { name: "pomidory krojone", amount: "1 puszka" },
      { name: "feta", amount: "50g" },
      { name: "oliwki i zatar", amount: "szczypta" },
    ],
    stepsSummary: [
      "Podsmaż czosnek i przyprawy",
      "Dodaj pomidory i zredukuj",
      "Wbij jajka, przykryj",
      "Posyp fetą i oliwkami",
    ],
  },
];

const howItWorks = [
  {
    title: "Witaj! Pozwól się poznać",
    description:
      "Ustal preferencje, alergie, kuchnie, czas. Robisz to raz – my zapamiętujemy.",
  },
  {
    title: "AI tworzy propozycje",
    description:
      "Codziennie dostajesz pomysły, które pasują do Ciebie, nie do internetu.",
  },
  {
    title: "Wybierasz i gotujesz",
    description:
      "Czytelne kroki, składniki dostępne w Polsce, zero zgadywania.",
  },
];

const valuePoints = [
  {
    title: "Koniec z frustracją",
    description:
      "Zero przewijania tysiąca przepisów — dostajesz gotowe, trafione propozycje.",
    Icon: CheckCircle2,
  },
  {
    title: "Dopasowane do sprzętu",
    description:
      "Uwzględniamy to, co masz w kuchni i tempo Twojego dnia, bez kompromisów.",
    Icon: Smile,
  },
  {
    title: "Rekomendacje, które się uczą",
    description:
      "AI reaguje na Twoje wybory i preferencje, codziennie dopracowując pomysły.",
    Icon: Brain,
  },
  {
    title: "AI, które naprawdę Cię zna",
    description:
      "Personalizacja oparta na diecie, alergiach i sprzęcie, który realnie masz pod ręką.",
    Icon: Heart,
  },
];

const trustPoints = [
  "Składniki dobierane pod polskie sklepy i sezon.",
  "Zero reklam, zero sponsorowanych przepisów – czysta użyteczność.",
  "Transparentne źródła: dieta, alergie, sprzęt kuchenny zawsze na pierwszym miejscu.",
];

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % sampleMeals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMeal = sampleMeals[activeIndex];

  return (
    <div className="relative isolate overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#020617]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
        <div className="absolute left-1/2 top-[-10%] h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-500/15 dark:blur-[140px]" />
        <div className="absolute left-[15%] top-[18%] h-[520px] w-[520px] rounded-full bg-fuchsia-200/30 blur-[90px] dark:bg-fuchsia-600/20 dark:blur-[120px]" />
        <div className="absolute right-[12%] top-[8%] h-[480px] w-[480px] rounded-full bg-blue-200/30 blur-[90px] dark:bg-blue-600/20 dark:blur-[120px]" />
      </div>

      <section className="relative overflow-visible pt-24 pb-32 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="relative z-10 text-center lg:col-span-7 lg:text-left">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm shadow-indigo-100 transition-colors dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:shadow-indigo-900/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                AI Kitchen v1.0 — Twój osobisty kucharz
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-7xl">
                Koniec z pytaniem <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-300 dark:via-white dark:to-indigo-300">
                  „co dziś na obiad?”
                </span>
              </h1>

              <p className="mb-10 text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:max-w-lg">
                MealGenie w sekundy przetwarza Twoje preferencje, dietę i czas,
                tworząc gotowy plan posiłków. Zobacz, jak to działa obok. 👉
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/onboarding"
                  className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-8 text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                >
                  Rozpocznij teraz
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/generator"
                  className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Zobacz demo
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center perspective-1000 lg:col-span-5">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 blur-2xl" />
                <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">
                  <div className="relative z-20 mb-8 animate-float">
                    <img
                      src="/logo-genie.png"
                      alt="MealGenie"
                      className="h-48 w-48 drop-shadow-2xl"
                    />
                  </div>

                <div
                  key={activeIndex}
                  className="relative w-full transform-gpu transition-all duration-700 ease-out animate-fade-in-up-slow"
                  style={{ transform: "rotateY(-5deg) rotateX(2deg)" }}
                >
                  <div className="absolute inset-0 translate-y-4 scale-95 rounded-3xl bg-indigo-100/50 blur-sm dark:bg-indigo-900/20" />
                  <div className="relative rounded-3xl shadow-2xl shadow-indigo-200/50 dark:shadow-black/50">
                    <MealCard meal={currentMeal} onSelect={() => {}} />
                  </div>
                </div>

                <div className="absolute top-32 -right-4 lg:-right-12 animate-float delay-100">
                  <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-800/90">
                    <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {currentMeal.cookingTimeMinutes} min
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 -left-4 lg:-left-12 animate-float delay-300">
                  <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-800/90">
                    <div className="rounded-lg bg-orange-100 p-1.5 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {currentMeal.calories} kcal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:ring-indigo-400/30">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-200" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-200">
              Jak to działa
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Klarowność w 15 sekund
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-indigo-900/30"
            >
              <div className="mb-3 flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-200">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100">
                  {index + 1}
                </span>
                {step.title}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100 ring-1 ring-fuchsia-200 dark:bg-fuchsia-500/15 dark:ring-fuchsia-400/30">
            <Wand2 className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-200" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-200">
              Dlaczego MealGenie?
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Zmiana, którą poczujesz
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {valuePoints.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-8 text-sm shadow-lg shadow-indigo-100/60 backdrop-blur transition-all hover:-translate-y-1 hover:border-orange-300/80 hover:shadow-orange-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-indigo-900/30 dark:hover:border-orange-500/30 dark:hover:shadow-orange-900/20"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-all group-hover:scale-110 group-hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-200 dark:group-hover:bg-orange-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 transition-colors group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-100">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {description}
              </p>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-200/30 blur-2xl transition-all group-hover:bg-orange-200/60 dark:bg-orange-500/5 dark:group-hover:bg-orange-500/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:ring-emerald-400/30">
            <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-100" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-200">
              Zaufanie
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Dlaczego możesz zaufać MealGenie
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-indigo-900/30"
            >
              <p className="text-slate-700 dark:text-slate-100">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-fuchsia-600/10 p-10 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl dark:border-indigo-500/30 dark:from-indigo-600/40 dark:via-purple-600/40 dark:to-fuchsia-600/40 dark:shadow-indigo-900/40">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-100">
                Finał historii
              </p>
              <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Zacznij jeść lepiej bez wysiłku.
              </h3>
              <p className="text-sm text-slate-700 dark:text-indigo-50/90">
                Przejdź przez krótki onboarding i odkryj swoje pierwsze posiłki
                stworzone specjalnie dla Ciebie.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:justify-end">
              <Link
                to="/onboarding"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 shadow-lg shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:shadow-indigo-300/70 dark:bg-white/90"
              >
                Zacznij teraz
              </Link>
              <Link
                to="/generator"
                className="rounded-xl border border-amber-300/80 bg-amber-100 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-amber-800 shadow-[0_0_20px_rgba(245,158,11,0.18)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:text-amber-900 hover:shadow-[0_0_30px_rgba(245,158,11,0.24)] dark:border-amber-200/70 dark:bg-amber-500/20 dark:text-amber-100 dark:hover:border-amber-100 dark:hover:text-white"
              >
                Zobacz generator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-genie.png"
              alt="MealGenie"
              className="h-10 w-10 rounded-xl bg-white p-1 shadow-lg shadow-indigo-200/40 dark:bg-white/5 dark:shadow-indigo-900/40"
            />
            <span className="bg-gradient-to-r from-slate-900 to-indigo-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-indigo-200">
              MealGenie
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
            <Link to="/onboarding" className="hover:text-indigo-700 dark:hover:text-white">
              O nas
            </Link>
            <a className="cursor-default text-slate-500 dark:text-slate-500">Polityka</a>
            <a className="cursor-default text-slate-500 dark:text-slate-500">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
