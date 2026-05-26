import { Link } from "react-router-dom";

import { Logo } from "../components/Logo";
import {
  LandingAgentCanvasSection,
  LandingFinalCtaSection,
  LandingHeroSection,
  LandingMarqueeStrip,
  LandingProblemSolutionSection,
  LandingShowcaseSection,
  LandingTrustSection,
} from "../components/home/landing";

const footerLinks = [
  { label: "Wypróbuj", to: "/try" },
  { label: "Zaloguj się", to: "/login" },
  { label: "Aplikacja mobilna", to: "/mobile" },
];

export function HomePage() {
  return (
    <div className="relative isolate overflow-x-hidden bg-bg text-ink">
      <LandingHeroSection />

      <LandingMarqueeStrip />
      <LandingProblemSolutionSection />

      <LandingAgentCanvasSection />

      <LandingShowcaseSection />

      <LandingTrustSection />

      <LandingFinalCtaSection />

      <footer className="border-t border-border bg-bg-sunken pb-8 pt-6 text-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Domowy asystent kulinarny dla codziennych decyzji, przepisów i
              spokojniejszego gotowania.
            </p>
          </div>

          <nav
            aria-label="Linki stopki"
            className="flex flex-wrap justify-center gap-2 lg:justify-end"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-bg-elevated px-4 py-2 text-sm font-semibold text-ink-soft shadow-xs transition duration-fast ease-out hover:border-accent/40 hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
