import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { FolkDivider, HandwrittenKicker } from "../../ui";

export function LandingFinalCtaSection() {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="relative overflow-hidden bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-8 h-px w-full bg-border" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <FolkDivider className="mx-auto mb-7 max-w-sm text-accent/70" />

        <HandwrittenKicker>gotujemy?</HandwrittenKicker>
        <h2
          id="landing-final-cta-heading"
          className="mx-auto mt-4 max-w-3xl font-brand text-3xl font-semibold leading-tight text-ink min-[375px]:text-4xl lg:text-5xl"
        >
          Zamiast znowu pytać „co dziś?”, zacznij od pierwszego planu.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft">
          Wpisz, co masz w domu, dodaj preferencje i zobacz propozycję posiłków
          dopasowaną do zwykłego tygodnia.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/try"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-6 py-3 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Wygeneruj pierwszy plan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-elevated px-6 py-3 text-sm font-semibold leading-none text-accent shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Załóż konto
          </Link>
        </div>
      </div>
    </section>
  );
}
