import { cn } from "../../../utils/cn";

type LandingSectionDividerProps = {
  variant?: "warm" | "basil" | "quiet";
};

const dividerLineClassName: Record<
  NonNullable<LandingSectionDividerProps["variant"]>,
  string
> = {
  warm: "via-accent/30",
  basil: "via-basil/28",
  quiet: "via-border-strong/80 dark:via-white/12",
};

export function LandingSectionDivider({
  variant = "quiet",
}: LandingSectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-10 h-10 overflow-hidden bg-bg"
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-px w-[min(46rem,82vw)] -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent",
          dividerLineClassName[variant],
        )}
      />
    </div>
  );
}
