import { cn } from "../../../utils/cn";

type LandingSectionDividerProps = {
  variant?: "warm" | "basil" | "quiet";
};

const dividerLineClassName: Record<
  NonNullable<LandingSectionDividerProps["variant"]>,
  string
> = {
  warm: "via-accent/50 dark:via-accent/40",
  basil: "via-basil/48 dark:via-basil/36",
  quiet: "via-border-strong dark:via-white/18",
};

const dividerGlowClassName: Record<
  NonNullable<LandingSectionDividerProps["variant"]>,
  string
> = {
  warm: "via-accent/18 dark:via-accent/14",
  basil: "via-basil/18 dark:via-basil/12",
  quiet: "via-ink/8 dark:via-white/8",
};

const dividerWashClassName: Record<
  NonNullable<LandingSectionDividerProps["variant"]>,
  string
> = {
  warm:
    "bg-[radial-gradient(ellipse_at_center,rgba(194,87,40,0.075),transparent_58%),linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_50%,var(--bg)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(232,138,74,0.055),transparent_58%),linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_50%,var(--bg)_100%)]",
  basil:
    "bg-[radial-gradient(ellipse_at_center,rgba(90,138,74,0.075),transparent_58%),linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_50%,var(--bg)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(139,194,122,0.05),transparent_58%),linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_50%,var(--bg)_100%)]",
  quiet:
    "bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg-sunken)_50%,var(--bg)_100%)]",
};

export function LandingSectionDivider({
  variant = "quiet",
}: LandingSectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative z-10 h-16 overflow-hidden",
        dividerWashClassName[variant],
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-3 w-[min(56rem,90vw)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent blur-md",
          dividerGlowClassName[variant],
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-px w-[min(54rem,88vw)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent",
          dividerLineClassName[variant],
        )}
      />
      <div className="absolute left-1/2 top-1/2 h-px w-[min(18rem,38vw)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-bg-elevated/80 to-transparent dark:via-white/16" />
    </div>
  );
}
