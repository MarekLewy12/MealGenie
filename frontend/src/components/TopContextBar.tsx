import { Link } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";

type TopContextBarProps = {
  onOpenMobileNav: () => void;
};

function formatTopbarDate() {
  const formatted = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function TopContextBar({ onOpenMobileNav }: TopContextBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/86 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Otwórz menu aplikacji"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-border bg-bg-elevated text-ink-soft shadow-xs transition hover:border-accent/40 hover:bg-accent-soft hover:text-accent lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <p className="truncate font-brand text-sm font-semibold text-ink-muted">
            {formatTopbarDate()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/generator"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Nowy przepis</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
