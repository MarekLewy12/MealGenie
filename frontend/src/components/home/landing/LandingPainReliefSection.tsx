import { motion, useReducedMotion } from "framer-motion";
import { Clock3, Leaf, SearchX } from "lucide-react";
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

const kitchenNotes = [
  {
    text: "mam ryż, jajka i zero planu",
    className:
      "bg-saffron-soft text-ink dark:bg-saffron/10 dark:text-saffron lg:translate-x-2 lg:-rotate-2",
  },
  {
    text: "nie chcę kolejnego makaronu",
    className:
      "bg-basil-soft text-basil dark:bg-basil/10 lg:translate-x-12 lg:rotate-2",
  },
  {
    text: "25 minut, potem kapitulacja",
    className:
      "bg-accent-soft text-accent-deep dark:bg-accent/10 dark:text-accent lg:-translate-x-2 lg:rotate-1",
  },
  {
    text: "szkoda wyrzucić paprykę",
    className:
      "border border-border bg-bg-sunken text-ink lg:translate-x-8 lg:-rotate-2",
  },
  {
    text: "chcę coś ciepłego, ale bez kombinowania",
    className:
      "bg-bg-elevated text-ink shadow-xs ring-1 ring-border lg:-translate-x-4 lg:rotate-2",
  },
];

const decisionCosts: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Przepisy są zbyt ogólne",
    description:
      "Wyglądają dobrze, ale często ignorują dzisiejszy czas, energię i zapasy.",
    icon: SearchX,
  },
  {
    title: "Decyzja zjada najwięcej siły",
    description:
      "Najtrudniejszy moment zaczyna się jeszcze przed krojeniem składników.",
    icon: Clock3,
  },
  {
    title: "Resztki nie mają planu",
    description:
      "Produkty czekają w lodówce, ale trudno szybko zobaczyć z nich sensowny posiłek.",
    icon: Leaf,
  },
];

export function LandingPainReliefSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-pain-relief-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-bg px-4 py-16 text-ink dark:border-border-strong/80 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
      >
        <motion.div variants={contentStagger} className="max-w-2xl">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>przed gotowaniem</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-pain-relief-heading"
            variants={contentStagger}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Problemem nie jest gotowanie.
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-basil"
            >
              Problemem jest wybór.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Po pracy rzadko brakuje przepisu. Częściej brakuje spokojnej
            decyzji, która pasuje do czasu, energii i tego, co już jest w
            kuchni.
          </motion.p>
        </motion.div>

        <motion.div variants={contentStagger} className="relative">
          <motion.div
            variants={landingStagger}
            className="relative mx-auto max-w-md space-y-3 lg:min-h-[20rem] lg:space-y-0"
          >
            {kitchenNotes.map((note, index) => (
              <motion.div
                key={note.text}
                variants={landingFadeUp}
                className={`rounded-xl px-5 py-4 shadow-sm backdrop-blur-sm lg:absolute lg:w-[85%] ${note.className}`}
                style={{ top: `${index * 3.5}rem`, zIndex: index }}
              >
                <p className="font-brand text-lg font-semibold leading-tight">
                  "{note.text}"
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={landingFadeUp}
            className="mt-8 rounded-2xl border border-border bg-bg-elevated p-2 shadow-xs lg:mt-12"
          >
            {decisionCosts.map((item) => (
              <div
                key={item.title}
                className="group grid gap-4 rounded-xl p-4 transition-colors duration-200 hover:bg-bg-sunken sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-start"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110 dark:bg-accent/10">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-brand text-xl font-semibold leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
