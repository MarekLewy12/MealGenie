import { motion, useReducedMotion } from "framer-motion";

import { HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const statements = [
  {
    text: "Preferencje to ",
    accent: "zasady",
    suffix: ", nie dodatek.",
    color: "text-accent",
  },
  {
    text: "Składniki ze ",
    accent: "zwykłego",
    suffix: " sklepu.",
    color: "text-basil",
  },
  {
    text: "",
    accent: "Resztki",
    suffix: " dostają szansę.",
    color: "text-saffron dark:text-saffron",
  },
  {
    text: "Propozycje ",
    accent: "bez",
    suffix: " sponsorowanego hałasu.",
    color: "text-bordeaux dark:text-bordeaux",
  },
];

export function LandingTrustSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-trust-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg px-4 pt-10 pb-12 text-ink sm:px-6 sm:pt-14 sm:pb-16 lg:px-8 lg:pt-16 lg:pb-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="mx-auto max-w-4xl"
      >
        <motion.div variants={contentStagger}>
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>spokojnie i jasno</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-trust-heading"
            variants={contentStagger}
            className="landing-display mt-3 max-w-3xl text-3xl text-ink sm:text-4xl lg:text-5xl"
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
            className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            MealGenie ma pomagać w zwykłej kuchni: bez sponsorowanych miejsc,
            bez ignorowania alergii i bez przepisów oderwanych od polskich
            sklepów.
          </motion.p>
        </motion.div>

        {/* Typographic statements */}
        <motion.div
          variants={contentStagger}
          className="mt-14 space-y-6 border-l-2 border-border-strong pl-6 sm:mt-16 sm:space-y-8 sm:pl-8 lg:mt-20 lg:pl-10"
        >
          {statements.map((statement) => (
            <motion.p
              key={statement.accent}
              variants={landingFadeUp}
              className="font-brand text-xl font-semibold leading-snug text-ink sm:text-2xl lg:text-[2rem]"
            >
              {statement.text}
              <span className={statement.color}>{statement.accent}</span>
              {statement.suffix}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
