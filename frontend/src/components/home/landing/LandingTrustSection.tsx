import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Leaf, ShieldCheck, ShoppingBasket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const trustPrinciples: Array<{
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
}> = [
  {
    title: "Preferencje to zasady",
    description:
      "Dieta, alergie i nielubiane składniki wpływają na wybór od razu, nie po fakcie.",
    badge: "uważnie",
    icon: ShieldCheck,
  },
  {
    title: "Zwyczajne produkty",
    description:
      "Pomysły bazują na tym, co kupisz w zwykłym sklepie, na targu albo znajdziesz w domu.",
    badge: "praktycznie",
    icon: ShoppingBasket,
  },
  {
    title: "Sens dla resztek",
    description:
      "Aplikacja pomaga zużyć to, co już masz w lodówce, zamiast tworzyć nowe listy zakupów.",
    badge: "mniej strat",
    icon: Leaf,
  },
  {
    title: "Bez zapłaconego hałasu",
    description:
      "Propozycje wynikają wyłącznie z Twojej sytuacji, a nie z wykupionego miejsca reklamowego.",
    badge: "bez reklam",
    icon: HeartHandshake,
  },
];

export function LandingTrustSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-trust-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-bg px-4 py-16 text-ink dark:border-border-strong/80 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="mx-auto max-w-6xl"
      >
        <motion.div
          variants={contentStagger}
          className="mb-12 max-w-3xl lg:mb-16"
        >
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>spokojnie i jasno</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-trust-heading"
            variants={contentStagger}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Dobre podpowiedzi
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-accent"
            >
              muszą znać granice.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            MealGenie ma pomagać w zwykłej kuchni: bez sponsorowanych miejsc,
            bez ignorowania alergii i bez przepisów oderwanych od polskich
            sklepów.
          </motion.p>
        </motion.div>

        <motion.div
          variants={landingStagger}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {trustPrinciples.map((principle) => (
            <motion.article
              key={principle.title}
              variants={landingFadeUp}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div>
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-dotted border-border-dotted pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent dark:bg-accent/10">
                    <principle.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-bg-sunken px-3 py-1 font-brand text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {principle.badge}
                  </span>
                </div>

                <h3 className="font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
                  {principle.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
