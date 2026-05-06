import { cn } from "../utils/cn";

type LogoVariant = "compact" | "wordmark";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

export function Logo({ variant = "wordmark", className }: LogoProps) {
  const isCompact = variant === "compact";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-ink",
        isCompact ? "gap-0" : "",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className={cn(
          "h-11 w-11 shrink-0 overflow-visible drop-shadow-[0_8px_18px_rgba(58,40,24,0.12)]",
          "dark:drop-shadow-[0_0_20px_rgba(232,138,74,0.2)]",
        )}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="52"
          height="52"
          rx="14"
          fill="var(--bg-elevated)"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <ellipse cx="28" cy="20" rx="11" ry="9" fill="var(--accent)" />
        <ellipse cx="28" cy="20" rx="6.75" ry="5" fill="var(--accent-deep)" />
        <rect x="26" y="26" width="4" height="22" rx="2" fill="var(--accent)" />
        <path
          d="M18 44C24.4 48 31.6 48 38 44"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="14" cy="46" r="1.25" fill="var(--accent)" />
        <circle cx="42" cy="46" r="1.25" fill="var(--accent)" />
      </svg>

      {!isCompact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-['Outfit',var(--font-sans)] text-[1.58rem] font-bold leading-none tracking-[-0.018em] text-ink">
            Meal
            <em className="ml-0.5 font-medium not-italic text-accent">
              Genie
            </em>
          </span>
          <span className="mt-1 hidden font-script text-[1rem] font-semibold leading-none text-ink-muted xs:block">
            by Marek Lewandowski
          </span>
        </span>
      )}
    </span>
  );
}
