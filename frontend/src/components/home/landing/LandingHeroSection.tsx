import { ArrowRight, Clock3, Leaf, ShoppingBasket } from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import type { PointerEvent } from "react";

import { Badge, DottedRow, HandwrittenKicker } from "../../ui";
import { LandingCtaLink } from "./LandingCtaLink";
import { heroDecisionFacts, landingHeroCopy } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  sectionEntrance,
} from "./landingMotion";
import { usePointerParallax } from "./usePointerParallax";

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
const MotionP = motion.p;

function HeroDecisionCard({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <MotionDiv
      variants={cardEntrance}
      className="relative mt-8 max-w-2xl sm:mt-16 lg:mt-24"
    >
      <div
        className="pointer-events-none absolute -inset-4 rounded-[1.25rem] bg-[radial-gradient(circle_at_18%_0%,rgba(232,111,69,0.14),transparent_56%),radial-gradient(circle_at_92%_28%,rgba(47,138,95,0.12),transparent_52%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[1rem] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.56))] shadow-[0_18px_45px_-34px_rgba(32,37,31,0.75),0_0_32px_-24px_rgba(232,111,69,0.32)] backdrop-blur-2xl dark:border-white/18 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.055))]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(circle_at_14%_0%,rgba(232,111,69,0.18),transparent_38%),radial-gradient(circle_at_88%_18%,rgba(47,138,95,0.18),transparent_42%)] dark:bg-[radial-gradient(circle_at_14%_0%,rgba(232,138,74,0.22),transparent_38%),radial-gradient(circle_at_88%_18%,rgba(139,194,122,0.18),transparent_42%)]"
        />
        <MotionDiv
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14, rotate: -0.6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, rotate: -0.6 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.28, duration: 0.45, ease: "easeOut" }}
          className="relative p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  Dobry kierunek
                </p>
              </div>
            </div>
            <MotionDiv
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88, rotate: 4 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, rotate: -3 }}
              transition={shouldReduceMotion ? undefined : { delay: 0.86, duration: 0.34, ease: "easeOut" }}
              className="rounded-sm border border-accent/35 bg-accent-soft px-2.5 py-1 font-brand text-[0.68rem] font-bold uppercase tracking-[0.08em] text-accent-deep sm:px-3 sm:text-xs sm:tracking-[0.14em]"
            >
              gotowe do wyboru
            </MotionDiv>
          </div>

          <div className="mt-4 rounded-md border border-white/65 bg-[linear-gradient(135deg,rgba(255,255,255,0.54),rgba(251,225,208,0.28),rgba(219,232,211,0.22))] p-3.5 shadow-[0_12px_30px_-26px_rgba(32,37,31,0.72)] ring-1 ring-white/60 backdrop-blur-xl dark:border-white/15 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(232,138,74,0.09),rgba(139,194,122,0.07))] dark:ring-white/10 sm:mt-5 sm:p-4">
            <p className="font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
              Dziś pasuje coś <span className="text-bordeaux dark:text-saffron">ciepłego</span>,{" "}
              <span className="text-basil">prostego</span> i{" "}
              <span className="text-accent">bez spiny</span>.
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
    </MotionDiv>
  );
}

export function LandingHeroSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mainCardParallax = usePointerParallax({
    maxRotate: 7,
    maxTranslate: 10,
    scale: 1.018,
  });
  const basilLayerParallax = usePointerParallax({
    maxRotate: 1.8,
    maxTranslate: 6,
    scale: 1.004,
    spring: { damping: 30, stiffness: 130 },
  });
  const accentLayerParallax = usePointerParallax({
    maxRotate: 1.4,
    maxTranslate: 4,
    scale: 1.006,
    spring: { damping: 32, stiffness: 150 },
  });

  const handleHeroCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    mainCardParallax.onPointerMove(event);
    basilLayerParallax.onPointerMove(event);
    accentLayerParallax.onPointerMove(event);
  };

  const handleHeroCardPointerLeave = (event: PointerEvent<HTMLElement>) => {
    mainCardParallax.onPointerLeave(event);
    basilLayerParallax.onPointerLeave(event);
    accentLayerParallax.onPointerLeave(event);
  };

  return (
    <MotionSection
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      variants={sectionEntrance}
      className="relative isolate overflow-hidden border-b border-border dark:border-border-strong/80 bg-bg px-4 pt-8 pb-10 text-ink sm:px-6 sm:pt-14 sm:pb-12 lg:px-8 lg:pt-20 lg:pb-16"
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
            className="max-w-3xl text-balance font-brand text-[2rem] font-semibold leading-[1.08] text-ink min-[375px]:text-[2.35rem] sm:text-5xl lg:text-[4.1rem]"
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
            className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
          >
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
          </MotionDiv>

          <HeroDecisionCard shouldReduceMotion={shouldReduceMotion} />

          <MotionP
            variants={landingFadeUp}
            className="mt-3 max-w-xl text-sm leading-6 text-ink-muted"
          >
            Pierwsza generacja bez konta. Profil zapisze preferencje i historię.
          </MotionP>
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
            aria-hidden="true"
            className="absolute -left-4 top-5 hidden h-[92%] w-[96%] -rotate-3 rounded-sm border border-basil/20 bg-basil-soft/70 shadow-[0_16px_38px_-34px_rgba(32,37,31,0.58)] sm:block"
            style={
              shouldReduceMotion
                ? undefined
                : { ...basilLayerParallax.style, rotate: -3 }
            }
          />
          <MotionDiv
            aria-hidden="true"
            className="absolute -right-3 top-10 hidden h-[88%] w-[94%] rotate-3 rounded-sm border border-accent/20 bg-accent-soft/75 shadow-[0_14px_34px_-32px_rgba(32,37,31,0.54)] sm:block"
            style={
              shouldReduceMotion
                ? undefined
                : { ...accentLayerParallax.style, rotate: 3 }
            }
          />
          <MotionDiv
            className="group relative will-change-transform"
            style={shouldReduceMotion ? undefined : mainCardParallax.style}
          >
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
                className="relative h-full w-full overflow-hidden rounded-[12px] bg-bg-elevated p-4 text-ink shadow-[0_1px_0_rgba(255,255,255,0.68)_inset,0_0_0_1px_rgba(255,255,255,0.28)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] sm:p-5"
              >
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
                    className="aspect-[16/11] w-full object-cover"
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
                        className="group/alt transition duration-base ease-out"
                      >
                        <div className="overflow-hidden rounded-sm border border-border bg-bg-sunken">
                          <img
                            src={recipe.src}
                            alt={recipe.alt}
                            className="aspect-square w-full object-cover"
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
        </MotionDiv>
      </MotionDiv>
    </MotionSection>
  );
}
