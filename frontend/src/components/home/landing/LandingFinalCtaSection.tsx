import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";

import { FolkDivider, HandwrittenKicker } from "../../ui";
import { LandingCtaLink } from "./LandingCtaLink";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const startPoints = [
  "Pierwszy pomysł sprawdzisz bez konta",
  "Profil zapisze preferencje",
  "Darmowy start",
];

export function LandingFinalCtaSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="relative scroll-mt-24 bg-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="mx-auto max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-bg-elevated px-6 py-16 text-center shadow-lg sm:px-12 sm:py-20 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,111,69,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(232,138,74,0.06),transparent_50%)]"
            aria-hidden="true"
          />

          <motion.div
            variants={contentStagger}
            className="relative mx-auto max-w-3xl"
          >
            <motion.div variants={headingLineEntrance}>
              <FolkDivider className="mx-auto mb-7 max-w-sm text-accent/50" />
            </motion.div>

            <motion.div variants={headingLineEntrance}>
              <HandwrittenKicker>gotujemy?</HandwrittenKicker>
            </motion.div>

            <motion.h2
              id="landing-final-cta-heading"
              variants={contentStagger}
              className="mx-auto mt-4 font-brand text-3xl font-semibold leading-[1.08] text-ink min-[375px]:text-4xl lg:text-5xl"
            >
              <motion.span variants={headingLineEntrance} className="block">
                Zacznij od
              </motion.span>
              <motion.span
                variants={headingLineEntrance}
                className="block text-cta-gradient"
              >
                dzisiejszego posiłku.
              </motion.span>
            </motion.h2>

            <motion.p
              variants={landingFadeUp}
              className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
            >
              Jedna krótka próba wystarczy, żeby zobaczyć, czy MealGenie pasuje
              do Twojej kuchni.
            </motion.p>

            <motion.div
              variants={landingFadeUp}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center"
            >
              <LandingCtaLink
                to="/try"
                className="sm:min-h-14 sm:px-8 sm:text-base"
              >
                Zobacz pomysł na dziś
                <ArrowRight
                  className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </LandingCtaLink>

              <LandingCtaLink
                to="/login?mode=register"
                variant="secondary"
                className="border-transparent bg-bg-sunken hover:border-accent/30 sm:min-h-14 sm:px-8 sm:text-base"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Załóż profil
              </LandingCtaLink>
            </motion.div>

            <motion.div
              variants={landingStagger}
              className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3"
            >
              {startPoints.map((point) => (
                <motion.div
                  key={point}
                  variants={landingFadeUp}
                  className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                >
                  <CheckCircle2
                    className="h-4 w-4 text-basil"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
