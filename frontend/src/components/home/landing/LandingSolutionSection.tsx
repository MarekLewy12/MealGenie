import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { HandwrittenKicker } from "../../ui";
import { solutionContextItems } from "./landingContent";
import { landingFadeUp, landingSoftScale, landingStagger } from "./landingMotion";

export function LandingSolutionSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-solution-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg-sunken/50 px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(194,87,40,0.11),transparent_32%),radial-gradient(circle_at_82%_40%,rgba(90,138,74,0.10),transparent_34%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.3 }}
          variants={landingStagger}
        >
          <HandwrittenKicker>zamiast losowego przepisu</HandwrittenKicker>
          <motion.h2
            id="landing-solution-heading"
            variants={landingFadeUp}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            <span className="block">Nie zaczynasz od przepisu.</span>
            <span className="block">Zaczynasz od tego,</span>
            <span className="block text-accent">jak wygląda Twój dzień.</span>
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
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.3 }}
          variants={landingStagger}
          className="relative rounded-[1.6rem] border border-border-strong bg-bg-elevated p-5 shadow-[0_30px_70px_-50px_rgba(58,40,24,0.88)] sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
            <div className="space-y-3">
              {solutionContextItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={landingFadeUp}
                  className="rounded-md border border-border bg-bg-sunken px-4 py-3"
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
              className="hidden justify-center sm:flex"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
