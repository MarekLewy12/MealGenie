import { motion, useReducedMotion } from "framer-motion";

import { HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const workflowSteps = [
  {
    number: "01",
    verb: "Powiedz",
    title: "co jest realne dzisiaj",
    description:
      "Nie pełny plan tygodnia. Tylko czas, apetyt i to, co warto wykorzystać.",
  },
  {
    number: "02",
    verb: "Porównaj",
    title: "kilka sensownych opcji",
    description:
      "Każda propozycja ma powód, więc decyzja nie zaczyna się od zera.",
  },
  {
    number: "03",
    verb: "Gotuj",
    title: "z planem przy blacie",
    description:
      "Po wyborze dostajesz kroki, braki zakupowe i miejsce na pytania w trakcie.",
  },
];

export function LandingHowItWorksSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-how-it-works-heading"
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
          className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"
        >
          <div>
            <motion.div variants={headingLineEntrance}>
              <HandwrittenKicker>bez wielkiej instrukcji</HandwrittenKicker>
            </motion.div>

            <motion.h2
              id="landing-how-it-works-heading"
              variants={contentStagger}
              className="mt-3 max-w-3xl font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
            >
              <motion.span variants={headingLineEntrance} className="block">
                Trzy decyzje zamiast
              </motion.span>
              <motion.span
                variants={headingLineEntrance}
                className="block text-accent"
              >
                trzydziestu zakładek.
              </motion.span>
            </motion.h2>
          </div>

          <motion.div
            variants={landingFadeUp}
            className="max-w-xl border-l-2 border-accent/40 pl-5 lg:justify-self-end"
          >
            <p className="text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
              MealGenie prowadzi od krótkiego opisu dnia do planu, który da się od
              razu zabrać do kuchni. Żadnych skomplikowanych formularzy.
            </p>
          </motion.div>
        </motion.div>

        <motion.ol
          variants={landingStagger}
          className="relative mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {workflowSteps.map((step, index) => (
            <motion.li
              key={step.number}
              variants={landingFadeUp}
              className="relative flex flex-col rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-basil-soft font-brand text-xl font-bold text-basil dark:bg-basil/20">
                  {step.number}
                </span>
                {index !== workflowSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-12 hidden w-8 translate-x-full border-t-2 border-dotted border-border-strong lg:block"
                  />
                )}
              </div>

              <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {step.verb}
              </p>

              <h3 className="mt-2 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {step.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </section>
  );
}
