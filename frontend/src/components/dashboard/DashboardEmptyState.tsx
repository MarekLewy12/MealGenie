import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Eyebrow } from "../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  sectionEntrance,
} from "../home/landing/landingMotion";
import { QuickStartCard, quickStarts } from "./quickStarts";

// ============================================
// Karta Empty State - split-layout header + quick start grid + CTA
// ============================================

export function DashboardEmptyState() {
  const prefersReducedMotion = useReducedMotion();
  // Wylacza animacje gdy user ma reduced-motion
  const motionMode = prefersReducedMotion
    ? { initial: false as const, animate: "visible" as const }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <motion.section
      variants={sectionEntrance}
      {...motionMode}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-elevated via-bg-elevated to-accent-soft/15 p-6 shadow-[var(--shadow-accent)] dark:to-accent/[0.04] sm:p-8 lg:p-10"
    >
      {/* Dekoracyjne blury w tle */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[70px] dark:bg-accent/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-saffron/8 blur-[60px] dark:bg-saffron/4"
        aria-hidden="true"
      />

      <div className="relative">
        {/* -------------------------------------------------------
           Split-layout header: tytul lewa, opis prawa (lg+)
           ------------------------------------------------------- */}
        <motion.div
          variants={contentStagger}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12"
        >
          <div className="min-w-0">
            <motion.div variants={landingFadeUp}>
              <Eyebrow tone="accent">Szybki start</Eyebrow>
            </motion.div>

            <motion.h2
              variants={headingLineEntrance}
              className="mt-3 font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]"
            >
              Twoja kuchnia czeka.{" "}
              <span className="text-ink-soft">Wybierz sytuację.</span>
            </motion.h2>
          </div>

          <motion.p
            variants={landingFadeUp}
            className="relative max-w-md font-serif text-lg leading-[1.55] text-ink sm:text-xl lg:justify-self-end lg:pl-6 lg:before:absolute lg:before:left-0 lg:before:top-1 lg:before:h-[calc(100%-0.5rem)] lg:before:w-px lg:before:bg-accent/40"
          >
            Opisz swój dzień, a{" "}
            <span className="font-semibold text-accent">MealGenie</span> dobierze
            kilka sensownych propozycji.
            <span className="mt-2 block text-base text-ink-soft">
              Bez przekopywania internetu.
            </span>
          </motion.p>
        </motion.div>

        {/* -------------------------------------------------------
           Grid quick start kart
           ------------------------------------------------------- */}
        <motion.div
          variants={landingStagger}
          className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
          role="list"
        >
          {quickStarts.map((item) => (
            <motion.div key={item.title} variants={landingFadeUp}>
              <QuickStartCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {/* -------------------------------------------------------
           Dolna sekcja - alternatywne CTA do generatora
           ------------------------------------------------------- */}
        <motion.div
          variants={landingFadeUp}
          className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-serif text-lg font-medium leading-snug text-ink sm:text-xl">
            Albo powiedz{" "}
            <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
              MealGenie
            </span>{" "}
            <span className="text-ink-soft">dokładnie, czego chcesz.</span>
          </p>
          <Link
            to="/generator"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-6 py-2.5 text-sm font-semibold text-ink-inverse shadow-[0_0_20px_-6px_rgba(232,111,69,0.35)] transition duration-fast hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_0_28px_-6px_rgba(232,111,69,0.45)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Otwórz generator
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
