import { motion, useReducedMotion } from "framer-motion";

import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { Badge, HandwrittenKicker } from "../../ui";
import { landingTrustCards } from "./landingContent";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const trustRules = ["bez sponsorowanych dań", "bez ukrytych priorytetów"];

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
      className="relative scroll-mt-24 overflow-hidden bg-bg px-4 py-14 text-ink sm:px-6 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          {...motionProps}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <HandwrittenKicker className="text-2xl">spokojnie i jasno</HandwrittenKicker>
          <h2
            id="landing-trust-heading"
            className="mt-3 font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            <span className="block">Normalne składniki.</span>
            <span className="block text-accent">Przepisy bez marketingowego szumu.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            MealGenie stawia na produkty z polskich sklepów, jasne preferencje
            i propozycje, które wynikają z dopasowania, nie z reklamy.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 h-px max-w-lg bg-border" />

        <motion.div
          {...motionProps}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.08 },
            },
          }}
          className="mt-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="rounded-sm border border-border-strong bg-bg-elevated p-6 shadow-sm sm:p-7"
          >
            <Badge variant="accent">bez marketingowego szumu</Badge>
            <p className="mt-5 font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Propozycje mają być praktyczne dla Twojej kuchni, a nie efektowne
              tylko na zdjęciu.
            </p>
            <div className="mt-6 space-y-2">
              {trustRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-sm border border-border bg-bg-sunken px-3 py-2 text-sm font-semibold text-ink-soft"
                >
                  {rule}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="divide-y divide-border rounded-[1.4rem] border border-border-strong bg-bg-elevated/70 backdrop-blur">
            {landingTrustCards.map((item) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="grid gap-4 px-5 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-sunken text-accent">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <div>
                  <h3 className="font-brand text-lg font-semibold leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {item.description}
                  </p>
                </div>

                <Badge variant={item.badgeVariant}>{item.badge}</Badge>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
