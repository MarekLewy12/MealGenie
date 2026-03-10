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

const FEATURES = [
  {
    icon: Sparkles,
    title: "Generator posiłków AI",
    description: "Wybierz typ posiłku, czas i składniki - AI zrobi resztę.",
  },
  {
    icon: UtensilsCrossed,
    title: "Pełne przepisy krok po kroku",
    description: "Składniki, wartości odżywcze, kroki i wskazówki szefa kuchni.",
  },
  {
    icon: Heart,
    title: "Ulubione przepisy",
    description: "Zapisuj najlepsze przepisy i wracaj do nich jednym tapnięciem.",
  },
  {
    icon: ShoppingCart,
    title: "Lista zakupów",
    description: "Dodaj składniki z przepisu do listy i idź na zakupy.",
  },
  {
    icon: MessageSquare,
    title: "Asystent kulinarny AI",
    description: "Czat z AI - zapytaj o zamienniki, porady i triki kuchenne.",
  },
  {
    icon: ChefHat,
    title: "Profil kulinarny",
    description: "Dieta, alergie, sprzęt kuchenny - AI dostosowuje się do Ciebie.",
  },
];

const INSTALL_STEPS = [
  "Kliknij przycisk \"Pobierz APK\" lub zeskanuj QR code telefonem.",
  "Android zapyta o pozwolenie na instalację z tego źródła - zezwól.",
  "Otwórz pobrany plik i zainstaluj aplikację.",
  "Gotowe! Zaloguj się tym samym kontem co na stronie.",
];

export function MobilePage() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#020617]">
      <section className="relative overflow-visible pb-16 pt-20 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-500/15" />
          <div className="absolute left-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-fuchsia-200/30 blur-[90px] dark:bg-fuchsia-600/15" />
          <div className="absolute right-[12%] top-[12%] h-[420px] w-[420px] rounded-full bg-blue-200/30 blur-[90px] dark:bg-blue-600/15" />
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
              Wszystko, co znasz z wersji webowej - generator posiłków, przepisy,
              lista zakupów i asystent AI - teraz jako natywna aplikacja na
              Androida. Płynne animacje, szybki dostęp z ekranu głównego
              i natywne powiadomienia.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white p-3 shadow-lg dark:border-indigo-500/30 dark:bg-slate-800">
                    <img
                      src="/qr-mobile.png"
                      alt="QR code do pobrania MealGenie Mobile"
                      className="h-40 w-40"
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Zeskanuj aparatem telefonu
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <span className="hidden text-sm font-medium text-slate-400 sm:block">lub</span>
                  <a
                    href="/downloads/mealgenie.apk"
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                  >
                    <ArrowDown className="h-5 w-5" />
                    Pobierz APK
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Android 8.0+ · ~25 MB · v1.0.0
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200/60 bg-white/50 py-20 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white"
            >
              Co potrafi aplikacja?
            </motion.h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
                Twoje konto webowe i mobilne jest wspólne - te same dane, te same przepisy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
