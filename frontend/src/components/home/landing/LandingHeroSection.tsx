import { ArrowRight, CheckCircle2, Clock3, Leaf, ShoppingBasket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { Badge, DottedRow, FolkDivider, HandwrittenKicker } from "../../ui";

const heroImages = [
  {
    src: "/hero-images/keto-salmon-bowl.jpg",
    alt: "Miska z pieczonym lososiem, warzywami i kremowym puree",
    label: "Kolacja",
  },
  {
    src: "/hero-images/pho-chicken.jpg",
    alt: "Aromatyczna zupa pho z kurczakiem i ziołami",
    label: "Lunch",
  },
  {
    src: "/hero-images/shakshuka.jpg",
    alt: "Szakszuka z jajkami, pomidorami i ziołami na patelni",
    label: "Szybko",
  },
];

const alternativeImages = heroImages.slice(1);

const recipeFacts = [
  { label: "Czas przy kuchni", value: "18 min" },
  { label: "Lista zakupów", value: "1 klik" },
  { label: "Porcje dla domu", value: "2 + lunch" },
];

const trustNotes = [
  "Uwzględnia dietę, alergie i produkty z polskich sklepów.",
  "Podpowiada przepisy na zwykły wtorek, nie tylko na idealny weekend.",
  "Zamienia chaos w lodówce w spokojny plan gotowania.",
];

const MotionSection = motion.section;
const MotionDiv = motion.div;

export function LandingHeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionSection
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.55, ease: "easeOut" }}
      className="relative isolate overflow-hidden bg-bg px-4 pt-12 pb-12 text-ink sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-16"
      aria-labelledby="landing-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(194,87,40,0.16),transparent_64%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(232,138,74,0.11),transparent_66%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(208,189,158,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(208,189,158,0.18)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45 dark:opacity-20" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:gap-16 xl:gap-20">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
            <Badge variant="basil" className="gap-1.5">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
              Polska kuchnia, spokojny tydzień
            </Badge>
            <HandwrittenKicker className="text-2xl">jak u siebie</HandwrittenKicker>
          </div>

          <h1
            id="landing-hero-title"
            className="max-w-3xl text-balance font-brand text-[2.35rem] font-semibold leading-[1.04] text-ink min-[375px]:text-4xl sm:text-5xl lg:text-[4.1rem]"
          >
            Koniec z pytaniem{" "}
            <span className="relative inline-block text-accent">
              „co dziś zjeść?”
              <span
                className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-accent/20"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:mt-6 sm:text-lg sm:leading-8">
            MealGenie zamienia pustą lodówkę, preferencje domowników i brak pomysłów w prosty
            plan posiłku z przepisem oraz listą zakupów.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              to="/try"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-accent bg-accent px-6 py-3 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:border-accent-pressed active:bg-accent-pressed sm:w-auto"
            >
              Wypróbuj bez konta
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-5 py-3 text-sm font-semibold leading-none text-ink-soft transition duration-fast ease-out hover:border-border hover:bg-bg-elevated hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:bg-bg-sunken sm:w-auto"
            >
              Załóż konto lub zaloguj się
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-9 sm:grid-cols-3 lg:max-w-2xl">
            {trustNotes.map((note) => (
              <div key={note} className="flex gap-2 text-[0.95rem] leading-6 text-ink-soft sm:text-sm">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-basil" aria-hidden="true" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[500px] lg:max-w-[540px]">
          <div className="absolute -left-3 top-8 hidden h-28 w-10 -rotate-6 rounded-sm border border-border-strong bg-basil-soft/80 shadow-xs sm:block dark:bg-basil-soft/50" />
          <div className="absolute -right-2 bottom-12 hidden h-24 w-12 rotate-6 rounded-sm border border-border-strong bg-accent-soft/90 shadow-xs sm:block dark:bg-accent-soft/70" />

          <article
            aria-label="Karta przykładowego przepisu"
            className="relative overflow-hidden rounded-sm border border-border-strong bg-bg-elevated p-5 text-ink shadow-[0_32px_70px_-42px_rgba(58,40,24,0.72),0_1px_0_rgba(255,255,255,0.45)_inset] sm:p-6"
          >
            <div className="relative">
              <div className="mb-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-pill bg-bg-sunken px-3 py-1 font-script text-lg leading-none text-accent sm:text-xl">
                    domowy plan
                  </span>
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    Dzisiejsza propozycja
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
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-pill border border-border bg-bg-elevated/95 px-3 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur">
                  <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  18 minut
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recipeFacts.map((fact) => (
                  <DottedRow key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>

              <FolkDivider className="my-5 text-accent/80" />

              <div>
                <p className="mb-3 font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Alternatywy
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {alternativeImages.map((image, index) => (
                    <div key={image.src} className="group">
                      <div className="overflow-hidden rounded-sm border border-border bg-bg-sunken">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="aspect-square w-full object-cover transition duration-base ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                      <p className="mt-2 text-center font-brand text-xs font-bold text-ink-soft">
                        Opcja {index + 2}: {image.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-md border border-border bg-bg-sunken p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <ShoppingBasket className="h-4 w-4 text-basil" aria-hidden="true" />
                  Lista zakupów gotowa do sklepu
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  MealGenie grupuje składniki tak, żeby łatwiej przejść przez warzywa,
                  nabiał i półkę z przyprawami.
                </p>
              </div>
            </div>
          </article>

          {!shouldReduceMotion ? (
            <MotionDiv
              className="pointer-events-none absolute -top-5 left-8 hidden rounded-pill border border-border bg-bg-elevated px-4 py-2 text-sm font-semibold text-ink shadow-md sm:block"
              initial={{ opacity: 0, y: 10, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            >
              AI, ale po domowemu
            </MotionDiv>
          ) : null}
        </div>
      </div>
    </MotionSection>
  );
}
