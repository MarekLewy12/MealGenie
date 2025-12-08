import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { GeneratorPage } from "./pages/GeneratorPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Header } from "./components/Header";
import { useAuthStore } from "./store/authStore";

function App() {
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#05030f] dark:text-slate-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-indigo-200/40 blur-[120px] dark:bg-indigo-500/15" />
          <div className="absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-[140px] dark:bg-fuchsia-500/12" />
          <div className="absolute bottom-[-12%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/30 blur-[140px] dark:bg-blue-500/10" />
        </div>

        <div className="relative z-10">
          <Header />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  hasCompletedOnboarding ? <Navigate to="/dashboard" replace /> : <HomePage />
                }
              />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                {/* Chronione trasy */}
                <Route
                  path="/onboarding"
                  element={
                    hasCompletedOnboarding ? (
                      <Navigate to="/settings" replace />
                    ) : (
                      <OnboardingPage />
                    )
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/generator" element={<GeneratorPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
