import { motion } from "framer-motion";
import {
  ArrowDown,
  ChefHat,
  Heart,
  MessageSquare,
  ShoppingCart,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

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
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeSlideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeSlideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const STORIES = [
  {
    icon: Sparkles,
    badge: "Generator AI",
    title: "Powiedz co masz w lodówce - AI zrobi resztę",
    description:
      "Wybierz typ posiłku, ustaw czas przygotowania, dodaj składniki " +
      "które masz pod ręką. Sztuczna inteligencja wygeneruje 3 " +
      "dopasowane propozycje w kilka sekund.",
    screen: "/mobile-screens/02-generator.png",
  },
  {
    icon: UtensilsCrossed,
    badge: "Przepisy",
    title: "Pełne przepisy krok po kroku z wartościami odżywczymi",
    description:
      "Każdy przepis to kompletny przewodnik - składniki z ilościami, " +
      "makroskładniki, ponumerowane kroki i wskazówki szefa kuchni. " +
      "Generowane specjalnie dla Ciebie przez AI.",
    screen: "/mobile-screens/03-recipe.png",
  },
  {
    icon: Heart,
    badge: "Dashboard",
    title: "Twoje centrum dowodzenia kuchennego",
    description:
      "Ostatnie przepisy, ulubione posiłki, statystyki - wszystko " +
      "w jednym miejscu. Szybki dostęp do generatora i ustawień " +
      "bez zbędnego klikania.",
    screen: "/mobile-screens/01-dashboard.png",
  },
  {
    icon: ShoppingCart,
    badge: "Zakupy",
    title: "Z przepisu prosto na listę zakupów",
    description:
      "Jednym tapnięciem dodaj wszystkie składniki z przepisu do " +
      "listy zakupów. Odznaczaj kupione produkty w sklepie. " +
      "Koniec z karteczkami na lodówce.",
    screen: "/mobile-screens/04-shopping.png",
  },
  {
    icon: MessageSquare,
    badge: "Asystent AI",
    title: "Twój osobisty asystent kulinarny na czacie",
    description:
      "Zapytaj o zamienniki składników, porady kuchenne, co " +
      "ugotować z tego co masz. AI odpowiada w kontekście Twoich " +
      "preferencji i diety.",
    screen: "/mobile-screens/05-chat.png",
  },
  {
    icon: ChefHat,
    badge: "Profil",
    title: "AI, które naprawdę Cię zna",
    description:
      "Dieta, alergie, ulubione kuchnie, poziom ostrości, sprzęt " +
      "kuchenny - ustaw raz, a każdy wygenerowany przepis będzie " +
      "dopasowany właśnie do Ciebie.",
    screen: "/mobile-screens/06-settings.png",
  },
] as const;

const INSTALL_STEPS = [
  'Kliknij przycisk "Pobierz APK" lub zeskanuj QR code telefonem.',
  "Android zapyta o pozwolenie na instalację z tego źródła - zezwól.",
  "Otwórz pobrany plik i zainstaluj aplikację.",
  "Gotowe! Zaloguj się tym samym kontem co na stronie.",
];

function StorySection({
  story,
  index,
}: {
  story: (typeof STORIES)[number];
  index: number;
}) {
  const isReversed = index % 2 !== 0;
  const sectionView = useScrollAnimation(0.2);

  return (
    <motion.div
      ref={sectionView.ref}
      initial="hidden"
      animate={sectionView.isInView ? "visible" : "hidden"}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <motion.div
        variants={isReversed ? fadeSlideRight : fadeSlideLeft}
        className={isReversed ? "lg:order-2" : ""}
      >
        <div className="relative mx-auto max-w-[320px]">
          <div className="relative rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(99,102,241,0.95)_0%,rgba(168,85,247,0.82)_24%,rgba(244,114,182,0.78)_52%,rgba(251,191,36,0.86)_76%,rgba(255,255,255,0.98)_100%)] p-[4px] shadow-[0_26px_70px_rgba(99,102,241,0.22)] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.24)_0%,rgba(129,140,248,0.92)_18%,rgba(168,85,247,0.9)_42%,rgba(217,70,239,0.88)_66%,rgba(251,191,36,0.82)_84%,rgba(255,255,255,0.18)_100%)] dark:shadow-[0_30px_90px_rgba(76,29,149,0.36)]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.08)_36%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_38%,rgba(255,255,255,0)_100%)]" />
            <div className="relative overflow-hidden rounded-[1.35rem] bg-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <img
                src={story.screen}
                alt={story.title}
                className="w-full"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={isReversed ? fadeSlideLeft : fadeSlideRight}
        className={isReversed ? "lg:order-1 lg:text-right" : ""}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          <story.icon className="h-3.5 w-3.5" />
          {story.badge}
        </div>

        <h3 className="mt-4 text-2xl font-bold leading-snug text-slate-900 dark:text-white sm:text-3xl">
          {story.title}
        </h3>

        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
          {story.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function MobilePage() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#020617]">
      <section className="relative overflow-visible pb-16 pt-20 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-500/15" />
          <div className="absolute left-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-fuchsia-200/30 blur-[90px] dark:bg-fuchsia-600/15" />
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200"
            >
              <Smartphone className="h-4 w-4" />
              Aplikacja mobilna na Androida
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl"
            >
              MealGenie{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-300 dark:via-white dark:to-indigo-300">
                w Twojej kieszeni
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              Wszystko, co znasz z wersji webowej - generator posiłków,
              przepisy, lista zakupów i asystent AI - teraz jako natywna
              aplikacja na Androida. Płynne animacje, szybki dostęp z
              ekranu głównego i natywne powiadomienia.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-8 sm:flex-row"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white p-2.5 shadow-lg dark:border-indigo-500/30 dark:bg-slate-800">
                  <img
                    src="/qr-mobile.png"
                    alt="QR code - pobierz MealGenie"
                    className="h-36 w-36"
                  />
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Zeskanuj telefonem
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-slate-400">lub</span>
                <a
                  href="/downloads/mealgenie.apk"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                >
                  <ArrowDown className="h-5 w-5" />
                  Pobierz APK
                </a>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Android 8.0+ · ~80 MB · v1.0.0
                    </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200/60 bg-white/50 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="divide-y divide-slate-200/60 dark:divide-white/5">
            {STORIES.map((story, idx) => (
              <div key={story.badge} className="py-20 lg:py-28">
                <StorySection story={story} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/60 py-16 dark:border-white/5">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-[30px] p-[2px] shadow-[0_0_55px_rgba(99,102,241,0.2)] dark:shadow-[0_0_70px_rgba(129,140,248,0.28)]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px]">
              <motion.div
                className="absolute inset-[-125%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.18)_0deg,rgba(99,102,241,1)_60deg,rgba(168,85,247,0.95)_140deg,rgba(217,70,239,0.9)_200deg,rgba(251,191,36,0.95)_255deg,rgba(99,102,241,0.9)_320deg,rgba(99,102,241,0.18)_360deg)] dark:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(129,140,248,0.2)_0deg,rgba(165,180,252,1)_65deg,rgba(192,132,252,0.95)_145deg,rgba(232,121,249,0.9)_210deg,rgba(252,211,77,0.92)_270deg,rgba(129,140,248,0.9)_325deg,rgba(129,140,248,0.2)_360deg)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-110%] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0)_0deg,rgba(99,102,241,0.45)_90deg,rgba(217,70,239,0.35)_180deg,rgba(251,191,36,0.4)_250deg,rgba(99,102,241,0)_360deg)] blur-xl dark:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(129,140,248,0)_0deg,rgba(129,140,248,0.5)_90deg,rgba(232,121,249,0.35)_185deg,rgba(252,211,77,0.42)_255deg,rgba(129,140,248,0)_360deg)]"
                animate={{ rotate: -360, scale: [1, 1.04, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="absolute inset-0 rounded-[30px] bg-white/75 dark:bg-slate-950/35" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50/60 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-12 dark:border-white/10 dark:from-indigo-500/10 dark:via-slate-900/65 dark:to-fuchsia-500/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-fuchsia-200/30 blur-3xl dark:bg-fuchsia-500/10" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <Sparkles className="h-4 w-4" />
                  Już wkrótce
                </div>

                <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  MealGenie zmierza na Google Play
                </h2>

                <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Pracuję nad publikacją MealGenie w Google Play Store.
                  Automatyczne aktualizacje, większe zaufanie i łatwiejsza
                  instalacja - to kwestia czasu. Na teraz pobierz APK
                  bezpośrednio z tej strony.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white"
            >
              Jak zainstalować?
            </motion.h2>

            <div className="space-y-4">
              {INSTALL_STEPS.map((step, idx) => (
                <motion.div
                  key={step}
                  variants={staggerItem}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    {idx + 1}
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Twoje konto webowe i mobilne jest wspólne - te same dane,
                te same przepisy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
