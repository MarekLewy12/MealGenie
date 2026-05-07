import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { FolkDivider, HandwrittenKicker } from "../../ui";
import { finalCtaPoints } from "./landingContent";

export function LandingFinalCtaSection() {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="relative scroll-mt-24 overflow-hidden bg-bg px-4 py-14 text-ink sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-8 h-px w-full bg-border" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-0 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:text-left">
        <div className="text-center lg:text-left">
          <FolkDivider className="mx-auto mb-7 max-w-sm text-accent/70 lg:mx-0" />

          <div className="mx-auto text-center lg:mx-0 lg:max-w-sm">
            <HandwrittenKicker>gotujemy?</HandwrittenKicker>
          </div>
          <h2
            id="landing-final-cta-heading"
            className="mx-auto mt-4 max-w-3xl font-brand text-3xl font-semibold leading-tight text-ink min-[375px]:text-4xl lg:mx-0 lg:text-5xl"
          >
            <span className="block">Zacznij od jednego posiłku.</span>
            <span className="block text-paper-gradient">Gotuj spokojniej już dziś.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft lg:mx-0">
            Pierwszy pomysł sprawdzisz bez konta. Profil przyda się, gdy chcesz
            zapisać preferencje, historię i ulubione przepisy.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/try"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-6 py-3 text-sm font-semibold leading-none text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Zobacz pomysł na dziś
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-elevated px-6 py-3 text-sm font-semibold leading-none text-accent shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Załóż profil
            </Link>
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-muted lg:mx-0">
            Pierwsza generacja bez konta. Profil zapisze preferencje i historię.
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(194,87,40,0.18),rgba(90,138,74,0.10)_42%,transparent_68%)] blur-3xl"
          />

          <div className="relative rounded-[1.8rem] border border-border-strong bg-bg-elevated/85 p-4 shadow-[0_32px_80px_-52px_rgba(58,40,24,0.9)] backdrop-blur sm:p-5">
            <div className="rounded-[1.1rem] border border-border bg-bg-sunken/70 p-4">
              <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Start bez ciężaru
              </p>
              <h3 className="mt-2 font-brand text-2xl font-semibold leading-tight text-ink">
                <span className="block">Nie musisz planować całego tygodnia.</span>
                <span className="block text-accent">Wystarczy dzisiejszy obiad.</span>
              </h3>
              <div className="mt-5 space-y-2">
                {finalCtaPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[0.85rem] bg-bg-elevated px-3 py-2.5 text-sm"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-basil"
                      aria-hidden="true"
                    />
                    <span className="font-semibold leading-6 text-ink">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.1rem] border border-accent/25 bg-accent-soft px-4 py-3">
              <p className="font-brand text-sm font-semibold leading-6 text-accent-deep">
                Dobry pomysł jest gotowy do startu, gdy Ty jesteś.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
