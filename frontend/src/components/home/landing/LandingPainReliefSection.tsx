import { motion, useReducedMotion } from "framer-motion";

import { HandwrittenKicker } from "../../ui";
import { problemCards, problemNotes } from "./landingContent";

const noteRotations = [-5, 4, -2, 6, -4, 3];
const noteMarginsTop = [-145, -82, -18, 46, 112, 170];
const noteMarginsLeft = [-44, 42, -34, 38, -18, 28];

export function LandingPainReliefSection() {
  const shouldReduceMotion = useReducedMotion();
  const cardInitial = shouldReduceMotion ? false : { opacity: 0, y: 18 };
  const cardWhileInView = shouldReduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <section
      aria-labelledby="landing-pain-relief-heading"
      className="scroll-mt-24 bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <HandwrittenKicker>codzienność, nie showroom</HandwrittenKicker>
          <h2
            id="landing-pain-relief-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            <span className="block">Najtrudniejszy składnik</span>
            <span className="block">do znalezienia?</span>
            <span className="block text-basil">Dobry pomysł na dziś.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            Lodówka coś ma, czasu jest mało, a przepisy z internetu często
            zakładają idealne warunki. W normalnej kuchni najpierw trzeba
            znaleźć kierunek.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={cardInitial}
            whileInView={cardWhileInView}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="relative min-h-[430px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-accent/10 blur-3xl"
            />

            {problemNotes.map((note, index) => (
              <div
                key={note}
                className="absolute left-1/2 top-1/2 w-[min(88%,21rem)]"
                style={{
                  transform: "translate(-50%, -50%)",
                  marginTop: noteMarginsTop[index],
                  marginLeft: noteMarginsLeft[index],
                }}
              >
                <motion.div
                  className="rounded-[1.15rem] border border-border bg-bg-elevated px-5 py-4 shadow-sm"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 28,
                          rotate: noteRotations[index] - 3,
                        }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 1, y: 0, rotate: noteRotations[index] }
                  }
                  viewport={{ once: true, amount: 0.45 }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: 0.55,
                          delay: index * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  whileHover={
                    shouldReduceMotion ? undefined : { y: -5, scale: 1.015 }
                  }
                >
                  <p className="font-brand text-lg font-semibold leading-tight text-ink">
                    {note}
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={cardInitial}
            whileInView={cardWhileInView}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.48, delay: 0.08, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.8rem] border border-border-strong bg-bg-elevated p-6 shadow-[0_30px_70px_-48px_rgba(58,40,24,0.85)] sm:p-8"
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

            <div className="mt-7 grid gap-3">
              {problemCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    duration: 0.34,
                    ease: "easeOut",
                  }}
                  className="rounded-md border border-border bg-bg-sunken px-4 py-4"
                >
                  <h4 className="font-brand text-lg font-semibold leading-tight text-ink">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {card.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
