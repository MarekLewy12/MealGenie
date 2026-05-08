import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { FolkDivider, HandwrittenKicker } from "../../ui";
import { LandingCtaLink } from "./LandingCtaLink";
import { finalCtaPoints } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

export function LandingFinalCtaSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border dark:border-border-strong/80 bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto grid max-w-6xl gap-10 px-0 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:text-left"
      >
        <motion.div variants={contentStagger} className="text-center lg:text-left">
          <motion.div variants={headingLineEntrance}>
            <FolkDivider className="mx-auto mb-7 max-w-sm text-accent/70 lg:mx-0" />
          </motion.div>

          <motion.div
            variants={headingLineEntrance}
            className="mx-auto text-center lg:mx-0 lg:max-w-sm"
          >
            <HandwrittenKicker>gotujemy?</HandwrittenKicker>
          </motion.div>
          <motion.h2
            id="landing-final-cta-heading"
            variants={contentStagger}
            className="mx-auto mt-4 max-w-3xl font-brand text-3xl font-semibold leading-tight text-ink min-[375px]:text-4xl lg:mx-0 lg:text-5xl"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Zacznij od jednego posiłku.
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block text-cta-gradient">
              Gotuj spokojniej już dziś.
            </motion.span>
          </motion.h2>
          <motion.p
            variants={landingFadeUp}
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft lg:mx-0"
          >
            Pierwszy pomysł sprawdzisz bez konta. Profil przyda się, gdy chcesz
            zapisać preferencje, historię i ulubione przepisy.
          </motion.p>

          <motion.div
            variants={landingFadeUp}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <LandingCtaLink
              to="/try"
              className="sm:px-6"
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
              className="sm:px-6"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Załóż profil
            </LandingCtaLink>
          </motion.div>

          <motion.p
            variants={landingFadeUp}
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-muted lg:mx-0"
          >
            Pierwsza generacja bez konta. Profil zapisze preferencje i historię.
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardEntrance}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(232,111,69,0.18),rgba(47,138,95,0.10)_42%,transparent_68%)] blur-3xl"
          />

          <div className="relative rounded-[1.8rem] border border-border-strong bg-bg-elevated/85 p-4 shadow-[0_32px_80px_-52px_rgba(32,37,31,0.9)] backdrop-blur sm:p-5">
            <div className="rounded-[1.1rem] border border-border bg-bg-sunken/70 p-4">
              <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Start bez ciężaru
              </p>
              <h3 className="mt-2 font-brand text-2xl font-semibold leading-tight text-ink">
                <span className="block">Nie musisz planować całego tygodnia.</span>
                <span className="block text-accent">Wystarczy dzisiejszy obiad.</span>
              </h3>
              <div className="mt-5 space-y-2">
                {finalCtaPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[0.85rem] bg-bg-elevated px-3 py-2.5 text-sm"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-basil"
                      aria-hidden="true"
                    />
                    <span className="font-semibold leading-6 text-ink">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.1rem] border border-accent/25 bg-accent-soft px-4 py-3">
              <p className="font-brand text-sm font-semibold leading-6 text-accent-deep">
                Dobry pomysł jest gotowy do startu, gdy Ty jesteś.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
