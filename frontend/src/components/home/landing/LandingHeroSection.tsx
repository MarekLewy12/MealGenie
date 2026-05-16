import { ArrowRight, CheckCircle2, Clock3, Leaf } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { PointerEvent } from "react";

import { Badge, DottedRow, HandwrittenKicker } from "../../ui";
import { LandingCtaLink } from "./LandingCtaLink";
import { landingHeroCopy } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  sectionEntrance,
} from "./landingMotion";
import { usePointerParallax } from "./usePointerParallax";

const heroRecipes = [
  {
    title: "Łosoś z puree kalafiorowym i bazylią",
    img: "/hero-images/keto-salmon-bowl.jpg",
    alt: "Miska z pieczonym łososiem, warzywami i kremowym puree",
    badge: "domowy pomysł",
    time: "25 minut",
    facts: [
      { label: "Czas", value: "25 min" },
      { label: "Do dokupienia", value: "4 produkty" },
      { label: "Porcje", value: "2 + lunch" },
    ],
  },
  {
    title: "Pho z kurczakiem i limonką",
    img: "/hero-images/pho-chicken.jpg",
    alt: "Aromatyczna zupa pho z kurczakiem i ziołami",
    badge: "rozgrzewający obiad",
    time: "30 minut",
    facts: [
      { label: "Czas", value: "30 min" },
      { label: "Do dokupienia", value: "3 produkty" },
      { label: "Porcje", value: "2 osoby" },
    ],
  },
  {
    title: "Szakszuka z fetą i ziołami",
    img: "/hero-images/shakshuka.jpg",
    alt: "Szakszuka z jajkami, pomidorami i ziołami na patelni",
    badge: "jedna patelnia",
    time: "20 minut",
    facts: [
      { label: "Czas", value: "20 min" },
      { label: "Do dokupienia", value: "2 produkty" },
      { label: "Porcje", value: "2 osoby" },
    ],
  },
];

const CAROUSEL_INTERVAL = 5000;

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

export function LandingHeroSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mainCardParallax = usePointerParallax({
    maxRotate: 7,
    maxTranslate: 10,
    scale: 1.018,
  });
  const [activeRecipe, setActiveRecipe] = useState(0);

  const handleRecipeSelect = useCallback((index: number) => {
    setActiveRecipe(index);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => {
      setActiveRecipe((prev) => (prev + 1) % heroRecipes.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, activeRecipe]);

  const recipe = heroRecipes[activeRecipe];

  const handleHeroCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    mainCardParallax.onPointerMove(event);
  };

  const handleHeroCardPointerLeave = (event: PointerEvent<HTMLElement>) => {
    mainCardParallax.onPointerLeave(event);
  };

  return (
    <MotionSection
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      variants={sectionEntrance}
      className="relative isolate overflow-hidden border-b border-border dark:border-border-strong/80 bg-bg px-4 pt-10 pb-14 text-ink sm:px-6 sm:pt-16 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20"
      aria-labelledby="landing-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-bg">
        <MotionDiv
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.15, 1],
                  x: ["0%", "4%", "0%"],
                  y: ["0%", "8%", "0%"],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 15, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute -left-[10%] -top-[10%] h-[50rem] w-[50rem] rounded-full bg-saffron/28 blur-[120px] dark:bg-saffron/18"
        />

        <MotionDiv
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.1, 1],
                  x: ["0%", "-6%", "0%"],
                  y: ["0%", "12%", "0%"],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }
          }
          className="absolute -right-[15%] top-[10%] h-[55rem] w-[55rem] rounded-full bg-accent/25 blur-[120px] dark:bg-accent/22"
        />

        <MotionDiv
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  x: ["0%", "8%", "0%"],
                  y: ["0%", "-8%", "0%"],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }
          }
          className="absolute bottom-[-10%] left-[20%] h-[45rem] w-[45rem] rounded-full bg-basil/20 blur-[120px] dark:bg-basil/15"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.42),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.32),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.58)_0_1px,transparent_1.6px),radial-gradient(circle_at_70%_65%,rgba(32,37,31,0.18)_0_1px,transparent_1.4px)] [background-position:0_0,9px_13px] [background-size:19px_23px,29px_31px] dark:opacity-[0.06]" />
        <div className="absolute inset-x-0 bottom-[-1px] h-72 bg-gradient-to-b from-transparent via-bg/62 to-bg" />
      </div>

      <MotionDiv
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={contentStagger}
        className="mx-auto grid max-w-7xl items-start gap-7 sm:gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:gap-16 xl:gap-20"
      >
        <MotionDiv
          variants={contentStagger}
          className="max-w-3xl lg:pt-4"
        >
          <MotionDiv
            variants={headingLineEntrance}
            className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6"
          >
            <Badge variant="basil" className="gap-1.5">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
              {landingHeroCopy.eyebrow}
            </Badge>
            <HandwrittenKicker className="text-2xl">
              {landingHeroCopy.kicker}
            </HandwrittenKicker>
          </MotionDiv>

          <MotionH1
            id="landing-hero-title"
            variants={landingStagger}
            className="landing-display max-w-3xl text-balance text-[2rem] text-ink min-[375px]:text-[2.35rem] sm:text-5xl lg:text-[4.4rem]"
          >
            {landingHeroCopy.headlineLines.map((line) => (
              <motion.span
                key={line.text}
                variants={headingLineEntrance}
                className={
                  line.accent
                    ? "block text-hero-gradient"
                    : "block"
                }
              >
                {line.text}
              </motion.span>
            ))}
          </MotionH1>

          <MotionP
            variants={landingFadeUp}
            className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:mt-6 sm:text-lg sm:leading-8"
          >
            {landingHeroCopy.subheadline}
          </MotionP>

          <MotionDiv
            variants={landingFadeUp}
            className="mt-6 flex w-fit flex-col items-center sm:mt-8"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <LandingCtaLink
                to="/try"
                className="sm:min-h-14 sm:gap-2.5 sm:px-8 sm:py-4 sm:text-base"
              >
                {landingHeroCopy.primaryCta}
                <ArrowRight
                  className="h-5 w-5 transition duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </LandingCtaLink>
              <LandingCtaLink
                to="/login?mode=register"
                variant="secondary"
                className="text-ink hover:border-accent/40 hover:bg-bg-elevated hover:text-ink sm:min-h-14 sm:gap-2.5 sm:px-7 sm:py-4 sm:text-base"
              >
                {landingHeroCopy.secondaryCta}
              </LandingCtaLink>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {["Bez konta", "Po polsku", "Darmowy start"].map((point) => (
                <span key={point} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <CheckCircle2 className="h-4 w-4 text-basil" />
                  {point}
                </span>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            variants={landingFadeUp}
            className="mt-7 max-w-lg rounded-xl border border-border/70 bg-bg-elevated/78 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.07] sm:p-5"
          >
            <p className="font-brand text-lg font-semibold leading-snug text-ink sm:text-xl">
              Dziś pasuje coś{" "}
              <span className="text-bordeaux dark:text-saffron">ciepłego</span>,{" "}
              <span className="text-basil">prostego</span> i{" "}
              <span className="text-accent">bez spiny</span>.
            </p>
            <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span>25 minut</span>
              <span aria-hidden="true" className="text-border-strong">·</span>
              <span>mało energii</span>
              <span aria-hidden="true" className="text-border-strong">·</span>
              <span>pasuje do preferencji</span>
            </p>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          onPointerMove={handleHeroCardPointerMove}
          onPointerLeave={handleHeroCardPointerLeave}
          variants={cardEntrance}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={
            shouldReduceMotion
              ? undefined
              : { delay: 0.24, duration: 0.56, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative mx-auto w-full max-w-[500px] lg:max-w-[540px]"
        >
          <MotionDiv
            className="group relative will-change-transform"
            style={shouldReduceMotion ? undefined : mainCardParallax.style}
          >
            {/* Ghost cards - stacked effect */}
            <div
              aria-hidden="true"
              className="absolute -left-3 top-4 h-[94%] w-[97%] -rotate-[4deg] rounded-[14px] border border-basil/15 bg-basil-soft/60 shadow-[0_12px_32px_-28px_rgba(32,37,31,0.5)] transition-transform duration-500 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 dark:border-basil/10 dark:bg-basil/8 sm:block hidden"
            />
            <div
              aria-hidden="true"
              className="absolute -right-2.5 top-7 h-[90%] w-[95%] rotate-[3.5deg] rounded-[14px] border border-accent/15 bg-accent-soft/65 shadow-[0_10px_28px_-26px_rgba(32,37,31,0.45)] transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1 dark:border-accent/10 dark:bg-accent/8 sm:block hidden"
            />
            <div className="relative overflow-hidden rounded-[14px] p-[2px] shadow-[0_18px_48px_-38px_rgba(32,37,31,0.62),0_0_34px_-24px_rgba(232,111,69,0.32)] transition duration-300 ease-out group-hover:shadow-[0_24px_56px_-42px_rgba(32,37,31,0.58),0_0_46px_-26px_rgba(232,111,69,0.4)]">
              <div
                aria-hidden="true"
                className="hero-card-border-flow absolute inset-0 rounded-[14px] opacity-95 dark:opacity-100"
              />

              <div
                aria-hidden="true"
                className="hero-card-border-glow absolute inset-[-16px] rounded-[22px] opacity-30 blur-2xl dark:opacity-60"
              />

              <article
                aria-label="Karta przykładowego przepisu"
                className="relative h-full w-full overflow-hidden rounded-[12px] bg-bg-elevated px-4 py-5 text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] sm:px-5 sm:py-6"
              >
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeRecipe}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.992 }}
                      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                      className="min-h-[27.75rem] min-[375px]:min-h-[28.75rem] sm:min-h-[30.5rem]"
                    >
                      <div className="mb-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-pill bg-bg-sunken px-3 py-1 font-script text-lg leading-none text-accent sm:text-xl">
                            {recipe.badge}
                          </span>
                          <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
                            zwykłe składniki, spokojny wybór
                          </p>
                        </div>
                        <h2 className="font-brand text-xl font-semibold leading-tight text-ink min-[375px]:text-2xl">
                          {recipe.title}
                        </h2>
                      </div>

                      <div className="relative overflow-hidden rounded-sm border border-border bg-bg-sunken">
                        <img
                          src={recipe.img}
                          alt={recipe.alt}
                          className="aspect-[16/11] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-pill border border-border bg-bg-elevated/95 px-3 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur">
                          <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          {recipe.time}
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {recipe.facts.map((fact) => (
                          <DottedRow key={fact.label} label={fact.label} value={fact.value} />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel dots */}
                  <div className="mt-4 flex justify-center gap-2 py-1">
                    {heroRecipes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecipeSelect(i)}
                        className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ease-out ${
                          i === activeRecipe
                            ? "w-9 border border-accent/25 bg-accent/20 dark:border-accent/30 dark:bg-accent/18"
                            : "w-2 bg-border-strong hover:bg-accent/50"
                        }`}
                        aria-label={`Pokaż danie ${i + 1}`}
                      >
                        {i === activeRecipe && !shouldReduceMotion ? (
                          <span
                            key={activeRecipe}
                            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent"
                            style={{
                              animation: `carousel-dot-fill ${CAROUSEL_INTERVAL}ms linear`,
                            }}
                          />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </MotionSection>
  );
}
