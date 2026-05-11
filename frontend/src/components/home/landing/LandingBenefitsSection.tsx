import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ListChecks, SearchX, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DottedRow, HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const weeklyGains: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  bgTone: string;
  iconTone: string;
}> = [
  {
    title: "Mniej przeglądania",
    description:
      "Zamiast porównywać kolejne przepisy, zaczynasz od kilku opcji pasujących do dnia.",
    icon: SearchX,
    bgTone: "bg-accent-soft dark:bg-accent/10",
    iconTone: "text-accent",
  },
  {
    title: "Mniej wyrzucania",
    description:
      "Łatwiej zauważyć produkty, które już są w kuchni i powinny zagrać pierwszą rolę.",
    icon: Leaf,
    bgTone: "bg-basil-soft dark:bg-basil/10",
    iconTone: "text-basil",
  },
  {
    title: "Więcej kontroli",
    description:
      "Preferencje, alergie, budżet i sprzęt są zasadami, a nie dopiskiem na końcu.",
    icon: ShieldCheck,
    bgTone: "bg-saffron-soft dark:bg-saffron/10",
    iconTone: "text-ink dark:text-saffron",
  },
  {
    title: "Więcej domknięcia",
    description:
      "Po wyborze zostaje konkretny przepis, lista braków i pomoc w trakcie gotowania.",
    icon: ListChecks,
    bgTone: "bg-bg-sunken dark:bg-white/5",
    iconTone: "text-ink-soft",
  },
];

export function LandingBenefitsSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-benefits-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-bg px-4 py-16 text-ink dark:border-border-strong/80 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
      >
        <motion.div variants={contentStagger} className="lg:sticky lg:top-28">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>w praktyce</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-benefits-heading"
            variants={contentStagger}
            className="mt-3 max-w-xl font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Mała decyzja,
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-paper-gradient"
            >
              która porządkuje wieczór.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            MealGenie nie próbuje zaplanować życia. Ma pomóc szybciej wejść do
            kuchni z jednym dobrym planem.
          </motion.p>

          <motion.div
            variants={landingFadeUp}
            className="mt-8 max-w-md rounded-2xl border border-border bg-bg-sunken p-5 sm:p-6"
          >
            <p className="mb-4 font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
              Wpływ na wieczór
            </p>
            <DottedRow label="czas na decyzję" value="krócej" />
            <DottedRow
              className="mt-3"
              label="produkty bez planu"
              value="mniej"
            />
            <DottedRow
              className="mt-3"
              label="spokój przy gotowaniu"
              value="więcej"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={landingStagger} className="grid gap-4 sm:gap-6">
          {weeklyGains.map((gain) => (
            <motion.article
              key={gain.title}
              variants={landingFadeUp}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-elevated p-5 shadow-xs transition-colors hover:bg-bg sm:flex-row sm:items-start sm:p-6"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${gain.bgTone}`}
              >
                <gain.icon
                  className={`h-5 w-5 ${gain.iconTone}`}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                  {gain.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
                  {gain.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
