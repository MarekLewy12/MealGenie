import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Clock3,
  ListChecks,
  MessageCircle,
  Sparkles,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge, DottedRow, HandwrittenKicker } from "../../ui";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

const recipeFacts = [
  { label: "czas", value: "28 min" },
  { label: "porcje", value: "2 + lunch" },
  { label: "styl", value: "ciepłe, proste" },
];

const shoppingRows = [
  { label: "kasza pęczak", value: "masz", checked: true },
  { label: "pieczarki", value: "masz", checked: true },
  { label: "jarmuż", value: "2 garści", checked: false },
  { label: "twaróg wędzony", value: "120 g", checked: false },
];

const productPillars: Array<{
  label: string;
  helper: string;
  icon: LucideIcon;
}> = [
  {
    label: "Przepis",
    helper: "kroki i ilości",
    icon: Utensils,
  },
  {
    label: "Zakupy",
    helper: "co masz, czego brakuje",
    icon: ListChecks,
  },
  {
    label: "Asystent",
    helper: "zamienniki w trakcie",
    icon: MessageCircle,
  },
];

function RecipePanel() {
  return (
    <section className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="basil">wybrane danie</Badge>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-sunken px-3 py-1 text-xs font-semibold text-ink-muted">
          <Clock3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          gotowe na dziś
        </span>
      </div>

      <h3 className="mt-5 font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        Kremowe pęczotto z pieczarkami i jarmużem
      </h3>

      <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
        Ciepły obiad z prostych składników. Plan zakłada spokojne tempo i
        zostawia porcję na jutro.
      </p>

      <div className="mt-6 space-y-3 rounded-xl border border-border bg-bg-sunken p-4">
        {recipeFacts.map((fact) => (
          <DottedRow key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </div>

      <ol className="mt-6 space-y-4" aria-label="Podgląd kroków przepisu">
        {[
          "Podsmaż pieczarki z czosnkiem.",
          "Dodaj pęczak i podlewaj bulionem.",
          "Na końcu wmieszaj jarmuż i twaróg.",
        ].map((step, index) => (
          <li key={step} className="flex gap-4 text-sm leading-6 text-ink-soft">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-brand text-xs font-bold text-accent-deep dark:bg-accent/20 dark:text-accent">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ShoppingPanel() {
  return (
    <section className="border-b border-border bg-bg p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-basil-soft text-basil dark:bg-basil/20">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
        </div>
        <h3 className="font-brand text-base font-semibold text-ink">
          Lista braków
        </h3>
      </div>

      <div className="space-y-1">
        {shoppingRows.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-bg-sunken"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  item.checked
                    ? "border-basil bg-basil text-ink-inverse"
                    : "border-border-strong bg-transparent"
                }`}
              >
                {item.checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
              </span>
              <span
                className={`font-medium ${
                  item.checked ? "text-ink-muted line-through" : "text-ink"
                }`}
              >
                {item.label}
              </span>
            </div>
            <span className="text-xs font-medium text-ink-soft">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssistantPanel() {
  return (
    <section className="bg-bg-sunken p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-accent dark:bg-accent/20">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
        <h3 className="font-brand text-base font-semibold text-ink">
          Asystent
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-tr-sm border border-border bg-bg-elevated px-4 py-2.5 text-sm leading-6 text-ink shadow-xs">
            Nie mam koperku. Co zamiast?
          </p>
        </div>
        <div className="flex justify-start">
          <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-accent px-4 py-2.5 text-sm leading-6 text-ink-inverse shadow-sm">
            Daj natkę albo szczypiorek. Dodaj pod koniec. Czas przepisu bez zmian.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LandingProductShowcaseSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-labelledby="landing-product-showcase-title"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_48%,var(--bg)_100%)] py-16 text-ink dark:border-border-strong/80 sm:py-20 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.div
          variants={contentStagger}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-center"
        >
          <div className="lg:pr-8">
            <motion.div variants={headingLineEntrance}>
              <HandwrittenKicker>po wyborze dania</HandwrittenKicker>
            </motion.div>

            <motion.h2
              id="landing-product-showcase-title"
              variants={contentStagger}
              className="mt-3 max-w-4xl font-brand text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
            >
              <motion.span variants={headingLineEntrance} className="block">
                Po wyborze dania
              </motion.span>
              <motion.span
                variants={headingLineEntrance}
                className="block text-accent"
              >
                nie zostajesz z samym tytułem.
              </motion.span>
            </motion.h2>

            <motion.p
              variants={landingFadeUp}
              className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
            >
              Plan gotowania, brakujące produkty i pytania w trakcie są w jednym
              miejscu, bez powrotu do chaotycznych notatek.
            </motion.p>
          </div>

          <motion.div
            variants={landingStagger}
            className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
          >
            {productPillars.map((pillar) => (
              <motion.div
                key={pillar.label}
                variants={landingFadeUp}
                className="flex items-start gap-4 rounded-2xl border border-border bg-bg-sunken p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong/50 bg-bg-elevated text-accent shadow-sm">
                  <pillar.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="pt-0.5">
                  <h4 className="font-brand text-base font-semibold leading-tight text-ink">
                    {pillar.label}
                  </h4>
                  <p className="mt-1 text-sm leading-snug text-ink-soft">
                    {pillar.helper}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={cardEntrance} className="relative mt-12">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border-strong bg-bg-elevated shadow-lg sm:rounded-[2rem]">
            <div className="flex items-center gap-3 border-b border-border bg-bg-sunken px-5 py-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-border-strong" />
                <div className="h-3 w-3 rounded-full bg-border-strong" />
                <div className="h-3 w-3 rounded-full bg-border-strong" />
              </div>
              <div className="flex min-w-0 items-center gap-2 pl-2">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="font-brand text-xs font-bold uppercase tracking-wider text-ink-muted">
                  MealGenie Studio
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
              <RecipePanel />
              <div className="flex flex-col border-t border-border lg:border-l lg:border-t-0">
                <ShoppingPanel />
                <div className="flex-1">
                  <AssistantPanel />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
