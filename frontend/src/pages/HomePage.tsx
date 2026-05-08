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

      <footer className="border-t border-border bg-bg-elevated/85 text-ink backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              MealGenie pomaga rozwiązać codzienną decyzję: co dziś ugotować,
              żeby pasowało do czasu, preferencji i zwykłej kuchni.
            </p>
          </div>

          <nav aria-label="Linki stopki" className="flex min-w-0 flex-wrap gap-3 lg:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-11 items-center rounded-pill border border-border-strong bg-bg px-4 py-2 text-sm font-semibold text-ink-soft transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
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
