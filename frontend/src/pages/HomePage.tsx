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
  UtensilsCrossed,
  Wand2,
} from "lucide-react";
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
    title: "Poznajemy Cię",
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
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-[120px] dark:bg-indigo-500/25" />
        <div className="absolute right-[-60px] top-0 h-72 w-72 rounded-full bg-fuchsia-200/35 blur-[120px] dark:bg-fuchsia-500/20" />
        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-blue-200/30 blur-[140px] dark:bg-blue-500/10" />
      </div>

      <section className="relative mx-auto max-w-screen-xl px-6 pt-20 pb-32 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="relative z-10 space-y-8 text-center lg:text-left">
            <div className="inline-flex w-full items-center justify-center lg:w-auto lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1 pr-4 backdrop-blur dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] dark:bg-indigo-400" />
                <span className="text-xs font-medium tracking-wide text-indigo-700 dark:text-indigo-200">
                  AI KITCHEN — V1.0
                </span>
              </div>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:leading-[1.1]">
              Twoja dieta <br />
              <span className="relative whitespace-nowrap bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-amber-400">
                na autopilocie.
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0">
              Koniec z pytaniem "co dziś na obiad?". MealGenie tworzy
              spersonalizowane plany posiłków w sekundy, uwzględniając to, co
              masz w lodówce.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/onboarding"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] hover:bg-indigo-500 active:scale-95"
              >
                Zacznij za darmo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/generator"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Zobacz demo
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-sm text-slate-500 dark:text-slate-400 lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Bez reklam</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Polskie produkty</span>
              </div>
            </div>
          </div>

          <div className="relative mt-12 flex justify-center lg:mt-0 lg:justify-end">
            <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[90px] dark:bg-indigo-500/20" />

            <div className="relative z-10 flex aspect-square w-full max-w-[420px] flex-col items-center justify-center rounded-[3rem] border border-white/40 bg-white/20 p-8 shadow-2xl backdrop-blur-xl animate-float dark:border-white/10 dark:bg-slate-900/40 dark:shadow-indigo-900/50">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/5" />

              <img
                src="/logo-genie.png"
                alt="App Interface"
                className="relative z-20 h-48 w-48 drop-shadow-2xl transition-transform duration-500 hover:scale-110"
              />

              <div className="z-20 mt-6 text-center">
                <p className="text-lg font-bold text-slate-800 dark:text-white">Twój Osobisty Kucharz</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    AI Online
                  </p>
                </div>
              </div>

              <div className="absolute top-12 -left-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl animate-float delay-100 dark:border-slate-700 dark:bg-slate-800">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Czas</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">15 min</p>
                </div>
              </div>

              <div className="absolute bottom-20 -right-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl animate-float delay-300 dark:border-slate-700 dark:bg-slate-800">
                <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Kalorie</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">450 kcal</p>
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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:ring-indigo-400/30">
            <UtensilsCrossed className="h-5 w-5 text-indigo-700 dark:text-indigo-100" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-200">
              Przykładowe posiłki
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Zobacz jakość zanim klikniesz
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Jeśli tak wyglądają przykłady, wyobraź sobie, jak smakuje Twój
              spersonalizowany wynik.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sampleMeals.map((meal, index) => (
            <MealCard
              key={`${meal.name}-${index}`}
              meal={meal}
              onSelect={() => console.log("Wybrano posiłek z sekcji demo")}
            />
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
