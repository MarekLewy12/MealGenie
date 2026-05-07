import { motion, useReducedMotion } from "framer-motion";

import { HandwrittenKicker } from "../../ui";
import { landingBenefits } from "./landingContent";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

export function LandingBenefitsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-benefits-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg-elevated/40 px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
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
          className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
        >
          <motion.div variants={contentStagger}>
            <motion.div variants={headingLineEntrance}>
              <HandwrittenKicker>co zyskujesz</HandwrittenKicker>
            </motion.div>
            <motion.h2
              id="landing-benefits-heading"
              variants={contentStagger}
              className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
            >
              <motion.span variants={headingLineEntrance} className="block">
                Mniej decyzji.
              </motion.span>
              <motion.span variants={headingLineEntrance} className="block">
                Mniej resztek.
              </motion.span>
              <motion.span variants={headingLineEntrance} className="block text-paper-gradient">
                Więcej spokoju.
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.p
            variants={landingFadeUp}
            className="max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8 lg:justify-self-end"
          >
            Nie musisz planować życia w tabelce. Wystarczy szybciej wybrać
            posiłek, zużyć to, co już masz, i wejść do kuchni z jasnym
            kierunkiem.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2"
          variants={landingStagger}
        >
          {landingBenefits.map((benefit) => (
            <motion.article
              key={benefit.title}
              variants={landingFadeUp}
              whileHover={shouldReduceMotion ? undefined : { y: -6, rotate: -0.25 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[1.35rem] border border-border-strong bg-bg-elevated p-5 shadow-sm transition duration-base ease-out hover:border-accent/35 hover:shadow-[0_22px_50px_-42px_rgba(58,40,24,0.82)] motion-reduce:hover:translate-y-0 sm:p-6"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/0 blur-2xl transition duration-300 group-hover:bg-accent/12"
              />

              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-sunken text-accent transition duration-base group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:text-accent-deep">
                  <benefit.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-brand text-xl font-semibold leading-tight text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {benefit.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
