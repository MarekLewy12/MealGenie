import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { HandwrittenKicker } from "../../ui";
import { solutionContextItems } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingSoftScale,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

export function LandingSolutionSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-solution-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border dark:border-border-strong/80 bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[16%] h-[28rem] w-[28rem] rounded-full bg-basil/4 blur-[110px] dark:left-[5%] dark:top-[-8%] dark:h-[35rem] dark:w-[35rem] dark:bg-basil/6 dark:blur-[100px]" />
        <div className="absolute bottom-[-18%] right-[6%] h-[34rem] w-[34rem] rounded-full bg-saffron/5 blur-[130px] dark:bg-saffron/6" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,var(--accent),transparent_2px)] bg-[length:32px_32px] opacity-[0.018]"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg via-bg/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-bg/70 to-bg" />
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative z-10 mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
      >
        <motion.div
          variants={contentStagger}
        >
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>zamiast losowego przepisu</HandwrittenKicker>
          </motion.div>
          <motion.h2
            id="landing-solution-heading"
            variants={contentStagger}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Nie zaczynasz od przepisu.
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block">
              Zaczynasz od tego,
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block text-accent">
              jak wygląda Twój dzień.
            </motion.span>
          </motion.h2>
          <motion.p
            variants={landingFadeUp}
            className="mt-4 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Czas, apetyt, sprzęt, preferencje i produkty pod ręką tworzą krótki
            obraz sytuacji. Dopiero z niego MealGenie podpowiada dania, które
            brzmią jak coś do zrobienia.
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardEntrance}
          className="relative rounded-[1.6rem] border border-border-strong bg-bg-elevated/90 p-5 shadow-[0_30px_70px_-50px_rgba(32,37,31,0.9)] ring-1 ring-ink/5 backdrop-blur-2xl dark:border-white/20 dark:bg-bg-elevated/85 dark:ring-white/10 sm:p-6"
        >
          <motion.div
            variants={landingStagger}
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center"
          >
            <div className="space-y-3">
              {solutionContextItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={landingFadeUp}
                  className="rounded-md border border-border bg-bg-sunken/85 px-4 py-3 shadow-xs ring-1 ring-ink/5 backdrop-blur-md dark:border-white/15 dark:bg-bg-sunken/75 dark:ring-white/10"
                >
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 font-brand text-lg font-semibold leading-tight text-ink">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={landingSoftScale}
              className="hidden justify-center md:flex"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-pill border border-accent/25 bg-accent-soft text-accent-deep">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              variants={landingSoftScale}
              className="rounded-lg border border-accent/25 bg-accent-soft p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-elevated text-accent">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-4 font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
                Dobry kierunek
              </p>
              <h3 className="mt-2 font-brand text-2xl font-semibold leading-tight text-ink">
                <span className="block">Kilka sensownych opcji,</span>
                <span className="block">każda z jasnym powodem.</span>
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Czas, składniki i ograniczenia są uwzględnione zanim wybierzesz
                danie.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
