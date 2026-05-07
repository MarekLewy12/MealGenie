import { ArrowRight, Clock3, Leaf, ShoppingBasket } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

import { Badge, DottedRow, HandwrittenKicker } from "../../ui";
import { heroDecisionFacts, landingHeroCopy } from "./landingContent";
import { landingFadeUp, landingStagger } from "./landingMotion";

const heroImages = [
  {
    src: "/hero-images/keto-salmon-bowl.jpg",
    alt: "Miska z pieczonym lososiem, warzywami i kremowym puree",
  },
  {
    src: "/hero-images/pho-chicken.jpg",
    alt: "Aromatyczna zupa pho z kurczakiem i ziołami",
  },
  {
    src: "/hero-images/shakshuka.jpg",
    alt: "Szakszuka z jajkami, pomidorami i ziołami na patelni",
  },
];

const recipeFacts = [
  { label: "Czas", value: "25 min" },
  { label: "Do dokupienia", value: "4 produkty" },
  { label: "Porcje", value: "2 + lunch" },
];

const alternativeRecipes = [
  {
    ...heroImages[1],
    title: "Pho z kurczakiem i limonką",
    meta: "rozgrzewający obiad",
  },
  {
    ...heroImages[2],
    title: "Szakszuka z fetą i ziołami",
    meta: "jedna patelnia",
  },
];

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;

function HeroDecisionCard({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative mt-[4.5rem] max-w-2xl sm:mt-20 lg:mt-24">
      <div
        className="pointer-events-none absolute -inset-3 rounded-md bg-[radial-gradient(circle_at_18%_0%,rgba(194,87,40,0.12),transparent_55%),radial-gradient(circle_at_92%_28%,rgba(90,138,74,0.13),transparent_50%)] blur-xl"
        aria-hidden="true"
      />
      <MotionDiv
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14, rotate: -0.6 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, rotate: -0.6 }}
        transition={shouldReduceMotion ? undefined : { delay: 0.28, duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-sm border border-border-strong bg-bg-elevated p-4 shadow-[0_18px_45px_-34px_rgba(58,40,24,0.75),0_1px_0_rgba(255,255,255,0.5)_inset] sm:p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Dobry kierunek
            </p>
            <p className="mt-1 font-script text-2xl leading-none text-basil">
              bez presji
            </p>
          </div>
          <MotionDiv
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88, rotate: 4 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, rotate: -3 }}
            transition={shouldReduceMotion ? undefined : { delay: 0.86, duration: 0.34, ease: "easeOut" }}
            className="rounded-sm border border-accent/35 bg-accent-soft px-3 py-1 font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep"
          >
            gotowe do wyboru
          </MotionDiv>
        </div>

        <div className="mt-5 rounded-md border border-border bg-bg-sunken p-4">
          <p className="font-brand text-2xl font-semibold leading-tight text-ink">
            Dziś pasuje coś ciepłego, prostego i bez kombinowania.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Nie musisz znaleźć idealnego przepisu. Wystarczy dobry kierunek,
            który da się zrobić.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {heroDecisionFacts.map((fact, index) => (
            <MotionDiv
              key={fact.label}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { delay: 0.44 + index * 0.12, duration: 0.32, ease: "easeOut" }
              }
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 text-sm"
            >
              <span className="font-brand text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                {fact.label}
              </span>
              <span className="min-w-0 border-b border-dotted border-border-strong pb-1 font-semibold text-ink">
                {fact.value}
              </span>
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
}

export function LandingHeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const recipeCardY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const recipeCardRotate = useTransform(scrollYProgress, [0, 1], [0, -1.2]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -36]);

  return (
    <MotionSection
      ref={heroRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.55, ease: "easeOut" }}
      className="relative isolate overflow-hidden bg-bg px-4 pt-12 pb-12 text-ink sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-16"
      aria-labelledby="landing-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(194,87,40,0.16),transparent_64%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(232,138,74,0.11),transparent_66%)]" />
        <div className="absolute right-[8%] top-24 hidden h-80 w-80 rounded-full bg-accent/12 blur-3xl lg:block dark:bg-accent/10" />
        <MotionDiv
          style={shouldReduceMotion ? undefined : { y: backgroundY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(208,189,158,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(208,189,158,0.18)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45 dark:opacity-20"
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-start gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:gap-16 xl:gap-20">
        <div className="max-w-3xl lg:pt-4">
          <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
            <Badge variant="basil" className="gap-1.5">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
              {landingHeroCopy.eyebrow}
            </Badge>
            <HandwrittenKicker className="text-2xl">
              {landingHeroCopy.kicker}
            </HandwrittenKicker>
          </div>

          <MotionH1
            id="landing-hero-title"
            variants={landingStagger}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            className="max-w-3xl text-balance font-brand text-[2.35rem] font-semibold leading-[1.08] text-ink min-[375px]:text-4xl sm:text-5xl lg:text-[4.1rem]"
          >
            {landingHeroCopy.headlineLines.map((line) => (
              <motion.span
                key={line.text}
                variants={landingFadeUp}
                className={line.accent ? "block text-paper-gradient" : "block"}
              >
                {line.text}
              </motion.span>
            ))}
          </MotionH1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:mt-6 sm:text-lg sm:leading-8">
            {landingHeroCopy.subheadline}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              to="/try"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-md border border-accent bg-accent px-8 py-4 text-base font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:border-accent-pressed active:bg-accent-pressed sm:w-auto"
            >
              {landingHeroCopy.primaryCta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-md border border-border-strong bg-bg-elevated/85 px-7 py-4 text-base font-semibold leading-none text-ink shadow-xs transition duration-fast ease-out hover:border-border-strong hover:bg-bg-elevated/85 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:bg-bg-elevated sm:w-auto"
            >
              {landingHeroCopy.secondaryCta}
            </Link>
          </div>

          <HeroDecisionCard shouldReduceMotion={shouldReduceMotion} />

          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            Pierwsza generacja bez konta. Profil zapisze preferencje i historię.
          </p>
        </div>

        <MotionDiv
          style={
            shouldReduceMotion
              ? undefined
              : { y: recipeCardY, rotate: recipeCardRotate }
          }
          className="relative mx-auto w-full max-w-[500px] lg:max-w-[540px]"
        >
          <MotionDiv
            aria-hidden="true"
            className="absolute -left-4 top-5 hidden h-[92%] w-[96%] -rotate-3 rounded-sm border border-border-strong bg-basil-soft/70 shadow-xs sm:block"
            animate={shouldReduceMotion ? undefined : { y: [0, 4, 0], rotate: [-3, -2.5, -3] }}
            transition={shouldReduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <MotionDiv
            aria-hidden="true"
            className="absolute -right-3 top-10 hidden h-[88%] w-[94%] rotate-3 rounded-sm border border-border-strong bg-accent-soft/75 shadow-xs sm:block"
            animate={shouldReduceMotion ? undefined : { y: [0, -3, 0], rotate: [3, 2.4, 3] }}
            transition={shouldReduceMotion ? undefined : { duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="group relative">
            <MotionDiv
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(194,87,40,0.28),rgba(90,138,74,0.18),rgba(194,87,40,0.28))] opacity-25 blur-2xl"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotate: [0, 8, 0], opacity: [0.18, 0.28, 0.18] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-lg bg-[radial-gradient(circle_at_50%_0%,rgba(194,87,40,0.18),transparent_58%),radial-gradient(circle_at_90%_28%,rgba(90,138,74,0.16),transparent_42%)] blur-2xl"
            />
            <article
              aria-label="Karta przykładowego przepisu"
              className="relative overflow-hidden rounded-sm border border-border-strong bg-bg-elevated p-4 text-ink shadow-[0_38px_90px_-52px_rgba(58,40,24,0.9),0_1px_0_rgba(255,255,255,0.45)_inset,0_0_0_1px_rgba(255,255,255,0.18)_inset] ring-1 ring-white/5 transition duration-base ease-out group-hover:border-accent/45 group-hover:shadow-[0_44px_100px_-52px_rgba(58,40,24,0.95),0_1px_0_rgba(255,255,255,0.45)_inset] sm:p-5"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
              />
              <div className="relative">
                <div className="mb-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-pill bg-bg-sunken px-3 py-1 font-script text-lg leading-none text-accent sm:text-xl">
                      domowy pomysł
                    </span>
                    <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
                      zwykłe składniki, spokojny wybór
                    </p>
                  </div>
                  <h2 className="font-brand text-xl font-semibold leading-tight text-ink min-[375px]:text-2xl">
                    Łosoś z puree kalafiorowym i bazylią
                  </h2>
                </div>

                <div className="relative overflow-hidden rounded-sm border border-border bg-bg-sunken">
                  <img
                    src={heroImages[0].src}
                    alt={heroImages[0].alt}
                    className="aspect-[16/11] w-full object-cover transition duration-base ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-pill border border-border bg-bg-elevated/95 px-3 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur">
                    <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    25 minut
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {recipeFacts.map((fact) => (
                    <DottedRow key={fact.label} label={fact.label} value={fact.value} />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-bg-sunken px-3 py-2 text-sm font-semibold text-ink">
                  <ShoppingBasket className="h-4 w-4 shrink-0 text-basil" aria-hidden="true" />
                  <span className="min-w-0 flex-1">Lista braków: 4 produkty</span>
                  <span className="rounded-pill bg-basil-soft px-2 py-0.5 text-xs text-basil">
                    2 już masz
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-3 font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Alternatywy
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {alternativeRecipes.map((recipe) => (
                      <div
                        key={recipe.src}
                        className="group/alt transition duration-base ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                      >
                        <div className="overflow-hidden rounded-sm border border-border bg-bg-sunken">
                          <img
                            src={recipe.src}
                            alt={recipe.alt}
                            className="aspect-square w-full object-cover transition duration-base ease-out group-hover/alt:scale-105 motion-reduce:transition-none motion-reduce:group-hover/alt:scale-100"
                          />
                        </div>
                        <p className="mt-2 text-center font-brand text-xs font-bold leading-tight text-ink-soft transition duration-base ease-out group-hover/alt:text-ink">
                          {recipe.title}
                        </p>
                        <p className="mt-1 text-center text-[0.7rem] leading-4 text-ink-muted transition duration-base ease-out group-hover/alt:text-accent">
                          {recipe.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
