import { Link } from "react-router-dom";

import { Logo } from "../components/Logo";
import {
  LandingBenefitsSection,
  LandingFinalCtaSection,
  LandingHeroSection,
  LandingHowItWorksSection,
  LandingPainReliefSection,
  LandingProductShowcaseSection,
  LandingSolutionSection,
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

      <LandingPainReliefSection />
      <LandingSolutionSection />
      <LandingHowItWorksSection />
      <LandingBenefitsSection />

      <LandingProductShowcaseSection />
      <LandingTrustSection />

      <LandingFinalCtaSection />

      <footer className="bg-bg pb-8 pt-4 text-ink">
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
            className="flex flex-wrap gap-2 lg:justify-end"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-fast hover:bg-bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
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
