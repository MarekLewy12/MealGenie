import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { token, logout, user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const homeLink = token ? "/dashboard" : "/";
  const homeLabel = token ? "Dashboard" : "Strona główna";
  const logoutTitle = user?.name ? `Wyloguj ${user.name}` : "Wyloguj";

  const linkBaseClasses =
    "cursor-pointer text-sm font-semibold uppercase tracking-wide transition-colors duration-200";
  const desktopLinkClasses = `${linkBaseClasses} hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200`;
  const mobileLinkClasses =
    "block w-full cursor-pointer border-b border-slate-100 p-4 text-lg font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800/50";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#0c0f1d]/80">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <Link to={homeLink} className="group flex items-center gap-3" onClick={closeMenu}>
          <img
            src="/logo-genie.png"
            alt="MealGenie"
            className="h-9 w-9 rounded-xl bg-white p-1 shadow-md shadow-indigo-200/40 transition group-hover:scale-105 dark:bg-white/5 dark:shadow-indigo-900/40"
          />
          <div className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-slate-900 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent transition group-hover:drop-shadow-[0_6px_25px_rgba(99,102,241,0.25)] dark:from-white dark:to-indigo-200">
              MealGenie
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to={homeLink} className={desktopLinkClasses}>
            {homeLabel}
          </Link>

          {token && (
            <>
              <Link to="/settings" className={desktopLinkClasses}>
                Ustawienia
              </Link>
              <Link to="/generator" className={desktopLinkClasses}>
                Generator
              </Link>
            </>
          )}

          {!token ? (
            <Link to="/login" className={desktopLinkClasses}>
              Logowanie
            </Link>
          ) : (
            <button onClick={logout} className={desktopLinkClasses} title={logoutTitle}>
              Wyloguj
            </button>
          )}

          <div className="ml-2 border-l border-slate-200/60 pl-4 dark:border-white/10">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
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
            className="overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-[#0c0f1d]/95"
          >
            <nav className="flex flex-col p-4">
              <Link to={homeLink} className={mobileLinkClasses} onClick={closeMenu}>
                {homeLabel}
              </Link>

              {token && (
                <>
                  <Link to="/settings" className={mobileLinkClasses} onClick={closeMenu}>
                    Ustawienia
                  </Link>
                  <Link to="/generator" className={mobileLinkClasses} onClick={closeMenu}>
                    Generator
                  </Link>
                </>
              )}

              {!token ? (
                <Link to="/login" className={mobileLinkClasses} onClick={closeMenu}>
                  Logowanie
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className={`${mobileLinkClasses} text-left text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}
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
