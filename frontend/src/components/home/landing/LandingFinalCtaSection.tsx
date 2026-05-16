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
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,var(--bg)_0%,color-mix(in_srgb,var(--bg-sunken)_60%,var(--bg))_50%,var(--bg-sunken)_100%)] px-4 pb-0 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent dark:via-white/18"
      />

      {/* Atmospheric blobs */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-accent/12 blur-[120px] dark:bg-accent/8"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-basil/10 blur-[100px] dark:bg-basil/6"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3) 0 1px, transparent 1.5px)",
          backgroundSize: "24px 28px, 32px 36px",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto max-w-3xl pb-16 text-center sm:pb-20"
      >
        <motion.div variants={contentStagger}>
          <motion.div
            variants={landingFadeUp}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: "🛡", label: "Preferencje to zasady" },
              { icon: "🛒", label: "Zwykłe produkty" },
              { icon: "♻️", label: "Mniej strat" },
              { icon: "💚", label: "Bez reklam" },
            ].map((item) => (
              <span
                key={item.label}
                className="group inline-flex items-center gap-2 rounded-full border border-white/55 bg-bg-elevated/75 px-4 py-2 text-sm font-semibold text-ink-soft shadow-[0_10px_28px_-22px_rgba(32,37,31,0.45)] backdrop-blur-md transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-accent/25 hover:bg-bg-elevated hover:text-ink dark:border-white/10 dark:bg-white/[0.07] dark:shadow-[0_10px_28px_-20px_rgba(0,0,0,0.55)] dark:hover:bg-white/[0.1]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-sunken/80 text-sm transition-transform duration-[220ms] group-hover:scale-105 dark:bg-white/[0.08]"
                >
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={headingLineEntrance}>
            <FolkDivider className="mx-auto mb-7 max-w-sm text-accent/50" />
          </motion.div>

          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>gotujemy?</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-final-cta-heading"
            variants={contentStagger}
            className="landing-display mx-auto mt-4 max-w-3xl text-3xl text-ink min-[375px]:text-4xl lg:text-5xl xl:text-[3.5rem]"
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
              className="sm:min-h-14 sm:px-8 sm:text-base shadow-[0_0_0_0_rgba(232,111,69,0)] hover:shadow-[0_0_32px_-8px_rgba(232,111,69,0.5)]"
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
      </motion.div>
    </section>
  );
}
