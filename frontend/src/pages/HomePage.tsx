import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FloatingFoodElements } from "../components/home/FloatingFoodElements";
import { PainPointsSection } from "../components/home/PainPointsSection";
import { ScrollIndicator } from "../components/home/ScrollIndicator";
import { StatsSection } from "../components/home/StatsSection";
import { MealCard } from "../components/MealCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
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
    imageUrl: "/hero-images/keto-salmon-bowl.jpg",
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
    imageUrl: "/hero-images/pho-chicken.jpg",
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
    imageUrl: "/hero-images/shakshuka.jpg",
  },
];

const howItWorks = [
  {
    title: "Witaj! Pozwól się poznać",
    description:
      "Ustal preferencje, alergie, kuchnie, czas. Robisz to raz – aplikacja zapamiętuje.",
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

const trustPoints = [
  "Składniki dobierane pod polskie sklepy i sezon.",
  "Zero reklam, zero sponsorowanych przepisów – czysta użyteczność.",
  "Transparentne źródła: dieta, alergie, sprzęt kuchenny zawsze na pierwszym miejscu.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shoppingView = useScrollAnimation(0.3);
  const howItWorksView = useScrollAnimation(0.3);
  const systemView = useScrollAnimation(0.25);
  const trustView = useScrollAnimation(0.25);
  const ctaView = useScrollAnimation(0.25);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % sampleMeals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMeal = sampleMeals[activeIndex];

  return (
    <div className="relative isolate overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#020617]">
      <section className="relative overflow-visible pt-20 pb-16 lg:pt-32 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
          <div className="absolute left-1/2 top-[-10%] h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-500/15 dark:blur-[140px]" />
          <div className="absolute left-[15%] top-[18%] h-[520px] w-[520px] rounded-full bg-fuchsia-200/30 blur-[90px] dark:bg-fuchsia-600/20 dark:blur-[120px]" />
          <div className="absolute right-[12%] top-[8%] h-[480px] w-[480px] rounded-full bg-blue-200/30 blur-[90px] dark:bg-blue-600/20 dark:blur-[120px]" />
        </div>
        <FloatingFoodElements />
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="relative z-10 text-center lg:col-span-7 lg:text-left">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm shadow-indigo-100 transition-colors dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:shadow-indigo-900/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                Twój osobisty cyfrowy kucharz
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
                  <div className="relative z-20 mb-8 hidden animate-float sm:block">
                    <img
                      src="/logo-genie.png"
                      alt="MealGenie"
                      className="h-32 w-32 drop-shadow-2xl sm:h-48 sm:w-48"
                    />
                  </div>

                <div className="relative w-full">
                  <div
                    key={`prev-${activeIndex}`}
                    className="pointer-events-none absolute inset-0 transform-gpu opacity-0"
                    style={{ transform: "rotateY(-5deg) rotateX(2deg)" }}
                  />
                  <div
                    key={activeIndex}
                    className="relative w-full transform-gpu fade-slide-in"
                    style={{ transform: "rotateY(-5deg) rotateX(2deg)" }}
                  >
                    <div className="absolute inset-0 translate-y-4 scale-95 rounded-3xl bg-indigo-100/50 blur-sm dark:bg-indigo-900/20" />
                    <div className="relative rounded-3xl shadow-2xl shadow-indigo-200/50 dark:shadow-black/50">
                      <MealCard
                        meal={currentMeal}
                        onSelect={() => {}}
                        showAction={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-52 -right-4 hidden animate-float delay-100 xs:block lg:-right-12">
                  <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-800/90">
                    <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {currentMeal.cookingTimeMinutes} min
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-4 hidden animate-float delay-300 xs:block lg:-left-12">
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
        <ScrollIndicator />
      </section>

      <StatsSection />
      <PainPointsSection />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent shadow-[0_0_12px_rgba(79,70,229,0.25)] dark:via-indigo-500/70 dark:shadow-[0_0_16px_rgba(99,102,241,0.35)]" />
      </div>

      <section
        ref={shoppingView.ref}
        className="relative overflow-hidden py-24 lg:py-32"
      >
        <div className="absolute inset-0 origin-bottom-right scale-110 skew-y-3 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 opacity-80 dark:from-slate-900/20 dark:via-slate-900/20 dark:to-slate-900/30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            className="grid items-center gap-16 lg:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            animate={shoppingView.isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="order-2 space-y-6 lg:order-1"
              variants={staggerItem}
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                Logistyka z głowy
              </div>
              <h2 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                Lista zakupów <br />
                <span className="text-emerald-500">robi się sama.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Wybierasz dania, a MealGenie automatycznie generuje listę zakupów, grupuje produkty
                według alejek w sklepie i pozwala odhaczać to, co już masz.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Automatyczne sumowanie składników",
                  "Podział na kategorie (Warzywa, Nabiał...)",
                  "Odhaczanie jednym kliknięciem",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="order-1 flex justify-center lg:order-2 lg:justify-end"
              variants={staggerItem}
            >
              <div className="relative h-[500px] w-72 rotate-3 rounded-[3rem] border-8 border-slate-200 bg-white shadow-2xl transition-transform duration-500 hover:rotate-0 dark:border-slate-800 dark:bg-slate-950">
                <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-slate-50 p-6 pt-12 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Lista Zakupów</span>
                    <span className="text-xs text-slate-500">3/12</span>
                  </div>
                  {[
                    { name: "Awokado", done: true },
                    { name: "Mleko migdałowe", done: false },
                    { name: "Płatki owsiane", done: false },
                    { name: "Borówki", done: true },
                    { name: "Łosoś", done: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`mb-3 flex items-center gap-3 rounded-xl border p-3 ${
                        item.done
                          ? "border-emerald-500/30 bg-emerald-100/70 text-emerald-900 opacity-80 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                          : "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          item.done
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-400 dark:border-slate-500"
                        }`}
                      >
                        {item.done && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          item.done
                            ? "text-emerald-700 line-through dark:text-emerald-200"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                  <div className="mt-auto flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 dark:shadow-none">
                    Rozpocznij zakupy
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={howItWorksView.ref} className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="mb-16 text-center"
            variants={fadeUp}
            initial="hidden"
            animate={howItWorksView.isInView ? "visible" : "hidden"}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Jak to działa?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-3">
              Trzy proste kroki dzielą Cię od idealnego posiłku. Bez skomplikowanych formularzy.
            </p>
          </motion.div>
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={howItWorksView.isInView ? "visible" : "hidden"}
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-indigo-100/50 backdrop-blur transition-all hover:-translate-y-1 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:shadow-indigo-900/30"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-base font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100">
                    {index + 1}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-500/40" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{step.description}</p>
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-200/30 blur-3xl transition-all group-hover:bg-indigo-200/50 dark:bg-indigo-600/20" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={systemView.ref} className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={systemView.isInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Więcej niż przepisy. <span className="text-indigo-500">System.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={systemView.isInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={staggerItem}
            className="group relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-8 text-slate-900 shadow-lg shadow-indigo-100 transition-transform dark:border-indigo-500/20 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:shadow-indigo-900/40 md:col-span-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
              <Brain className="h-40 w-40 text-indigo-400 dark:text-indigo-600" />
            </div>
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500 shadow-inner shadow-indigo-100/60 dark:bg-indigo-500/20 dark:text-indigo-200 dark:shadow-none">
                  <CheckCircle2 />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Koniec z decyzyjnym paraliżem</h3>
                <p className="max-w-md text-slate-600 dark:text-slate-300">
                  Nie musisz przeglądać tysięcy blogów. MealGenie daje Ci 3 idealne opcje. Wybierasz
                  jedną, reszta znika.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="group rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-lg shadow-indigo-100 transition hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:shadow-indigo-900/30 hover:shadow-orange-200/50"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition-transform group-hover:scale-110 dark:bg-orange-500/20 dark:text-orange-200">
              <Smile />
            </div>
            <h3 className="mb-2 text-xl font-bold">Tylko Twój sprzęt</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Masz tylko Thermomix i mikrofalę? Dostaniesz przepisy tylko pod to.</p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="group rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-lg shadow-indigo-100 transition hover:border-pink-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:shadow-indigo-900/30"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-500 transition-transform group-hover:scale-110 dark:bg-pink-500/20 dark:text-pink-200">
              <Heart />
            </div>
            <h3 className="mb-2 text-xl font-bold">Full personalizacja</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dieta keto, bez glutenu, nienawidzisz kolendry? AI o tym pamięta.</p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="group relative overflow-hidden rounded-3xl border border-fuchsia-200/60 bg-gradient-to-br from-fuchsia-50 via-white to-slate-100 p-8 text-slate-900 shadow-lg shadow-indigo-100 transition-transform dark:border-fuchsia-500/25 dark:bg-gradient-to-br dark:from-fuchsia-950/50 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:shadow-indigo-900/40 md:col-span-2"
          >
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-[100px] dark:bg-fuchsia-500/15" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-500 shadow-inner shadow-fuchsia-100/60 dark:bg-fuchsia-500/20 dark:text-fuchsia-200 dark:shadow-none">
                  <Brain />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Uczy się Ciebie</h3>
                <p className="max-w-md text-slate-600 dark:text-slate-300">
                  Im częściej używasz, tym lepsze propozycje dostajesz. To nie jest statyczna baza, to
                  Twój osobisty kucharz.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section
        ref={trustView.ref}
        className="relative mx-auto max-w-screen-2xl px-6 pb-16"
      >
        <motion.div
          className="mb-6 flex items-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate={trustView.isInView ? "visible" : "hidden"}
        >
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
        </motion.div>
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={trustView.isInView ? "visible" : "hidden"}
        >
          {trustPoints.map((point) => (
            <motion.div
              key={point}
              variants={staggerItem}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-indigo-900/30"
            >
              <p className="text-slate-700 dark:text-slate-100">{point}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section
        ref={ctaView.ref}
        className="relative mx-auto max-w-screen-2xl px-6 pb-20"
      >
        <motion.div
          className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-fuchsia-600/10 p-10 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl dark:border-indigo-500/30 dark:from-indigo-600/40 dark:via-purple-600/40 dark:to-fuchsia-600/40 dark:shadow-indigo-900/40"
          variants={fadeUp}
          initial="hidden"
          animate={ctaView.isInView ? "visible" : "hidden"}
        >
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
        </motion.div>
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
