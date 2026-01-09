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
        "inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900 cursor-pointer sm:px-4 sm:py-2.5"
      }
      aria-label="Wróć do Dashboard"
    >
      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      Wróć do Dashboard
    </Link>
  );
}
