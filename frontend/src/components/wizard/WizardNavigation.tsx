import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

// ============================================
// Sticky bottom nav z buttonami Wstecz/Pomin/Dalej/Generuj
// ============================================

type WizardNavigationProps = {
  step: number;
  totalSteps: number;
  isOptional: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  isGuestMode: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  onGenerate: () => void;
};

export function WizardNavigation({
  step,
  totalSteps,
  isOptional,
  canGoBack,
  isLastStep,
  isGuestMode,
  onBack,
  onSkip,
  onNext,
  onGenerate,
}: WizardNavigationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-ink-soft shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:bg-bg-elevated disabled:hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Wstecz
      </button>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        {isOptional && !isLastStep && (
          <button
            type="button"
            onClick={onSkip}
            className="self-center text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink-soft hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Pomiń ten krok
          </button>
        )}

        {isLastStep ? (
          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-6 py-3 text-base font-semibold text-ink-inverse shadow-[var(--shadow-accent)] transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_18px_36px_-12px_rgba(232,111,69,0.4)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {isGuestMode ? "Wypróbuj za darmo" : "Generuj posiłki"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-6 py-2.5 text-sm font-semibold text-ink-inverse shadow-[0_0_18px_-6px_rgba(232,111,69,0.4)] transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            Dalej
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* sr-only kontekst krok N z M dla screen readerow */}
      <span className="sr-only">
        Krok {step} z {totalSteps}
      </span>
    </div>
  );
}
