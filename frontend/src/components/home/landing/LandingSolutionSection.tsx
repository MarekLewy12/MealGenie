import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, CheckCircle2, Sparkles } from "lucide-react";

import { HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const daySignals = [
  { label: "czas", value: "25 minut" },
  { label: "energia", value: "mało siły po pracy" },
  { label: "zapasy", value: "ryż, jajka, papryka" },
  { label: "zasady", value: "bez laktozy" },
];

const fitReasons = [
  "bez wyprawy do sklepu",
  "ciepłe i sycące",
  "zostawia porcję na jutro",
];

export function LandingSolutionSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-solution-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_100%)] px-4 py-16 text-ink dark:border-border-strong/80 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        <motion.div variants={contentStagger} className="max-w-2xl">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>jak powstaje wybór</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-solution-heading"
            variants={contentStagger}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
          >
            <motion.span variants={headingLineEntrance} className="block">
              MealGenie czyta sytuację,
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-accent"
            >
              nie tylko składniki.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Dobre danie zależy od kilku małych sygnałów naraz: czasu, apetytu,
            ograniczeń i zapasów. Dopiero z nich powstaje sensowny wybór, który
            realnie ugotujesz.
          </motion.p>
        </motion.div>

        <motion.div variants={contentStagger} className="relative">
          <div className="relative rounded-2xl border border-border bg-bg/50 p-5 backdrop-blur-md sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-border-strong pb-4">
              <div className="h-2 w-2 rounded-full bg-basil" />
              <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
                Krok 1: Sygnały dnia
              </p>
            </div>

            <motion.div variants={landingStagger} className="grid gap-3">
              {daySignals.map((signal) => (
                <motion.div
                  key={signal.label}
                  variants={landingFadeUp}
                  className="flex flex-col rounded-lg bg-bg-sunken px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    {signal.label}
                  </span>
                  <span className="mt-1 font-semibold text-ink sm:mt-0">
                    {signal.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative my-4 flex justify-center lg:my-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-accent shadow-sm">
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </div>
            <div
              className="absolute inset-y-0 left-1/2 -z-10 w-px -translate-x-1/2 bg-border-strong"
              aria-hidden="true"
            />
          </div>

          <motion.div
            variants={landingFadeUp}
            className="relative rounded-2xl border border-accent/20 bg-bg-elevated p-5 shadow-[0_12px_24px_-12px_rgba(232,111,69,0.15)] ring-1 ring-accent/5 sm:p-7"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
                Krok 2: Idealne dopasowanie
              </p>
            </div>

            <h3 className="font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Paprykowy ryż z jajkiem i ziołami
            </h3>

            <div className="mt-5 border-t border-dotted border-border-dotted pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Dlaczego to pasuje?
              </p>
              <ul className="space-y-2.5" role="list">
                {fitReasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-center gap-3 text-sm font-medium leading-6 text-ink-soft"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-basil-soft text-basil">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
