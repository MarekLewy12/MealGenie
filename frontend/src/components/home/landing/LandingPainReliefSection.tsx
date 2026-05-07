import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import type { PointerEvent } from "react";

import { HandwrittenKicker } from "../../ui";
import { problemCards, problemNotes } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const noteRotations = [-5, 4, -2, 6, -4, 3];
const noteMarginsTop = [-145, -82, -18, 46, 112, 170];
const noteMarginsLeft = [-44, 42, -34, 38, -18, 28];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ProblemNote({
  index,
  note,
  shouldReduceMotion,
}: {
  index: number;
  note: string;
  shouldReduceMotion: boolean;
}) {
  const controls = useAnimationControls();
  const baseRotate = noteRotations[index];

  const settleNote = (event: PointerEvent<HTMLDivElement>) => {
    const canHoverPrecisely = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (shouldReduceMotion || event.pointerType !== "mouse" || !canHoverPrecisely) return;

    void controls.start({
      borderColor: "rgba(214,207,200,0.95)",
      boxShadow: "0 16px 34px -30px rgba(58,40,24,0.46)",
      rotate: baseRotate + randomBetween(-3, 3),
      x: randomBetween(-10, 10),
      y: randomBetween(-10, 10),
      transition: {
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      },
    });
  };

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[min(88%,21rem)]"
      style={{
        transform: "translate(-50%, -50%)",
        marginTop: noteMarginsTop[index],
        marginLeft: noteMarginsLeft[index],
      }}
    >
      <motion.div
        className="rounded-[1.15rem] border border-border-strong bg-bg-elevated/90 px-5 py-4 shadow-[0_14px_34px_-30px_rgba(58,40,24,0.52)] ring-1 ring-ink/5 backdrop-blur-xl transition-colors duration-300 ease-out hover:border-accent/40 hover:bg-bg-elevated/95 hover:shadow-[0_18px_42px_-34px_rgba(58,40,24,0.82)] dark:border-white/20 dark:bg-bg-elevated/85 dark:ring-white/10"
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 28,
                rotate: baseRotate - 3,
              }
        }
        animate={controls}
        onViewportEnter={() => {
          if (shouldReduceMotion) return;

          void controls.start({
            opacity: 1,
            y: 0,
            x: 0,
            rotate: baseRotate,
            transition: {
              duration: 0.55,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            },
          });
        }}
        onPointerEnter={settleNote}
        viewport={{ once: true, amount: 0.45 }}
      >
        <p className="font-brand text-lg font-semibold leading-tight text-ink">
          {note}
        </p>
      </motion.div>
    </div>
  );
}

export function LandingPainReliefSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="landing-pain-relief-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-border dark:border-border-strong/80 bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-[-18rem] h-[34rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,160,23,0.12),rgba(194,87,40,0.07)_38%,rgba(90,138,74,0.05)_58%,transparent_78%)] blur-[80px] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(240,192,80,0.08),rgba(232,138,74,0.08)_40%,rgba(139,194,122,0.05)_60%,transparent_78%)]" />
        <div className="absolute left-[-10%] top-[22%] h-[40rem] w-[40rem] rounded-full bg-saffron/8 blur-[120px] dark:bg-saffron/6" />
        <div className="absolute -bottom-[10%] right-[-5%] h-[45rem] w-[45rem] rounded-full bg-accent/6 blur-[120px] dark:bg-accent/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-bg/70 to-bg" />
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative z-10 mx-auto max-w-6xl"
      >
        <motion.div
          variants={contentStagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>codzienność, nie showroom</HandwrittenKicker>
          </motion.div>
          <motion.h2
            id="landing-pain-relief-heading"
            variants={contentStagger}
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Najtrudniejszy składnik
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block">
              do znalezienia?
            </motion.span>
            <motion.span variants={headingLineEntrance} className="block text-basil">
              Dobry pomysł na dziś.
            </motion.span>
          </motion.h2>
          <motion.p
            variants={landingFadeUp}
            className="mt-4 text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Lodówka coś ma, czasu jest mało, a przepisy z internetu często
            zakładają idealne warunki. W normalnej kuchni najpierw trzeba
            znaleźć kierunek.
          </motion.p>
        </motion.div>

        <motion.div
          variants={contentStagger}
          className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <motion.div
            variants={cardEntrance}
            className="relative min-h-[430px]"
          >
            {problemNotes.map((note, index) => (
              <ProblemNote
                key={note}
                index={index}
                note={note}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            ))}
          </motion.div>

          <motion.div
            variants={cardEntrance}
            className="relative overflow-hidden rounded-[1.8rem] border border-border-strong bg-bg-elevated/90 p-6 shadow-[0_30px_70px_-48px_rgba(58,40,24,0.88)] ring-1 ring-ink/5 backdrop-blur-2xl dark:border-white/20 dark:bg-bg-elevated/85 dark:ring-white/10 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-basil/16 blur-3xl"
            />

            <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Przed pierwszym krokiem
            </p>

            <h3 className="mt-3 max-w-xl font-brand text-3xl font-semibold leading-tight text-ink">
              <span className="block">Zanim cokolwiek pokroisz,</span>
              <span className="block">trzeba jeszcze wybrać.</span>
            </h3>

            <motion.div variants={landingStagger} className="mt-7 grid gap-3">
              {problemCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  variants={landingFadeUp}
                  transition={{
                    delay: shouldReduceMotion ? 0 : index * 0.04,
                  }}
                  className="rounded-md border border-border bg-bg-sunken/85 px-4 py-4 shadow-xs ring-1 ring-ink/5 backdrop-blur-md dark:border-white/15 dark:bg-bg-sunken/75 dark:ring-white/10"
                >
                  <h4 className="font-brand text-lg font-semibold leading-tight text-ink">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {card.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
