import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageSquare, Smartphone, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { notify } from "../store/notificationStore";
import { useChatStore } from "../store/chatStore";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";

export function Header() {
  const { token, logout, user, hasCompletedOnboarding } = useAuthStore();
  const openGlobalChat = useChatStore((state) => state.openGlobalChat);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    logout();
    notify.info("Wylogowano pomyślnie.");
  };

  const homeLink = token
    ? hasCompletedOnboarding
      ? "/dashboard"
      : "/onboarding"
    : "/";
  const homeLabel = token
    ? hasCompletedOnboarding
      ? "Dashboard"
      : "Konfiguracja"
    : "Strona główna";
  const logoutTitle = user?.name ? `Wyloguj ${user.name}` : "Wyloguj";
  const mobileMenuId = "mobile-navigation";

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkBaseClasses =
    "cursor-pointer rounded-pill px-3 py-2 text-sm font-semibold text-ink-soft transition duration-fast ease-out hover:bg-accent-soft hover:text-accent";
  const mobileLinkClasses =
    "flex min-h-12 w-full cursor-pointer items-center justify-between rounded-md border border-transparent px-4 py-3 text-left text-base font-semibold text-ink transition duration-fast ease-out hover:border-border-strong hover:bg-accent-soft hover:text-accent";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-base ease-out",
        isScrolled
          ? "border-border-strong bg-bg-elevated/95 shadow-md"
          : "border-border bg-bg-elevated shadow-xs",
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-[4.5rem] max-w-screen-2xl items-center justify-between gap-2 px-3 py-3 xs:px-4 sm:gap-4 sm:px-6",
        )}
      >
        <Link
          to={homeLink}
          className="group shrink-0 rounded-md transition duration-fast ease-out hover:opacity-95"
          onClick={closeMenu}
          aria-label={`MealGenie - ${homeLabel}`}
        >
          <Logo
            variant="compact"
            className={cn(
              "transition duration-base ease-out group-hover:scale-[1.02] xs:hidden",
              isScrolled ? "scale-[0.94]" : "scale-100",
            )}
          />
          <Logo
            className={cn(
              "hidden transition duration-base ease-out group-hover:scale-[1.02] xs:inline-flex",
              isScrolled ? "scale-[0.94]" : "scale-100",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Główna nawigacja">
          <Link to={homeLink} className={linkBaseClasses}>
            {homeLabel}
          </Link>

          {token && hasCompletedOnboarding && (
            <>
              <Link to="/settings" className={linkBaseClasses}>
                Ustawienia
              </Link>
              <Link to="/generator" className={linkBaseClasses}>
                Generator
              </Link>
            </>
          )}

          {token && hasCompletedOnboarding && (
            <button
              onClick={openGlobalChat}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-basil bg-basil-soft px-4 py-2 text-sm font-semibold text-basil transition duration-fast ease-out hover:bg-bg-elevated"
              title="Asystent AI"
              type="button"
            >
              <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="hidden lg:inline">Asystent</span>
            </button>
          )}

          {!token && (
            <Link
              to="/mobile"
              className={cn(linkBaseClasses, "inline-flex items-center gap-2")}
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Mobile
              <span className="rounded-pill border border-saffron/35 bg-saffron-soft px-1.5 py-0.5 text-[0.6rem] font-bold uppercase leading-none tracking-[0.08em] text-ink">
                plan
              </span>
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/try" className={cn(linkBaseClasses, "text-accent")}>
                Wypróbuj
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-accent bg-accent px-5 py-2 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover"
              >
                Logowanie
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className={cn(linkBaseClasses, "text-accent hover:text-accent-deep")}
              title={logoutTitle}
              type="button"
            >
              Wyloguj
            </button>
          )}

          <div className="ml-2 border-l border-border pl-4">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-1.5 xs:gap-2 lg:hidden">
          {token && hasCompletedOnboarding && (
            <button
              onClick={openGlobalChat}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-basil bg-basil-soft p-2.5 text-basil transition duration-fast ease-out hover:bg-bg-elevated"
              aria-label="Asystent AI"
              type="button"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-bg-elevated p-2.5 text-ink-soft shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            type="button"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-bg-elevated shadow-md backdrop-blur-xl lg:hidden"
          >
            <nav id={mobileMenuId} className="flex flex-col gap-2 p-4" aria-label="Menu mobilne">
              <Link to={homeLink} className={mobileLinkClasses} onClick={closeMenu}>
                {homeLabel}
              </Link>

              {token && hasCompletedOnboarding && (
                <>
                  <Link to="/settings" className={mobileLinkClasses} onClick={closeMenu}>
                    Ustawienia
                  </Link>
                  <Link to="/generator" className={mobileLinkClasses} onClick={closeMenu}>
                    Generator
                  </Link>
                </>
              )}

              {!token && (
                <Link
                  to="/mobile"
                  className={cn(mobileLinkClasses, "gap-3")}
                  onClick={closeMenu}
                >
                  <Smartphone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">Aplikacja mobilna</span>
                  <span className="shrink-0 rounded-pill border border-saffron/35 bg-saffron-soft px-2 py-1 text-[0.65rem] font-bold uppercase leading-none tracking-[0.08em] text-ink">
                    w planach
                  </span>
                </Link>
              )}

              {!token ? (
                <>
                  <Link to="/try" className={mobileLinkClasses} onClick={closeMenu}>
                    Wypróbuj
                  </Link>
                  <Link
                    to="/login"
                    className={cn(
                      mobileLinkClasses,
                      "border-accent bg-accent text-ink-inverse hover:bg-accent-hover hover:text-ink-inverse",
                    )}
                    onClick={closeMenu}
                  >
                    Logowanie
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className={cn(
                    mobileLinkClasses,
                    "text-bordeaux hover:border-bordeaux hover:bg-bg-sunken hover:text-bordeaux",
                  )}
                  type="button"
                >
                  Wyloguj się
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
