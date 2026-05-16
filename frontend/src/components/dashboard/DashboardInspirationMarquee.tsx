import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Eyebrow } from "../ui";
import {
  landingFadeUp,
  revealViewport,
} from "../home/landing/landingMotion";

// ============================================
// Lista presetow inspiracji - klikalne CTA do generatora
// ============================================

type InspirationItem = {
  label: string;
  to: string;
  tone: string;
};

const dashboardInspirations: InspirationItem[] = [
  {
    label: "Szybki obiad w 20 min",
    to: "/generator?mealType=LUNCH&prepTime=15",
    tone: "bg-accent-soft text-ink dark:bg-accent/12",
  },
  {
    label: "Wegetariańska kolacja",
    to: "/generator?mealType=DINNER&prepTime=30",
    tone: "bg-basil-soft text-ink dark:bg-basil/12",
  },
  {
    label: "Deser bez piekarnika",
    to: "/generator?mealType=DESSERT&prepTime=15",
    tone: "bg-saffron-soft text-ink dark:bg-saffron/12",
  },
  {
    label: "Śniadanie wysokobiałkowe",
    to: "/generator?mealType=BREAKFAST&prepTime=15",
    tone: "bg-bg-elevated text-ink dark:bg-white/[0.06]",
  },
  {
    label: "Lekka kolacja",
    to: "/generator?mealType=DINNER&prepTime=25",
    tone: "bg-basil-soft text-ink dark:bg-basil/12",
  },
  {
    label: "Posiłek z resztek",
    to: "/generator?mealType=LUNCH&prepTime=30",
    tone: "bg-saffron-soft text-ink dark:bg-saffron/12",
  },
  {
    label: "Coś rozgrzewającego",
    to: "/generator?mealType=DINNER&prepTime=45",
    tone: "bg-accent-soft text-ink dark:bg-accent/12",
  },
  {
    label: "30-minutowy obiad",
    to: "/generator?mealType=LUNCH&prepTime=30",
    tone: "bg-bg-elevated text-ink dark:bg-white/[0.06]",
  },
  {
    label: "Słodka przekąska",
    to: "/generator?mealType=SNACK&prepTime=15",
    tone: "bg-saffron-soft text-ink dark:bg-saffron/12",
  },
  {
    label: "Niedzielne gotowanie",
    to: "/generator?mealType=ANY&prepTime=60",
    tone: "bg-accent-soft text-ink dark:bg-accent/12",
  },
];

// ============================================
// Animowany marquee z inspiracjami - klikalne chipy CTA
// ============================================

export function DashboardInspirationMarquee() {
  // Duplikacja listy dla bezszwowej petli marquee
  const items = [...dashboardInspirations, ...dashboardInspirations];

  return (
    <motion.section
      variants={landingFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      aria-labelledby="dashboard-inspirations-heading"
    >
      <h3 id="dashboard-inspirations-heading" className="sr-only">
        Inspiracje dnia
      </h3>

      <div className="mb-3">
        <Eyebrow tone="saffron">Inspiracje dnia</Eyebrow>
      </div>

      <div className="marquee-fade-mask relative overflow-hidden rounded-2xl border border-border bg-bg-sunken/40 py-4 dark:border-border-strong/50">
        <div className="marquee-track py-1 hover:[animation-play-state:paused]">
          {items.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.to}
              className={`inline-flex shrink-0 items-center rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${item.tone}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
