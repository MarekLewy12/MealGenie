import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { GeneratorPage } from "./pages/GeneratorPage";
import { GuestGeneratorPage } from "./pages/GuestGeneratorPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MobilePage } from "./pages/MobilePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { RecipePage } from "./pages/RecipePage";
import { SharedRecipePage } from "./pages/SharedRecipePage";
import { SettingsPage } from "./pages/SettingsPage";
import { RecipesPage } from "./pages/RecipesPage";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Header } from "./components/Header";
import { PageTransition } from "./components/PageTransition";
import { useAuthStore } from "./store/authStore";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";
import { NotificationContainer } from "./components/NotificationContainer";

function App() {
  const token = useAuthStore((state) => state.token);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);
  const location = useLocation();
  const isSharedPage = location.pathname.startsWith("/shared");

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-bg text-ink transition-colors duration-base ease-in-out">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast ease-out focus:translate-y-0"
      >
        Przejdź do treści
      </a>
      <NotificationContainer />
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_18%_12%,rgba(194,87,40,0.08),transparent_38%),radial-gradient(ellipse_at_88%_8%,rgba(212,160,23,0.08),transparent_34%)] dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,138,74,0.025),transparent_48%),radial-gradient(ellipse_at_80%_0%,rgba(139,194,122,0.018),transparent_34%)]">
        <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(var(--border)_0.75px,transparent_0.75px)] [background-size:18px_18px] dark:opacity-0" />
      </div>

      <div className="relative z-10">
        {!isSharedPage && <Header />}

        <div>
          <main id="main-content" className="relative" tabIndex={-1}>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      {hasCompletedOnboarding ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <HomePage />
                      )}
                    </PageTransition>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PageTransition>
                      <LoginPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/try"
                  element={
                    <PageTransition>
                      {token ? (
                        hasCompletedOnboarding ? (
                          <Navigate to="/generator" replace />
                        ) : (
                          <Navigate to="/onboarding" replace />
                        )
                      ) : (
                        <GuestGeneratorPage />
                      )}
                    </PageTransition>
                  }
                />
                <Route
                  path="/mobile"
                  element={
                    <PageTransition>
                      <MobilePage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/shared/:shareId"
                  element={
                    <PageTransition>
                      <SharedRecipePage />
                    </PageTransition>
                  }
                />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AuthenticatedLayout />}>
                    {/* Chronione trasy */}
                    <Route
                      path="/dashboard"
                      element={
                        <PageTransition>
                          <DashboardPage />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/onboarding"
                      element={
                        <PageTransition>
                          {hasCompletedOnboarding ? (
                            <Navigate to="/settings" replace />
                          ) : (
                            <OnboardingPage />
                          )}
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <PageTransition>
                          <SettingsPage />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/recipes"
                      element={
                        <PageTransition>
                          <RecipesPage />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/generator"
                      element={
                        <PageTransition>
                          <GeneratorPage />
                        </PageTransition>
                      }
                    />
                    {/* /recipe/:id przed /recipe. */}
                    <Route
                      path="/recipe/:id"
                      element={
                        <PageTransition>
                          <RecipePage />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/recipe"
                      element={
                        <PageTransition>
                          <RecipePage />
                        </PageTransition>
                      }
                    />
                  </Route>
                </Route>

                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <Navigate to="/" replace />
                    </PageTransition>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
