import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeOption = "light" | "dark";

const STORAGE_KEY = "theme";

const getInitialTheme = (): ThemeOption => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border bg-bg-elevated p-2.5 text-ink-soft shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      aria-label={`Przełącz na motyw ${theme === "dark" ? "jasny" : "ciemny"}`}
      type="button"
      title={`Przełącz na motyw ${theme === "dark" ? "jasny" : "ciemny"}`}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
