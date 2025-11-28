import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { GeneratorPage } from "./pages/GeneratorPage";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#05030f] dark:text-slate-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-indigo-200/40 blur-[120px] dark:bg-indigo-500/15" />
          <div className="absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-[140px] dark:bg-fuchsia-500/12" />
          <div className="absolute bottom-[-12%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/30 blur-[140px] dark:bg-blue-500/10" />
        </div>

        <div className="relative z-10">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition dark:border-white/10 dark:bg-[#0c0f1d]/80">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
              <Link to="/" className="group flex items-center gap-3 text-slate-900 dark:text-white">
                <img
                  src="/logo-genie.png"
                  alt="MealGenie"
                  className="h-10 w-10 rounded-xl bg-white p-1 shadow-lg shadow-indigo-200/40 transition group-hover:scale-105 dark:bg-white/5 dark:shadow-indigo-900/40"
                />
                <div className="flex flex-col leading-none">
                  <span className="bg-gradient-to-r from-slate-900 to-indigo-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent transition group-hover:drop-shadow-[0_6px_25px_rgba(99,102,241,0.25)] dark:from-white dark:to-indigo-200">
                    MealGenie
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700/70 dark:text-indigo-200/70">
                    by Marek Lewandowski
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900 dark:text-indigo-100 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Strona główna
                </Link>
                <Link
                  to="/onboarding"
                  className="rounded-lg px-3 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900 dark:text-indigo-100 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Onboarding
                </Link>
                <Link
                  to="/generator"
                  className="rounded-lg px-3 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900 dark:text-indigo-100 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Generator
                </Link>
                <div className="ml-2 border-l border-slate-200/60 pl-3 dark:border-white/10">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
