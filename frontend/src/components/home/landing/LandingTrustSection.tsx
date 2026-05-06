import { motion, useReducedMotion } from "framer-motion";
import {
  Eye,
  HeartHandshake,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";

import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { Badge, Card, FolkDivider, HandwrittenKicker } from "../../ui";

const trustCards = [
  {
    title: "Polski kontekst składników",
    description:
      "Propozycje opierają się na produktach z polskich sklepów, targu i domowej spiżarni.",
    icon: ShoppingBasket,
    badge: "lokalnie",
    badgeVariant: "saffron" as const,
  },
  {
    title: "Dieta, alergie i preferencje",
    description:
      "Ograniczenia, nielubiane składniki, czas i sprzęt są częścią dopasowania od początku.",
    icon: ShieldCheck,
    badge: "priorytet",
    badgeVariant: "basil" as const,
  },
  {
    title: "Bez sponsorowanych przepisów",
    description:
      "MealGenie nie podsuwa dań dlatego, że ktoś za nie zapłacił. Liczy się dopasowanie.",
    icon: HeartHandshake,
    badge: "bez reklam",
    badgeVariant: "accent" as const,
  },
  {
    title: "Prywatność i przejrzystość",
    description:
      "Ustawienia profilu służą dopasowaniu. Aplikacja powinna jasno pokazywać, co zapisuje i po co.",
    icon: Eye,
    badge: "jasno",
    badgeVariant: "basil" as const,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function LandingTrustSection() {
  const { ref, isInView } = useScrollAnimation(0.22);
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
      };

  return (
    <section
      ref={ref}
      aria-labelledby="landing-trust-heading"
      className="relative overflow-hidden bg-bg px-4 py-14 text-ink sm:px-6 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          {...motionProps}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <HandwrittenKicker className="text-2xl">spokojnie i po ludzku</HandwrittenKicker>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Zaufanie w kuchni
          </p>
          <h2
            id="landing-trust-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Konkret zamiast obietnic cudów.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            MealGenie ma pomagać w codziennym wyborze posiłku: z lokalnym
            kontekstem, szacunkiem do ograniczeń i bez presji.
          </p>
        </motion.div>

        <FolkDivider className="mx-auto my-8 max-w-md text-accent/80" />

        <motion.div
          {...motionProps}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.08 },
            },
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustCards.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border-strong bg-bg-sunken text-accent shadow-xs">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                </div>
                <h3 className="mt-5 font-brand text-xl font-semibold leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
