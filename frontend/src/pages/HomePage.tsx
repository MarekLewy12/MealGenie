import {
  Activity,
  Brain,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Smile,
  Sparkles,
  UtensilsCrossed,
  Wand2,
  Zap,
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
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-indigo-500/25 blur-[120px]" />
        <div className="absolute right-[-60px] top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-20 pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                AI Kitchen — Premium
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Już nigdy nie musisz zastanawiać się,{" "}
                <span className="bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
                  co dziś zjeść.
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                MealGenie poznaje Twoje preferencje i w kilka sekund tworzy
                propozycje dań idealnie dopasowanych do Twojego stylu życia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/onboarding"
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-700/40 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-800/50"
              >
                Rozpocznij w 2 minuty
              </Link>
              <Link
                to="/generator"
                className="rounded-xl border border-amber-300/70 bg-amber-400/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.18)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:text-white hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]"
              >
                Zobacz przykładowe dania
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold text-white">30s</p>
                <p className="text-xs uppercase tracking-wide">
                  Do pierwszych propozycji
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold text-white">100%</p>
                <p className="text-xs uppercase tracking-wide">
                  Bez sponsorów i reklam
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold text-white">PL</p>
                <p className="text-xs uppercase tracking-wide">
                  Składniki dostępne w Polsce
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-24 w-24 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 blur-2xl opacity-20" />
                  <img
                    src="/logo-genie.png"
                    alt="MealGenie Logo"
                    className="relative h-48 w-48 drop-shadow-2xl transition-transform hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Twój osobisty kucharz i dietetyk
                </h3>
                <p className="mt-3 text-sm text-slate-200">
                  Każda sugestia powstaje na bazie Twoich preferencji, sprzętu i
                  czasu. Zero losowości – tylko dopasowanie.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-indigo-400/40 bg-indigo-500/10 p-4 text-sm">
                  <p className="text-xs uppercase tracking-wide text-indigo-100">
                    Dziś
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    Plan 3 posiłków
                  </p>
                  <p className="text-xs text-indigo-100/80">
                    Śniadanie, lunch, kolacja bez zgadywania.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm">
                  <p className="text-xs uppercase tracking-wide text-amber-100">
                    Cel
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    Zero frustracji
                  </p>
                  <p className="text-xs text-amber-100/80">
                    Szybkie decyzje, jasne przepisy, realne wsparcie.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
                  <Activity className="h-4 w-4 text-emerald-200" />
                </span>
                Personalizacja w czasie rzeczywistym, żadnych kompromisów.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 ring-1 ring-indigo-400/30">
            <Sparkles className="h-5 w-5 text-indigo-200" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
              Jak to działa
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Klarowność w 15 sekund
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-900/30 backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-3 text-sm text-indigo-200">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-base font-semibold text-indigo-100">
                  {index + 1}
                </span>
                {step.title}
              </div>
              <p className="text-sm text-slate-200">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500/15 ring-1 ring-fuchsia-400/30">
            <Wand2 className="h-5 w-5 text-fuchsia-200" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
              Dlaczego MealGenie?
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Zmiana, którą poczujesz
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {valuePoints.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-sm shadow-lg shadow-indigo-900/30 backdrop-blur transition-all hover:border-orange-500/30 hover:bg-slate-900/80 hover:shadow-orange-900/20"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-all group-hover:scale-110 group-hover:bg-orange-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-white transition-colors group-hover:text-orange-100">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {description}
              </p>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl transition-all group-hover:bg-orange-500/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 ring-1 ring-indigo-400/30">
            <UtensilsCrossed className="h-5 w-5 text-indigo-100" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
              Przykładowe posiłki
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Zobacz jakość zanim klikniesz
            </h2>
            <p className="mt-2 text-sm text-slate-300">
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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <ShieldCheck className="h-5 w-5 text-emerald-100" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
              Zaufanie
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Dlaczego możesz zaufać MealGenie
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm shadow-lg shadow-indigo-900/30 backdrop-blur"
            >
              <p className="text-slate-100">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-screen-2xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-fuchsia-600/40 p-10 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">
                Finał historii
              </p>
              <h3 className="text-3xl font-semibold text-white">
                Zacznij jeść lepiej bez wysiłku.
              </h3>
              <p className="text-sm text-indigo-50/90">
                Przejdź przez krótki onboarding i odkryj swoje pierwsze posiłki
                stworzone specjalnie dla Ciebie.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:justify-end">
              <Link
                to="/onboarding"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 shadow-lg shadow-indigo-900/40 transition hover:-translate-y-0.5"
              >
                Zacznij teraz
              </Link>
              <Link
                to="/generator"
                className="rounded-xl border border-amber-200/70 bg-amber-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.18)] transition hover:-translate-y-0.5 hover:border-amber-100 hover:text-white hover:shadow-[0_0_30px_rgba(245,158,11,0.24)]"
              >
                Zobacz generator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-genie.png"
              alt="MealGenie"
              className="h-10 w-10 rounded-xl bg-white/5 p-1 shadow-lg shadow-indigo-900/40"
            />
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              MealGenie
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link to="/onboarding" className="hover:text-white">
              O nas
            </Link>
            <a className="cursor-default text-slate-500">Polityka</a>
            <a className="cursor-default text-slate-500">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
