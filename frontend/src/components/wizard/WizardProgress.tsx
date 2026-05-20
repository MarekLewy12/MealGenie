import { cn } from "../../utils/cn";

// ============================================
// Progress dots - klikalne pigulki dla nawigacji wstecz
// ============================================

type WizardProgressProps = {
  current: number;
  total: number;
  maxReached: number;
  onJumpTo: (step: number) => void;
};

export function WizardProgress({
  current,
  total,
  maxReached,
  onJumpTo,
}: WizardProgressProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <ol
        className="flex items-center gap-2 sm:gap-3"
        aria-label={`Postęp: krok ${current} z ${total}`}
      >
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < current;
          const isActive = stepNumber === current;
          const canJump = stepNumber <= maxReached;

          return (
            <li key={stepNumber}>
              <button
                type="button"
                onClick={() => canJump && onJumpTo(stepNumber)}
                disabled={!canJump}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Krok ${stepNumber}${isCompleted ? " (ukończony)" : isActive ? " (aktywny)" : ""}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
                  isActive && "w-14 bg-accent shadow-[0_0_12px_-2px_rgba(232,111,69,0.45)]",
                  isCompleted && "w-10 bg-accent/60 hover:bg-accent",
                  !isActive && !isCompleted && "w-10 bg-bg-sunken",
                  canJump ? "cursor-pointer" : "cursor-default",
                )}
              />
            </li>
          );
        })}
      </ol>

      <p className="font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
        Krok {current} z {total}
      </p>
    </div>
  );
}
