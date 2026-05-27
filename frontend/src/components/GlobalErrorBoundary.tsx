import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Logo } from "./Logo";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // TODO: Docelowo logowanie do zewnętrznego monitoringu błędów.
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-12 text-center text-ink sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(232,111,69,0.08),transparent_38%),radial-gradient(ellipse_at_82%_8%,rgba(47,138,95,0.07),transparent_34%)] dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,138,74,0.035),transparent_50%)]"
            aria-hidden="true"
          />

          <section className="relative w-full max-w-lg rounded-xl border border-border bg-bg-elevated p-6 shadow-lg sm:p-8">
            <Logo className="mx-auto origin-center scale-95" />

            <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-pill border border-bordeaux/25 bg-accent-soft text-bordeaux shadow-sm">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </div>

            <p className="mt-6 font-brand text-xs font-bold uppercase tracking-[0.16em] text-bordeaux">
              Błąd aplikacji
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-ink">
              Ups, coś zatrzymało MealGenie.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
              {this.state.error?.message || "Nieznany błąd krytyczny."}
            </p>

            <div className="mx-auto mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Odśwież stronę
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-ink-soft shadow-xs transition duration-fast ease-out hover:border-bordeaux/40 hover:bg-accent-soft hover:text-bordeaux focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Wyczyść dane lokalne
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
