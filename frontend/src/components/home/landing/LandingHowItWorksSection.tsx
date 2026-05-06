import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Card, FolkDivider, HandwrittenKicker } from "../../ui";

const steps = [
  {
    number: "01",
    title: "Podajesz składniki",
    description: "Dodajesz to, co masz pod ręką, czas i najważniejsze ograniczenia.",
  },
  {
    number: "02",
    title: "Dostajesz propozycje",
    description: "MealGenie wybiera dania pasujące do lodówki i rytmu dnia.",
  },
  {
    number: "03",
    title: "Wybierasz przepis",
    description: "Porównujesz krótkie opcje i wybierasz tę, na którą naprawdę masz ochotę.",
  },
  {
    number: "04",
    title: "Gotujesz spokojnie",
    description: "Kroki przepisu i lista zakupów zostają w jednym miejscu.",
  },
];

export function LandingHowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();

  const listVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      aria-labelledby="landing-how-it-works-heading"
      className="relative overflow-hidden bg-bg-sunken px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <HandwrittenKicker>Jak w zeszycie z przepisami</HandwrittenKicker>
          <h2
            id="landing-how-it-works-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl"
          >
            Od lodówki do kolacji w czterech krokach
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft sm:leading-8">
            Krótki przepływ bez przebudowy domowych nawyków: podajesz, wybierasz,
            gotujesz.
          </p>
        </div>

        <FolkDivider className="mx-auto my-7 max-w-md text-accent/75" />

        <Card className="mx-auto max-w-5xl overflow-hidden border-border-strong p-0">
          <motion.ol
            className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={listVariants}
          >
            {steps.map((step) => {
              return (
                <motion.li
                  key={step.number}
                  variants={itemVariants}
                  className="min-w-0 bg-bg-elevated p-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-pill border border-accent/25 bg-accent-soft font-brand text-lg font-semibold text-accent-deep shadow-xs dark:text-accent">
                    {step.number}
                  </div>

                  <h3 className="mt-6 font-brand text-xl font-semibold leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {step.description}
                  </p>
                </motion.li>
              );
            })}
          </motion.ol>
        </Card>
      </div>
    </section>
  );
}
