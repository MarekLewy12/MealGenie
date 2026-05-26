import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ListChecks,
  MessageSquareText,
  PencilLine,
  Scale,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";

import { Badge, HandwrittenKicker } from "../../ui";
import { LandingCtaLink } from "./LandingCtaLink";
import {
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const processPills = [
  {
    label: "Sprawdzam alergie",
    icon: ShieldCheck,
    tone: "bg-basil-soft text-basil dark:bg-basil/20",
    motion: { y: [0, -8, 0] },
    duration: 5.8,
    delay: 0,
  },
  {
    label: "Przeliczam porcje",
    icon: Scale,
    tone: "bg-saffron-soft text-saffron-deep dark:bg-saffron/20 dark:text-saffron",
    motion: { y: [0, 8, 0] },
    duration: 6.4,
    delay: 0.45,
  },
  {
    label: "Aktualizuję zakupy",
    icon: ShoppingBasket,
    tone: "bg-accent-soft text-accent",
    motion: { y: [0, -6, 0] },
    duration: 5.2,
    delay: 0.9,
  },
];

const checkedSteps = [
  "Profil i ograniczenia",
  "Historia posiłków",
  "Lista brakujących zakupów",
];

const shoppingItems = [
  { name: "szczypiorek", state: "usunięto" },
  { name: "pieczywo", state: "opcjonalnie" },
];

export function LandingAgentCanvasSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-agent-canvas-heading"
      className="relative scroll-mt-24 overflow-hidden border-y border-border/60 bg-bg-sunken/45 px-4 py-20 text-ink sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-4 h-[34rem] w-[34rem] rounded-full bg-accent/14 blur-[120px] dark:bg-accent/9" />
        <div className="absolute right-[-8rem] top-24 h-[32rem] w-[32rem] rounded-full bg-saffron/14 blur-[115px] dark:bg-saffron/8" />
        <div className="absolute bottom-[-12rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-basil/12 blur-[120px] dark:bg-basil/8" />
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16"
      >
        <motion.div variants={contentStagger} className="max-w-2xl">
          <motion.div variants={headingLineEntrance}>
            <HandwrittenKicker className="text-accent/85">
              nowy wymiar gotowania
            </HandwrittenKicker>
          </motion.div>

          <motion.h2
            id="landing-agent-canvas-heading"
            variants={contentStagger}
            className="landing-display mt-4 text-3xl text-ink sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
          >
            <motion.span variants={headingLineEntrance} className="block">
              Powiedz, co masz.
            </motion.span>
            <motion.span
              variants={headingLineEntrance}
              className="block text-summary-gradient"
            >
              Agent ułoży plan.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={landingFadeUp}
            className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            MealGenie Agent działa jak rozmowa z osobistym planerem. Dopyta o
            ważne szczegóły, pokaże plan na Canvasie i pozwoli zmienić go
            jednym zdaniem, zanim zapiszesz przepis.
          </motion.p>

          <motion.div
            variants={landingFadeUp}
            className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3"
          >
            {[
              ["rozmowa", "bez formularza"],
              ["canvas", "plan na żywo"],
              ["rewizje", "zmiany w czacie"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/45 bg-bg-elevated/65 px-4 py-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
              >
                <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={landingFadeUp}
            className="mt-8 flex flex-wrap gap-3"
          >
            <LandingCtaLink to="/agent" className="rounded-full shadow-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Uruchom Agenta
            </LandingCtaLink>
            <LandingCtaLink
              to="/login?mode=register"
              variant="secondary"
              className="rounded-full border-white/40 bg-bg-elevated/50 backdrop-blur-md hover:bg-bg-elevated dark:border-white/10"
            >
              Załóż profil
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LandingCtaLink>
          </motion.div>
        </motion.div>

        <motion.div variants={landingFadeUp} className="relative w-full">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-bg-elevated text-accent shadow-lg dark:border-white/10 dark:bg-black/45">
              <div
                className="absolute inset-0 animate-pulse rounded-full bg-accent/15 blur-md"
                aria-hidden="true"
              />
              <div
                className="hero-card-border-flow absolute inset-0 rounded-full opacity-60"
                aria-hidden="true"
              />
              <Bot className="relative h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-2">
              {processPills.map((pill) => (
                <motion.div
                  key={pill.label}
                  animate={shouldReduceMotion ? undefined : pill.motion}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: pill.duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: pill.delay,
                        }
                  }
                  className="flex items-center gap-2 rounded-full border border-white/45 bg-bg-elevated/75 px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-black/35"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${pill.tone}`}
                  >
                    <pill.icon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {pill.label}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <div className="relative rounded-[1.75rem] border border-white/45 bg-bg-elevated/72 p-4 shadow-[0_18px_54px_-34px_rgba(32,37,31,0.42)] backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-deep">
                  Rozmowa
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-end">
                  <p className="max-w-[92%] rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm font-medium leading-6 text-white shadow-[0_12px_28px_-18px_rgba(232,111,69,0.7)]">
                    Mam jajka, śmietanę i 20 minut. Chcę dobre śniadanie.
                  </p>
                </div>
                <div className="flex justify-start">
                  <p className="max-w-[94%] rounded-2xl rounded-bl-sm border border-border/60 bg-bg-elevated/85 px-4 py-3 text-sm leading-6 text-ink-soft shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    Dopytam tylko: wytrawnie czy bardziej kremowo? Potem
                    pokażę plan do akceptacji.
                  </p>
                </div>
                <div className="flex justify-end">
                  <p className="max-w-[88%] rounded-2xl rounded-br-sm bg-accent/95 px-4 py-3 text-sm font-medium leading-6 text-white shadow-[0_12px_28px_-18px_rgba(232,111,69,0.7)]">
                    Kremowo. I bez szczypiorku.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-bg-elevated/78 p-5 shadow-[0_22px_64px_-34px_rgba(32,37,31,0.48),0_0_0_1px_rgba(255,255,255,0.36)_inset] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_64px_-34px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/14 blur-[60px]"
                aria-hidden="true"
              />

              <div className="relative flex flex-wrap items-center gap-2">
                <Badge variant="accent">Plan gotowy</Badge>
                <Badge variant="neutral">Zaktualizowano</Badge>
              </div>

              <div className="relative mt-4">
                <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  Canvas planu
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl">
                  Kremowe jajka ze śmietaną
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Szybkie, ciepłe śniadanie bez szczypiorku. Gotowe w czasie,
                  który masz teraz.
                </p>
              </div>

              <div className="relative mt-4 rounded-2xl border border-accent/20 bg-accent-soft/45 p-3">
                <div className="flex items-center gap-2">
                  <PencilLine className="h-4 w-4 text-accent" aria-hidden="true" />
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
                    Zmiana z rozmowy
                  </p>
                </div>
                <p className="mt-1.5 text-sm font-medium leading-6 text-ink-soft">
                  Usunięto szczypiorek i odświeżono listę zakupów.
                </p>
              </div>

              <div className="relative mt-4 grid gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-basil" aria-hidden="true" />
                    <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-basil">
                      Co sprawdziłem
                    </p>
                  </div>
                  <ul className="space-y-2" role="list">
                    {checkedSteps.map((step) => (
                      <li
                        key={step}
                        className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-basil-soft text-basil">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/60 bg-bg-sunken/55 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="mb-2 flex items-center gap-2">
                    <ShoppingBasket className="h-4 w-4 text-accent" aria-hidden="true" />
                    <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
                      Zakupy
                    </p>
                  </div>
                  <div className="space-y-2">
                    {shoppingItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="font-medium text-ink">{item.name}</span>
                        <span className="rounded-full bg-bg-elevated/80 px-2 py-1 text-xs font-semibold text-ink-muted shadow-xs">
                          {item.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
