import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { MessageSquare, ShoppingCart, Sparkles } from "lucide-react";

import { Eyebrow } from "../ui";
import {
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "../home/landing/landingMotion";

// ============================================
// Typy
// ============================================

type HowItWorksStep = {
  number: string;
  verb: string;
  title: string;
  description: string;
  icon: LucideIcon;
  circleClass: string;
};

// ============================================
// 3 kroki onboardingowe
// ============================================

const steps: HowItWorksStep[] = [
  {
    number: "01",
    verb: "Powiedz",
    title: "co lubisz i co masz",
    description:
      "Wystarczy krótki opis dnia albo lista składników z lodówki.",
    icon: MessageSquare,
    circleClass: "bg-accent-soft text-accent dark:bg-accent/20",
  },
  {
    number: "02",
    verb: "Czekaj",
    title: "MealGenie generuje przepis i obraz",
    description:
      "Dostajesz konkretną propozycję z krokami i zdjęciem dania.",
    icon: Sparkles,
    circleClass: "bg-basil-soft text-basil dark:bg-basil/20",
  },
  {
    number: "03",
    verb: "Działaj",
    title: "zapisz lub dodaj do listy zakupów",
    description:
      "Ulubione zostają w bibliotece, brakujące składniki lecą do listy.",
    icon: ShoppingCart,
    circleClass: "bg-saffron-soft text-saffron dark:bg-saffron/20",
  },
];

// ============================================
// Sekcja "Jak to dziala" - 3 numerowane karty z dot-link
// ============================================

export function DashboardHowItWorks() {
  return (
    <motion.section
      variants={sectionEntrance}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      aria-labelledby="dashboard-how-it-works-heading"
    >
      <Eyebrow tone="basil">Jak to działa</Eyebrow>
      <h3
        id="dashboard-how-it-works-heading"
        className="mt-2 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl"
      >
        Trzy kroki do gotowego dania.
      </h3>

      <motion.ol
        variants={landingStagger}
        className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-6"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <motion.li
              key={step.number}
              variants={landingFadeUp}
              className="relative flex flex-col rounded-2xl border border-border bg-bg-elevated p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              {/* Kropkowany lacznik miedzy krokami - lg+ */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none hidden lg:absolute lg:right-0 lg:top-12 lg:block lg:w-6 lg:translate-x-full lg:border-t-2 lg:border-dotted lg:border-border-strong"
                />
              )}

              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-brand text-lg font-bold ${step.circleClass}`}
                >
                  {step.number}
                </span>
                <Icon
                  className="h-5 w-5 text-ink-muted"
                  aria-hidden="true"
                />
              </div>

              <p className="font-brand text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                {step.verb}
              </p>
              <h4 className="mt-1.5 font-brand text-base font-semibold leading-snug text-ink sm:text-lg">
                {step.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {step.description}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.section>
  );
}
