import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Bot,
  Check,
  Clock3,
  ListChecks,
  Sparkles,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge, HandwrittenKicker } from "../../ui";
import { cn } from "../../../utils/cn";
import { experienceHighlights, type Tone } from "./landingContent";
import {
  cardEntrance,
  contentStagger,
  headingLineEntrance,
  landingCardPop,
  landingFadeUp,
  landingStagger,
  revealViewport,
  sectionEntrance,
} from "./landingMotion";

type ExperienceHighlight = {
  label: string;
  helper: string;
  icon: LucideIcon;
  tone: Tone;
};

type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
};

type Macro = {
  label: string;
  value: string;
};

type ShoppingItem = {
  name: string;
  amount: string;
  checked?: boolean;
};

const macros: Macro[] = [
  { label: "Białko", value: "32 g" },
  { label: "Węgle", value: "48 g" },
  { label: "Tłuszcze", value: "18 g" },
];

const shoppingItems: ShoppingItem[] = [
  { name: "kasza pęczak", amount: "masz", checked: true },
  { name: "pieczarki", amount: "masz", checked: true },
  { name: "jarmuż", amount: "2 garści" },
  { name: "twaróg wędzony", amount: "120 g" },
];

const contextSignals = ["25 minut", "2 porcje + lunch", "bez mięsa", "średni głód"];

const contextIngredients = [
  { label: "masz", value: "kasza, pieczarki, czosnek" },
  { label: "ważne", value: "bez mięsa, bez ciężkiego sosu" },
  { label: "decyzja", value: "kremowe pęczotto" },
];

const recipeStepsPreview = [
  "Podsmaż pieczarki z czosnkiem.",
  "Dodaj pęczak i podlewaj bulionem.",
  "Na końcu wmieszaj jarmuż i twaróg.",
];

const planSignals = [
  { label: "Przepis", value: "kroki" },
  { label: "Makro", value: "pełniej" },
  { label: "Zakupy", value: "2 braki" },
  { label: "Asystent", value: "zamienniki" },
];

const assistantMessages: AssistantMessage[] = [
  {
    role: "user",
    text: "Nie mam koperku. Co zamiast?",
  },
  {
    role: "assistant",
    text: "Daj natkę albo szczypiorek. Dodaj pod koniec. Czas przepisu bez zmian.",
  },
];

const outcomeHighlights = [
  { label: "Plan", value: "1" },
  { label: "Braki", value: "2" },
  { label: "Chaos", value: "0" },
];

const productModeToneClassName: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent-deep",
  basil: "bg-basil/12 text-basil",
  saffron: "bg-saffron/20 text-ink",
  neutral: "bg-bg-sunken text-ink-soft",
};

function FeatureMiniCard({
  mode,
  motionDisabled,
}: {
  mode: ExperienceHighlight;
  motionDisabled: boolean;
}) {
  return (
    <motion.div
      variants={landingCardPop}
      whileHover={
        motionDisabled ? undefined : { y: -6, rotate: -0.4, scale: 1.025 }
      }
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group inline-flex min-h-12 items-center gap-3 rounded-pill border border-border/80 bg-bg-elevated/80 px-3 py-2 shadow-xs backdrop-blur transition duration-base ease-out hover:border-accent/35 hover:bg-accent-soft/35 hover:shadow-sm motion-reduce:hover:translate-y-0"
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-pill transition duration-base ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100",
          productModeToneClassName[mode.tone],
        )}
      >
        <mode.icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block whitespace-nowrap font-brand text-sm font-semibold leading-5 text-ink">
          {mode.label}
        </span>
        <span className="hidden text-xs leading-4 text-ink-soft sm:block">
          {mode.helper}
        </span>
      </span>
    </motion.div>
  );
}

function ProductWindow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-[1120px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 top-12 h-72 rounded-full bg-[radial-gradient(circle_at_45%_20%,rgba(232,111,69,0.22),transparent_46%),radial-gradient(circle_at_72%_35%,rgba(47,138,95,0.18),transparent_42%)] blur-3xl dark:bg-[radial-gradient(circle_at_45%_20%,rgba(232,138,74,0.14),transparent_48%),radial-gradient(circle_at_72%_35%,rgba(139,194,122,0.10),transparent_42%)]"
      />

      <div className="relative rounded-[2rem] border border-ink/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(232,111,69,0.16),rgba(47,138,95,0.14))] p-2 shadow-[0_42px_100px_-54px_rgba(32,37,31,0.88)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(232,138,74,0.14),rgba(139,194,122,0.08))]">
        <div className="overflow-hidden rounded-[1.45rem] border border-border bg-bg-elevated/95 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-elevated/80 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="rounded-pill border border-accent/25 bg-accent-soft px-3 py-1 font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent-deep">
                MealGenie plan
              </span>
              <span className="min-w-0 truncate text-sm font-semibold text-ink-soft">
                wybrane danie zostaje pod ręką
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-pill border border-basil/25 bg-basil/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-basil">
              <span className="h-2 w-2 rounded-full bg-basil shadow-[0_0_0_4px_rgba(47,138,95,0.14)]" />
              wysokie dopasowanie
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function ContextPanel() {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-border bg-bg-sunken/80 p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-basil/14 blur-2xl"
      />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Kontekst uwzględniony
          </p>
          <h3 className="mt-2 font-brand text-2xl font-semibold leading-tight text-ink">
            Plan gotowania już zna dzisiejsze warunki
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {contextSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-pill border border-border bg-bg-elevated px-3 py-1.5 text-sm font-semibold text-ink shadow-xs"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-2 min-[420px]:grid-cols-3 lg:min-w-[18rem]">
          {contextIngredients.map((condition) => (
            <div
              key={condition.label}
              className="rounded-[0.9rem] border border-border bg-bg-elevated/80 px-3 py-2 text-center"
            >
              <p className="font-brand text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-muted">
                {condition.label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-ink">
                {condition.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CookingGlow({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[72%] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(232,111,69,0.16),rgba(47,138,95,0.10)_42%,transparent_68%)] blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.28, 0.46, 0.28], scale: [1, 1.035, 1] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

function MacroCard({ macro }: { macro: Macro }) {
  return (
    <div className="rounded-pill border border-border bg-bg-elevated/60 px-3 py-2 text-center">
      <p className="text-[11px] leading-4 text-ink-muted">{macro.label}</p>
      <p className="font-brand text-sm font-bold leading-5 text-ink">
        {macro.value}
      </p>
    </div>
  );
}

function RecipePreview() {
  const metrics = [
    { label: "Czas", value: "25 min", icon: Clock3 },
    { label: "Porcje", value: "2", icon: Utensils },
    { label: "Kalorie", value: "510 kcal", icon: Sparkles },
  ];

  return (
    <div className="h-full rounded-md border border-border-strong bg-bg p-4 shadow-sm sm:p-5">
      <Badge variant="basil">Wybrane danie</Badge>
      <h3 className="mt-3 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
        Kremowe pęczotto z pieczarkami i jarmużem
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
        Ciepły obiad z produktów, które już są w kuchni. Braki i pomoc przy
        zamianach zostają pod spodem.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-border bg-bg-elevated px-2 py-2 text-center"
          >
            <metric.icon className="mx-auto h-4 w-4 text-accent" aria-hidden="true" />
            <p className="mt-1 text-xs leading-4 text-ink-muted">{metric.label}</p>
            <p className="font-brand text-sm font-bold leading-5 text-ink sm:text-base">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {macros.map((macro) => (
          <MacroCard key={macro.label} macro={macro} />
        ))}
      </div>

      <div className="mt-4 rounded-[1rem] border border-border bg-bg-elevated/70 p-4">
        <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent">
          Plan przepisu
        </p>
        <ol className="mt-3 space-y-2">
          {recipeStepsPreview.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-ink-soft">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-accent-soft font-brand text-xs font-bold text-accent-deep">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ShoppingPreview({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="rounded-md border border-border bg-bg p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="font-brand text-sm font-bold text-ink">Lista braków</h3>
      </div>
      <div className="space-y-2">
        {shoppingItems.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-md bg-bg-elevated px-3 py-2.5 text-sm"
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border",
                item.checked
                  ? "border-basil bg-basil text-ink-inverse"
                  : "border-border-strong bg-bg",
              )}
              aria-hidden="true"
            >
              {item.checked ? (
                <motion.span
                  variants={{
                    hidden: shouldReduceMotion ? {} : { scale: 0.45, opacity: 0 },
                    visible: shouldReduceMotion
                      ? {}
                      : {
                          scale: 1,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 420,
                            damping: 18,
                            delay: 0.12 + index * 0.1,
                          },
                        },
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
              ) : null}
            </span>
            <span className="min-w-0 flex-1 leading-5 text-ink">{item.name}</span>
            <span className="shrink-0 text-ink-soft">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantPreview({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="rounded-md border border-border-strong bg-bg-sunken p-4 text-ink">
      <div className="mb-3 flex items-center gap-2">
        <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="font-brand text-sm font-bold">Asystent przepisu</h3>
      </div>
      <div className="space-y-2">
        <p className="w-fit max-w-[88%] rounded-lg bg-bg-elevated px-4 py-3 text-sm leading-6 text-ink">
          {assistantMessages[0].text}
        </p>
        <motion.p
          className="ml-auto w-fit max-w-[88%] rounded-lg bg-accent px-4 py-3 text-sm leading-6 text-ink-inverse"
          variants={{
            hidden: shouldReduceMotion ? {} : { opacity: 0, y: 8 },
            visible: shouldReduceMotion
              ? {}
              : {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.32, duration: 0.32, ease: "easeOut" },
                },
          }}
        >
          {assistantMessages[1].text}
        </motion.p>
      </div>
    </div>
  );
}

function PlanSignalRail() {
  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {planSignals.map((signal, index) => (
        <div
          key={signal.label}
          className="relative overflow-hidden rounded-[0.95rem] border border-border bg-bg-sunken/65 px-4 py-3"
        >
          <span className="font-brand text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">
            {String(index + 1).padStart(2, "0")} · {signal.label}
          </span>
          <p className="mt-1 font-brand text-base font-semibold leading-tight text-ink">
            {signal.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ShowcaseMockup({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_8%,rgba(232,111,69,0.12),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(47,138,95,0.12),transparent_34%),var(--bg-elevated)] p-4 sm:p-6 lg:p-7">
      <CookingGlow shouldReduceMotion={shouldReduceMotion} />

      <div className="relative space-y-4">
        <ContextPanel />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <RecipePreview />

          <div className="grid gap-4">
            <ShoppingPreview shouldReduceMotion={shouldReduceMotion} />
            <AssistantPreview shouldReduceMotion={shouldReduceMotion} />
          </div>
        </div>

        <PlanSignalRail />
      </div>
    </div>
  );
}

export function LandingProductShowcaseSection() {
  const shouldReduceMotion = useReducedMotion();
  const motionDisabled = Boolean(shouldReduceMotion);

  return (
    <section
      aria-labelledby="landing-product-showcase-title"
      className="relative scroll-mt-24 overflow-hidden border-t border-border dark:border-border-strong/80 bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_48%,var(--bg)_100%)] py-16 text-ink sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(232,111,69,0.10),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(47,138,95,0.13),transparent_34%)] dark:bg-[linear-gradient(135deg,rgba(232,138,74,0.07),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(139,194,122,0.07),transparent_34%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={motionDisabled ? false : "hidden"}
        whileInView={motionDisabled ? undefined : "visible"}
        viewport={revealViewport}
        variants={sectionEntrance}
        className="relative mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.div
          variants={contentStagger}
          className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.55fr)] lg:items-end"
        >
          <motion.div variants={contentStagger}>
            <motion.div variants={headingLineEntrance}>
              <HandwrittenKicker>po wyborze dania</HandwrittenKicker>
            </motion.div>
            <motion.h2
              id="landing-product-showcase-title"
              variants={contentStagger}
              className="mx-auto mt-3 max-w-3xl font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl"
            >
              <motion.span variants={headingLineEntrance} className="block">
                Kiedy wybierzesz danie,
              </motion.span>
              <motion.span variants={headingLineEntrance} className="block text-accent">
                plan zostaje przy blacie.
              </motion.span>
            </motion.h2>
            <motion.p
              variants={landingFadeUp}
              className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg"
            >
              Kroki, makro, zakupy i asystent są w jednym miejscu, więc nie
              wracasz do chaotycznych notatek w połowie gotowania.
            </motion.p>
          </motion.div>

          <motion.div
            variants={cardEntrance}
            className="grid grid-cols-3 gap-2 rounded-[1.4rem] border border-border bg-bg-elevated/70 p-2 shadow-sm backdrop-blur"
          >
            {outcomeHighlights.map((item) => (
              <div key={item.label} className="rounded-[1rem] bg-bg-sunken/75 px-3 py-3 text-center">
                <p className="font-brand text-2xl font-semibold leading-none text-accent">
                  {item.value}
                </p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-ink-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardEntrance}
        >
          <ProductWindow>
            <ShowcaseMockup shouldReduceMotion={motionDisabled} />
          </ProductWindow>
        </motion.div>

        <motion.div
          className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          variants={landingStagger}
        >
          {experienceHighlights.map((mode) => (
            <FeatureMiniCard
              key={mode.label}
              mode={mode}
              motionDisabled={motionDisabled}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
