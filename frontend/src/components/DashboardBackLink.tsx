import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type DashboardBackLinkProps = {
  className?: string;
};

export function DashboardBackLink({ className }: DashboardBackLinkProps) {
  return (
    <Link
      to="/dashboard"
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:bg-slate-900 sm:gap-2 sm:px-3 sm:text-sm"
      }
      aria-label="Wróć do Dashboard"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Wróć do Dashboard</span>
    </Link>
  );
}
