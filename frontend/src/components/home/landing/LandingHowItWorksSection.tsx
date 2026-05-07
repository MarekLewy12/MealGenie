import { motion, useReducedMotion } from "framer-motion";

import { HandwrittenKicker } from "../../ui";
import { landingHowSteps } from "./landingContent";
import { landingFadeUp, landingStagger } from "./landingMotion";

export function LandingHowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-how-it-works-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg px-4 py-16 text-ink sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <HandwrittenKicker>bez wielkiej instrukcji</HandwrittenKicker>
          <h2
            id="landing-how-it-works-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            <span className="block">Od braku pomysłu</span>
            <span className="block text-accent">do gotowania.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft sm:leading-8">
            Bez planowania całego tygodnia. Wystarczy opisać dzisiejszą
            sytuację i wybrać kierunek, który pasuje do Twojej kuchni.
          </p>
        </div>

        <div className="relative mt-12">
          <motion.ol
            className="relative grid gap-8 lg:grid-cols-3 lg:gap-6"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.25 }}
            variants={landingStagger}
          >
            {landingHowSteps.map((step) => {
              return (
                <motion.li
                  key={step.number}
                  variants={landingFadeUp}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="relative border-l border-border-strong pl-6 lg:border-l-0 lg:pl-0 lg:pt-10"
                >
                  <div className="relative border-t border-border-strong pt-7 lg:min-h-[12rem]">
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 left-0 h-6 w-6 rounded-full border border-accent/30 bg-bg shadow-xs"
                    />
                    <p className="font-brand text-[4rem] font-semibold leading-none text-accent/[0.14]">
                      {step.number}
                    </p>
                    <h3 className="relative z-10 mt-2 font-brand text-xl font-semibold leading-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="relative z-10 mt-3 max-w-xs text-sm leading-6 text-ink-soft">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
