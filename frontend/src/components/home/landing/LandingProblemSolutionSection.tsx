import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, CheckCircle2, Clock3, Leaf, SearchX, Sparkles } from "lucide-react";

import { HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  pulseConnector,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const painPoints = [
  {
    title: "Przepisy są zbyt ogólne",
    description: "Wyglądają dobrze, ale często ignorują dzisiejszy czas, energię i zapasy.",
    icon: SearchX,
    bgColor: "bg-accent-soft/80 dark:bg-accent/10",
    rotate: "lg:-rotate-2",
    position: "lg:absolute lg:left-0 lg:top-0 lg:w-[78%]",
  },
  {
    title: "Decyzja zjada najwięcej siły",
    description: "Najtrudniejszy moment zaczyna się jeszcze przed krojeniem składników.",
    icon: Clock3,
    bgColor: "bg-saffron-soft/80 dark:bg-saffron/10",
    rotate: "lg:rotate-[1.5deg]",
    position: "lg:absolute lg:left-[14%] lg:top-[7rem] lg:w-[78%]",
  },
  {
    title: "Resztki nie mają planu",
    description: "Produkty czekają w lodówce, ale trudno szybko zobaczyć z nich sensowny posiłek.",
    icon: Leaf,
    bgColor: "bg-basil-soft/80 dark:bg-basil/10",
    rotate: "lg:-rotate-1",
    position: "lg:absolute lg:left-[6%] lg:top-[14rem] lg:w-[78%]",
  },
];

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

export function LandingProblemSolutionSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-problem-solution-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg px-4 pt-20 pb-14 text-ink sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-20"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="mx-auto max-w-6xl"
      >
        {/* ── PROBLEM ── */}
        <motion.div variants={contentStagger} className="text-center">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>przed gotowaniem</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-problem-solution-heading"
            variants={contentStagger}
            className="landing-display mx-auto mt-3 max-w-3xl text-3xl text-ink sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Problemem nie jest gotowanie.
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block text-basil">
              Problemem jest wybór.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Po pracy rzadko brakuje przepisu. Częściej brakuje spokojnej decyzji,
            która pasuje do czasu, energii i tego, co już jest w kuchni.
          </motion.p>
        </motion.div>

        {/* Floating pain notes */}
        <motion.div
          variants={landingStagger}
          className="relative mx-auto mt-14 max-w-xl space-y-4 lg:min-h-[22rem] lg:space-y-0"
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={point.title}
              variants={landingFadeUp}
              className={`relative rounded-2xl p-5 shadow-md backdrop-blur-sm sm:p-6 ${point.bgColor} ${point.position} ${point.rotate}`}
              style={{ zIndex: index + 1 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-elevated/70 text-ink-soft shadow-sm">
                  <point.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-brand text-lg font-semibold leading-tight text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                    {point.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CONNECTOR ── */}
        <motion.div
          variants={pulseConnector}
          className="relative mx-auto my-12 flex flex-col items-center gap-0 lg:my-16"
        >
          <div
            className="h-16 w-px bg-gradient-to-b from-transparent via-accent/60 to-accent"
            aria-hidden="true"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-bg text-accent shadow-[0_0_24px_-4px_rgba(232,111,69,0.35)]"
            style={{ animation: shouldReduceMotion ? "none" : "pulse-connector 2.8s ease-in-out infinite" }}
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
          </div>
          <div
            className="h-16 w-px bg-gradient-to-b from-accent via-accent/60 to-transparent"
            aria-hidden="true"
          />
        </motion.div>

        {/* ── SOLUTION ── */}
        <motion.div
          variants={contentStagger}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            variants={landingFadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 via-white/50 to-accent-soft/30 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-white/[0.07] dark:via-white/[0.04] dark:to-accent/[0.06] sm:p-8 lg:p-10"
          >
            {/* Glass glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px] dark:bg-accent/15"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-basil/15 blur-[60px] dark:bg-basil/10"
              aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Signals */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-basil" />
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
                    Sygnały dnia
                  </p>
                </div>

                <motion.div variants={landingStagger} className="grid gap-3">
                  {daySignals.map((signal) => (
                    <motion.div
                      key={signal.label}
                      variants={landingFadeUp}
                      className="flex flex-col rounded-xl bg-bg-sunken/80 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
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

              {/* Result */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
                    Dopasowane danie
                  </p>
                </div>

                <h3 className="font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
