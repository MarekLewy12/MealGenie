import { Link } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function PublicHeader() {
  const token = useAuthStore((state) => state.token);
  const hasCompletedOnboarding = useAuthStore(
    (state) => state.hasCompletedOnboarding,
  );

  const appHref = hasCompletedOnboarding ? "/dashboard" : "/onboarding";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-elevated/88 shadow-xs backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="MealGenie - strona główna">
          <Logo className="origin-left scale-90" />
        </Link>

        <nav
          aria-label="Nawigacja publiczna"
          className="flex items-center gap-2 sm:gap-3"
        >
          {token ? (
            <Link
              to={appHref}
              aria-label="Przejdź do aplikacji"
              className="inline-flex min-h-11 items-center justify-center rounded-pill border border-accent/35 bg-accent-soft px-3 py-2 text-sm font-semibold text-accent-deep transition duration-fast hover:border-accent hover:bg-accent-soft/80 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:px-4"
            >
              <span className="sm:hidden">Aplikacja</span>
              <span className="hidden sm:inline">Przejdź do aplikacji</span>
            </Link>
          ) : (
            <>
              <Link
                to="/try"
                className="hidden min-h-11 items-center justify-center rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:inline-flex"
              >
                Wypróbuj
              </Link>

              <Link
                to="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-semibold text-ink-soft shadow-xs transition duration-fast hover:border-accent/50 hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Zaloguj
              </Link>
            </>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
