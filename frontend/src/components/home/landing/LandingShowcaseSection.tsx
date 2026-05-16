import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  ListChecks,
} from "lucide-react";

import { DottedRow, HandwrittenKicker } from "../../ui";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

export function LandingShowcaseSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-showcase-heading"
      className="relative scroll-mt-24 overflow-hidden px-4 pt-16 pb-20 text-ink sm:px-6 sm:pt-20 sm:pb-24 lg:px-8 lg:pt-24 lg:pb-24"
      style={{
        background:
          "linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--accent-soft) 8%, var(--bg)) 30%, color-mix(in srgb, var(--basil-soft) 6%, var(--bg)) 70%, var(--bg) 100%)",
      }}
    >
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute left-[10%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-accent/[0.07] blur-[100px] dark:bg-accent/[0.04]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[10%] right-[15%] h-[24rem] w-[24rem] rounded-full bg-basil/[0.06] blur-[80px] dark:bg-basil/[0.03]"
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto max-w-6xl"
      >
        {/* Heading */}
        <motion.div variants={contentStagger} className="text-center">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker>po wyborze dania</HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-showcase-heading"
            variants={contentStagger}
            className="landing-display mx-auto mt-3 max-w-4xl text-3xl text-ink sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Nie zostajesz z samym
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-accent"
            >
              tytułem.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Plan gotowania, brakujące produkty i pytania w trakcie są w jednym
            miejscu, bez powrotu do chaotycznych notatek.
          </motion.p>
        </motion.div>

        {/* ── Immersive composition ── */}
        <motion.div
          variants={contentStagger}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          {/* Desktop: asymmetric grid, Mobile: stack */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
            {/* ─ Fragment: Przepis (largest) ─ */}
            <motion.div
              variants={landingFadeUp}
              className="relative rounded-2xl bg-bg-elevated/70 p-5 shadow-[0_8px_32px_-12px_rgba(32,37,31,0.12)] backdrop-blur-md dark:bg-white/[0.05] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)] sm:p-7 lg:-rotate-[1.5deg]"
            >
              <p className="mb-1 font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
                01 Przepis
              </p>
              <h3 className="font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                Kremowe pęczotto z pieczarkami i jarmużem
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Ciepły obiad z prostych składników. Spokojne tempo i porcja na
                jutro.
              </p>

              <div className="mt-5 space-y-2.5 rounded-xl bg-bg-sunken/60 p-4 backdrop-blur-sm">
                <DottedRow label="czas" value="28 min" />
                <DottedRow label="porcje" value="2 + lunch" />
                <DottedRow label="styl" value="ciepłe, proste" />
              </div>

              <ol className="mt-5 space-y-3">
                {[
                  "Podsmaż pieczarki z czosnkiem.",
                  "Dodaj pęczak i podlewaj bulionem.",
                  "Na końcu wmieszaj jarmuż i twaróg.",
                ].map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-6 text-ink-soft"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-brand text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Right column: Zakupy + Asystent stacked */}
            <div className="flex flex-col gap-5 lg:gap-6">
              {/* ─ Fragment: Zakupy ─ */}
              <motion.div
                variants={landingFadeUp}
                className="rounded-2xl bg-bg-elevated/70 p-5 shadow-[0_6px_24px_-8px_rgba(32,37,31,0.1)] backdrop-blur-md dark:bg-white/[0.05] dark:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)] lg:rotate-2"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-basil-soft text-basil dark:bg-basil/20">
                    <ListChecks className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-basil">
                    02 Zakupy
                  </p>
                </div>

                <div className="space-y-1">
                  {[
                    { name: "kasza pęczak", val: "masz", ok: true },
                    { name: "pieczarki", val: "masz", ok: true },
                    { name: "jarmuż", val: "2 garści", ok: false },
                    { name: "twaróg wędzony", val: "120 g", ok: false },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-1.5 text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                            item.ok
                              ? "bg-basil text-ink-inverse"
                              : "border border-border-strong"
                          }`}
                        >
                          {item.ok ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : null}
                        </span>
                        <span
                          className={
                            item.ok
                              ? "text-ink-muted line-through"
                              : "font-medium text-ink"
                          }
                        >
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs text-ink-soft">{item.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─ Fragment: Asystent (no card wrapper) ─ */}
              <motion.div variants={landingFadeUp} className="px-1 lg:px-2">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent dark:bg-accent/20">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
                    03 Asystent
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-end">
                    <p className="max-w-[88%] rounded-2xl rounded-tr-sm border border-border bg-bg-elevated/90 px-4 py-2.5 text-sm text-ink shadow-sm backdrop-blur-sm">
                      Nie mam koperku. Co zamiast?
                    </p>
                  </div>
                  <div className="flex justify-start">
                    <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-accent px-4 py-2.5 text-sm text-ink-inverse shadow-md">
                      Daj natkę albo szczypiorek. Dodaj pod koniec. Czas
                      przepisu bez zmian.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Impact strip */}
        <motion.div
          variants={landingFadeUp}
          className="mx-auto mt-16 max-w-4xl border-t border-border/70 pt-6"
        >
          <p className="text-center font-brand text-sm font-bold uppercase tracking-[0.16em] text-ink-muted">
            Wpływ na wieczór
          </p>
          <div className="mx-auto mt-6 max-w-lg space-y-5">
            {[
              { label: "czas na decyzję", value: "krócej", color: "text-accent" },
              { label: "produkty bez planu", value: "mniej", color: "text-basil" },
              { label: "spokój przy gotowaniu", value: "więcej", color: "text-saffron dark:text-saffron" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-4 border-b border-dotted border-border-dotted pb-3"
              >
                <span className="font-brand text-sm font-bold uppercase tracking-[0.12em] text-ink-muted">
                  {item.label}
                </span>
                <span className={`shrink-0 font-brand text-base font-semibold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
