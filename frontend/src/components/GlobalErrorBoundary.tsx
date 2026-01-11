import { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-[#020617] dark:text-white">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">
            Ups! Aplikacja napotkała błąd.
          </h1>
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            {this.state.error?.message || "Nieznany błąd krytyczny."}
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
          >
            <RefreshCw className="h-5 w-5" />
            Wyczyść dane i odśwież
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
