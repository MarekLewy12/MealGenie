import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "../utils/cn";

type DashboardBackLinkProps = {
  className?: string;
};

export function DashboardBackLink({ className }: DashboardBackLinkProps) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-3 py-2.5 text-sm font-semibold leading-none text-ink-soft transition duration-fast ease-out",
        "hover:bg-accent-soft hover:text-ink active:bg-bg-sunken",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
        className,
      )}
      aria-label="Wróć do Dashboard"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Wróć do Dashboard</span>
    </Link>
  );
}
