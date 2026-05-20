import { useCallback, useMemo, useState } from "react";

type UseWizardNavigationOptions = {
  isGuestMode: boolean;
};

export function useWizardNavigation({
  isGuestMode,
}: UseWizardNavigationOptions) {
  const totalSteps = isGuestMode ? 4 : 5;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  const displayStep = useMemo(() => {
    if (isGuestMode && step === 4) return 3;
    if (isGuestMode && step === 5) return 4;
    return step;
  }, [isGuestMode, step]);

  const maxReachedDisplayStep = useMemo(() => {
    if (!isGuestMode) return maxReachedStep;
    if (maxReachedStep === 4) return 3;
    if (maxReachedStep === 5) return 4;
    return maxReachedStep;
  }, [isGuestMode, maxReachedStep]);

  const goToNextStep = useCallback(() => {
    setDirection(1);
    setStep((current) => {
      if (isGuestMode && current === 2) {
        setMaxReachedStep((max) => Math.max(max, 4));
        return 4;
      }

      const next = Math.min(current + 1, 5);
      setMaxReachedStep((max) => Math.max(max, next));
      return next;
    });
  }, [isGuestMode]);

  const goToPrevStep = useCallback(() => {
    setDirection(-1);
    setStep((current) => {
      if (isGuestMode && current === 5) {
        return 4;
      }

      if (isGuestMode && current === 4) {
        return 2;
      }

      return Math.max(current - 1, 1);
    });
  }, [isGuestMode]);

  const jumpToStep = useCallback(
    (target: number) => {
      if (target > maxReachedStep) return;

      setDirection(target > step ? 1 : -1);
      setStep(target);
    },
    [maxReachedStep, step],
  );

  const jumpToDisplayedStep = useCallback(
    (displayedStep: number) => {
      let target = displayedStep;

      if (isGuestMode && displayedStep === 3) {
        target = 4;
      }

      if (isGuestMode && displayedStep === 4) {
        target = 5;
      }

      jumpToStep(target);
    },
    [isGuestMode, jumpToStep],
  );

  return {
    step,
    direction,
    displayStep,
    totalSteps,
    maxReachedDisplayStep,
    isOptionalStep: step === 1 || step === 3,
    isSummaryStep: step === 5,
    isBeforeSummaryStep: step === 4,
    isLastStep: step === 5,
    canGoBack: step > 1,
    goToNextStep,
    goToPrevStep,
    jumpToStep,
    jumpToDisplayedStep,
  };
}
