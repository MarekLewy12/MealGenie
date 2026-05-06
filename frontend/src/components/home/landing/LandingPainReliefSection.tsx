import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  ChefHat,
  Clock3,
  Leaf,
  ListChecks,
  Repeat2,
} from "lucide-react";

import { Badge, Card, FolkDivider, HandwrittenKicker } from "../../ui";

type PainReliefPoint = {
  title: string;
  pain: string;
  relief: string;
  icon: LucideIcon;
};

type ReliefStep = {
  text: string;
};

const painReliefPoints: PainReliefPoint[] = [
  {
    title: "Nie wiem, co dziś zjeść",
    pain: "Przeglądasz lodówkę i odkładasz decyzję.",
    relief: "MealGenie zaczyna od składników, które już masz.",
    icon: ChefHat,
  },
  {
    title: "Monotonia posiłków",
    pain: "W kółko wraca ten sam zestaw dań.",
    relief: "Dostajesz świeże warianty domowych składników.",
    icon: Repeat2,
  },
  {
    title: "Brak czasu",
    pain: "Nie ma miejsca na długie gotowanie.",
    relief: "Plan wybiera dania na dzisiejszy rytm dnia.",
    icon: Clock3,
  },
  {
    title: "Zbyt skomplikowane przepisy",
    pain: "Przepis robi się dłuższy niż wieczór.",
    relief: "Kroki są krótkie, konkretne i łatwe do przejścia.",
    icon: BookOpenCheck,
  },
];

const reliefSteps: ReliefStep[] = [
  { text: "składniki pod ręką" },
  { text: "realny czas gotowania" },
  { text: "prosty przepis" },
  { text: "gotowa lista zakupów" },
];

export function LandingPainReliefSection() {
  const shouldReduceMotion = useReducedMotion();
  const cardInitial = shouldReduceMotion ? false : { opacity: 0, y: 18 };
  const cardWhileInView = shouldReduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <section
      aria-labelledby="landing-pain-relief-heading"
      className="bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <HandwrittenKicker>spokojniej przy obiedzie</HandwrittenKicker>
          <h2
            id="landing-pain-relief-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            Z „co dziś zjeść?” do spokojnej decyzji
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            MealGenie porządkuje składniki, czas i apetyt w jeden wykonalny plan
            na domowy posiłek.
          </p>
        </div>

        <FolkDivider className="mx-auto mt-7 max-w-md text-accent/75" />

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-start">
          <Card className="overflow-hidden border-border-strong p-0">
            <div className="grid border-b border-dashed border-border-strong px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted sm:grid-cols-[1fr_1fr] sm:px-6">
              <span>Problem</span>
              <span className="mt-1 text-basil sm:mt-0">Ulga z MealGenie</span>
            </div>

            <div className="divide-y divide-dashed divide-border">
              {painReliefPoints.map((point, index) => {
                const Icon = point.icon;

                return (
                  <motion.article
                    key={point.title}
                    className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:px-6"
                    initial={cardInitial}
                    whileInView={cardWhileInView}
                    viewport={{ once: true, amount: 0.32 }}
                    transition={{ duration: 0.36, delay: index * 0.04, ease: "easeOut" }}
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-strong bg-accent-soft text-accent-deep shadow-xs">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-brand text-lg font-semibold leading-snug text-ink">
                          {point.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">{point.pain}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-ink-soft sm:pt-1">{point.relief}</p>
                  </motion.article>
                );
              })}
            </div>
          </Card>

          <Card className="relative overflow-hidden border-border-strong p-6 sm:p-7">
            <div className="pointer-events-none absolute right-5 top-5 text-basil/20" aria-hidden="true">
              <Leaf className="h-14 w-14" />
            </div>
            <Badge variant="basil">MealGenie porządkuje</Badge>
            <h3 className="mt-4 max-w-xs font-brand text-2xl font-semibold leading-tight text-ink">
              Jasna decyzja na dziś
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
              Z luźnych warunków powstaje konkret: danie, kroki i lista zakupów.
            </p>

            <div className="mt-6 space-y-3">
              {reliefSteps.map((step) => (
                <div key={step.text} className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-basil-soft text-basil">
                    <ListChecks className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
