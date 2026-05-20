import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { MealGeneratorWizard } from "../components/wizard";
import { Card, Eyebrow } from "../components/ui";

const guestIntroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const guestIntroItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

export function GuestGeneratorPage() {
  return (
    <>
      <section className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <motion.div
          variants={guestIntroContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <motion.div variants={guestIntroItem} className="max-w-3xl space-y-3">
            <Eyebrow>Podgląd generatora</Eyebrow>
            <h1 className="font-serif text-3xl font-medium leading-[1.05] text-ink sm:text-5xl">
              Wypróbuj{" "}
              <span className="bg-gradient-to-r from-accent via-accent-deep to-saffron bg-clip-text text-transparent dark:from-accent dark:via-saffron dark:to-ink">
                MealGenie
              </span>{" "}
              bez konta
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink-soft">
              Jedna darmowa generacja (3 dania), aby szybko zobaczyć jak działa
              system.
              <br />
              Potem możesz założyć konto i przejść do pełnego generatora.
            </p>
          </motion.div>
          <motion.div variants={guestIntroItem} className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill border border-accent bg-accent px-5 py-2.5 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Zaloguj się
            </Link>
            <Link
              to="/"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold leading-none text-ink shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Wróć na start
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          variants={guestIntroContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-3 md:grid-cols-2"
        >
          <motion.div variants={guestIntroItem}>
            <Card className="h-full text-sm leading-6 text-ink-soft">
              <p className="text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-accent">
                Co masz teraz
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>1 darmowa generacja (3 dania),</li>
                <li>typ posiłku + maksymalny czas,</li>
                <li>krótki opis czego szukasz (opcjonalnie),</li>
                <li>brak historii, zapisu i pełnego flow przepisu.</li>
              </ul>
            </Card>
          </motion.div>
          <motion.div variants={guestIntroItem}>
            <Card className="h-full text-sm leading-6 text-ink-soft">
              <p className="text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-basil">
                Co odblokujesz po logowaniu
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>składniki z lodówki i tryb Thermomix,</li>
                <li>tryb porcji: liczba osób albo docelowa gramatura,</li>
                <li>regulacja poziomu głodu (kaloryczność porcji),</li>
                <li>globalne preferencje: dieta, alergie, budżet, sprzęt, poziom pikantności,</li>
                <li>wybór dania i przejście do pełnego przepisu,</li>
                <li>zapis, historia i kolejne generacje bez limitu próby.</li>
              </ul>
            </Card>
          </motion.div>
        </motion.div>
      </section>
      <MealGeneratorWizard mode="guest" />
    </>
  );
}
