import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { GeneratorPage } from "./pages/GeneratorPage";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-[#05030f] via-[#0b0f1d] to-[#07060f] text-slate-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-indigo-500/15 blur-[120px]" />
          <div className="absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-fuchsia-500/12 blur-[140px]" />
          <div className="absolute bottom-[-12%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c0f1d]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
              <Link
                to="/"
                className="group flex items-center gap-3 text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-sm font-bold shadow-lg shadow-indigo-900/40 transition group-hover:scale-105">
                  MG
                </div>
                <div>
                  <p className="text-sm font-semibold">MealGenie</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-200">
                    AI Kitchen
                  </p>
                </div>
              </Link>

              <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-indigo-100 transition hover:-translate-y-0.5 hover:bg-white/5 hover:text-white"
                >
                  Strona główna
                </Link>
                <Link
                  to="/onboarding"
                  className="rounded-lg px-3 py-2 text-indigo-100 transition hover:-translate-y-0.5 hover:bg-white/5 hover:text-white"
                >
                  Onboarding
                </Link>
                <Link
                  to="/generator"
                  className="rounded-lg px-3 py-2 text-indigo-100 transition hover:-translate-y-0.5 hover:bg-white/5 hover:text-white"
                >
                  Generator
                </Link>
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
