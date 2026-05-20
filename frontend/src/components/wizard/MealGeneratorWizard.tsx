import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AppPageHeader } from "../AppPageHeader";
import {
  generateMealSuggestions,
  guestGenerateMealSuggestions,
} from "../../services/api";
import type { MealSuggestion } from "../../types/meal";
import { notify } from "../../store/notificationStore";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { Step1Prompt } from "./steps/Step1Prompt";
import { Step2Time } from "./steps/Step2Time";
import { Step3Audience } from "./steps/Step3Audience";
import { Step4MealType } from "./steps/Step4MealType";
import { SuccessView } from "./SuccessView";
import { WizardNavigation } from "./WizardNavigation";
import { WizardPreviewPanel } from "./WizardPreviewPanel";
import { WizardProgress } from "./WizardProgress";
import { WizardSummaryCard } from "./WizardSummaryCard";
import { findMealTypeOption } from "./mealOptions";
import {
  slideVariants,
  viewVariants,
  wizardStepLayoutTransition,
} from "./wizardMotion";
import { useMealGeneratorState } from "./useMealGeneratorState";
import { useWizardNavigation } from "./useWizardNavigation";
import { cn } from "../../utils/cn";

// ============================================
// Typy
// ============================================

type GeneratorView = "form" | "loading" | "success" | "error";
type MealGeneratorMode = "auth" | "guest";

type GuestLimitErrorResponse = {
  error?: string;
  message?: string;
  retryAfterSeconds?: number;
};

type MealGeneratorWizardProps = {
  mode?: MealGeneratorMode;
};

const MOBILE_WIZARD_QUERY = "(max-width: 768px)";

function getIsMobileWizardViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(MOBILE_WIZARD_QUERY).matches;
}

function findScrollableParent(element: HTMLElement | null) {
  if (typeof window === "undefined") {
    return null;
  }

  let parent = element?.parentElement ?? null;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    const canScroll =
      /(auto|scroll|overlay)/.test(overflowY) &&
      parent.scrollHeight > parent.clientHeight;

    if (canScroll) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
}

// ============================================
// Glowny komponent wizarda - state, mutation, view state machine, shell
// ============================================

export function MealGeneratorWizard({
  mode = "auth",
}: MealGeneratorWizardProps) {
  const isGuestMode = mode === "guest";
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<GeneratorView>("form");
  const [guestRetryAfterSeconds, setGuestRetryAfterSeconds] = useState<
    number | null
  >(null);
  const [isPreviewExpandedMobile, setIsPreviewExpandedMobile] = useState(false);
  const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);
  const [isMobile, setIsMobile] = useState(getIsMobileWizardViewport);

  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const stepCardRef = useRef<HTMLDivElement | null>(null);
  const hasMountedStepCardRef = useRef(false);
  const {
    state: generator,
    actions: generatorActions,
    buildAuthPayload,
    buildGuestPayload,
  } = useMealGeneratorState(searchParams);
  const {
    step,
    direction,
    displayStep,
    totalSteps,
    maxReachedDisplayStep,
    isOptionalStep,
    isSummaryStep,
    isBeforeSummaryStep,
    isLastStep,
    canGoBack,
    goToNextStep,
    goToPrevStep,
    jumpToStep,
    jumpToDisplayedStep,
  } = useWizardNavigation({ isGuestMode });
  const mobileSummaryText = useMemo(() => {
    const parts: string[] = [];
    const mealOption = findMealTypeOption(generator.mealType);

    if (mealOption) {
      parts.push(`${mealOption.emoji} ${mealOption.label}`);
    }

    parts.push(`${generator.prepTime} min`);

    if (!isGuestMode) {
      parts.push(
        generator.portionMode === "servings"
          ? `${generator.servingSize} os.`
          : `${generator.targetWeight} g`,
      );
    }

    return parts.join(" • ");
  }, [
    generator.mealType,
    generator.portionMode,
    generator.prepTime,
    generator.servingSize,
    generator.targetWeight,
    isGuestMode,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const media = window.matchMedia(MOBILE_WIZARD_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  // -------------------------------------------------------
  // Mutation - 1:1 z MealGenerator
  // -------------------------------------------------------
  const { mutate, data, error } = useMutation({
    mutationFn: () => {
      if (isGuestMode) {
        return guestGenerateMealSuggestions(buildGuestPayload());
      }

      return generateMealSuggestions(buildAuthPayload());
    },
    onSuccess: () => {
      setGuestRetryAfterSeconds(null);
      notify.success(
        isGuestMode
          ? "Wygenerowano darmowy podgląd (3 propozycje)."
          : "Wygenerowano propozycje posiłków.",
      );
      setTimeout(() => setView("success"), 500);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | GuestLimitErrorResponse
          | undefined;
        const isGuestLimitReached =
          err.response?.status === 429 &&
          responseData?.error === "GUEST_LIMIT_REACHED";

        if (isGuestLimitReached) {
          const retryAfter =
            typeof responseData.retryAfterSeconds === "number"
              ? responseData.retryAfterSeconds
              : null;

          setGuestRetryAfterSeconds(retryAfter);
          notify.info(
            responseData.message ??
              "Wykorzystano darmową próbę. Załóż konto, aby generować dalej.",
            "Limit darmowej próby",
          );
          setView("error");
          return;
        }
      }

      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się wygenerować posiłków.",
        "Błąd generatora",
      );
      setView("error");
    },
  });

  // -------------------------------------------------------
  // Handlery generowania (1:1)
  // -------------------------------------------------------
  const handleGenerate = useCallback(() => {
    setGuestRetryAfterSeconds(null);
    setView("loading");
    mutate();
  }, [mutate]);

  const handleRegenerate = useCallback(() => {
    setGuestRetryAfterSeconds(null);
    setView("loading");
    mutate();
  }, [mutate]);

  const handleBackToForm = useCallback(() => {
    setGuestRetryAfterSeconds(null);
    setView("form");
  }, []);

  const handleEditSummaryStep = useCallback(
    (targetStep: number) => {
      setIsEditingFromSummary(true);
      jumpToStep(targetStep);
    },
    [jumpToStep],
  );

  const handleReturnToSummary = useCallback(() => {
    setIsEditingFromSummary(false);
    jumpToStep(5);
  }, [jumpToStep]);

  const handleSelectMeal = useCallback(
    (selectedMeal: MealSuggestion, allMeals: MealSuggestion[]) => {
      if (isGuestMode) {
        notify.info(
          "Aby wybrać danie i otworzyć pełny przepis, załóż konto.",
          "Wersja pokazowa",
        );
        navigate("/login?mode=register");
        return;
      }

      const unusedImageUrls = allMeals
        .filter((meal) => meal.imageUrl !== selectedMeal.imageUrl)
        .map((meal) => meal.imageUrl)
        .filter((url): url is string => Boolean(url));

      navigate("/recipe", {
        state: {
          teaser: selectedMeal,
          unusedImageUrls,
        },
      });
    },
    [isGuestMode, navigate],
  );

  const handleGuestCta = useCallback(() => {
    navigate("/login?mode=register");
  }, [navigate]);

  // -------------------------------------------------------
  // Render aktywnego kroku
  // -------------------------------------------------------
  const renderActiveStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Prompt
            userPrompt={generator.userPrompt}
            onUserPromptChange={generatorActions.setUserPrompt}
            ingredients={generator.ingredients}
            onIngredientsChange={generatorActions.setIngredients}
            isGuestMode={isGuestMode}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <Step2Time
            prepTime={generator.prepTime}
            onPrepTimeChange={generatorActions.setPrepTime}
            isGuestMode={isGuestMode}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <Step3Audience
            portionMode={generator.portionMode}
            onPortionModeChange={generatorActions.setPortionMode}
            servingSize={generator.servingSize}
            onServingSizeChange={generatorActions.setServingSize}
            targetWeight={generator.targetWeight}
            onTargetWeightChange={generatorActions.setTargetWeight}
            hungerLevel={generator.hungerLevel}
            onHungerLevelChange={generatorActions.setHungerLevel}
            isThermomixMode={generator.isThermomixMode}
            onThermomixToggle={generatorActions.setThermomixMode}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return (
          <Step4MealType
            mealType={generator.mealType}
            onMealTypeChange={generatorActions.setMealType}
            isGuestMode={isGuestMode}
            displayStep={displayStep}
            totalSteps={totalSteps}
          />
        );
      case 5:
        return (
          <WizardSummaryCard
            step={step}
            isGuestMode={isGuestMode}
            userPrompt={generator.userPrompt}
            ingredients={generator.ingredients}
            prepTime={generator.prepTime}
            portionMode={generator.portionMode}
            servingSize={generator.servingSize}
            targetWeight={generator.targetWeight}
            hungerLevel={generator.hungerLevel}
            isThermomixMode={generator.isThermomixMode}
            mealType={generator.mealType}
            variant="summary"
            onEditStep={handleEditSummaryStep}
          />
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------
  // Keyboard shortcuts - Cmd/Ctrl+Enter = nastepny krok / generuj
  // -------------------------------------------------------
  useEffect(() => {
    if (view !== "form") return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isSummaryStep) {
          handleGenerate();
          return;
        }

        goToNextStep();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [goToNextStep, handleGenerate, isSummaryStep, view]);

  // -------------------------------------------------------
  // Scroll przy zmianie kroku - dostosowany do urządzenia
  // -------------------------------------------------------
  useEffect(() => {
    if (view !== "form") return;

    if (!hasMountedStepCardRef.current) {
      hasMountedStepCardRef.current = true;
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      if (isMobile) {
        const scrollContainer = findScrollableParent(stepCardRef.current);
        const scrollOptions: ScrollToOptions = {
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        };

        if (scrollContainer) {
          scrollContainer.scrollTo(scrollOptions);
        } else {
          window.scrollTo(scrollOptions);
        }

        return;
      }

      stepCardRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isMobile, prefersReducedMotion, step, view]);

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <section className="relative min-h-full bg-bg text-ink">
      <AnimatePresence mode="wait">
        {view === "form" && (
          <motion.div
            key="wizard-form"
            variants={viewVariants}
            initial={false}
            animate="animate"
            exit={prefersReducedMotion ? undefined : "exit"}
          >
            <WizardHeader
              isGuestMode={isGuestMode}
              isSummaryStep={isSummaryStep}
              totalSteps={totalSteps}
            />

            <div className="mx-auto max-w-[1760px] px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-8">
              <div
                className={cn(
                  "grid min-w-0 gap-6 lg:gap-8",
                  isSummaryStep
                    ? "mx-auto max-w-5xl"
                    : "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]",
                )}
              >
                {/* Lewa: progress + krok + nawigacja */}
                <div className="min-w-0 space-y-8">
                  <WizardProgress
                    current={displayStep}
                    total={totalSteps}
                    maxReached={maxReachedDisplayStep}
                    onJumpTo={jumpToDisplayedStep}
                  />

                  <motion.div
                    ref={stepCardRef}
                    layout={isMobile ? false : !prefersReducedMotion}
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : wizardStepLayoutTransition
                    }
                    className={cn(
                      "relative scroll-mt-24 overflow-hidden rounded-2xl",
                      isSummaryStep
                        ? "bg-transparent"
                        : "border border-border bg-bg-elevated p-6 shadow-md sm:p-8 lg:p-10",
                    )}
                  >
                    <AnimatePresence
                      mode={
                        isMobile || prefersReducedMotion ? "wait" : "popLayout"
                      }
                      custom={direction}
                      initial={false}
                    >
                      <motion.div
                        key={step}
                        layout={isMobile ? false : !prefersReducedMotion}
                        custom={direction}
                        variants={slideVariants}
                        initial={prefersReducedMotion ? false : "hidden"}
                        animate="visible"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        className="w-full"
                      >
                        {renderActiveStep()}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  <WizardNavigation
                    step={displayStep}
                    totalSteps={totalSteps}
                    isOptional={isOptionalStep}
                    canGoBack={canGoBack}
                    isLastStep={isLastStep}
                    isBeforeSummaryStep={isBeforeSummaryStep}
                    isEditingFromSummary={
                      isEditingFromSummary && !isSummaryStep
                    }
                    isGuestMode={isGuestMode}
                    onBack={goToPrevStep}
                    onSkip={goToNextStep}
                    onNext={goToNextStep}
                    onReturnToSummary={handleReturnToSummary}
                    onGenerate={handleGenerate}
                  />
                </div>

                {/* Prawa: sticky preview (desktop) / collapsible bottomsheet (mobile) */}
                {!isSummaryStep && (
                  <aside className="lg:flex lg:flex-col lg:gap-6">
                    {/* Mobile: collapsible chip-summary */}
                    <div className="lg:hidden">
                      <button
                        type="button"
                        onClick={() =>
                          setIsPreviewExpandedMobile((open) => !open)
                        }
                        aria-expanded={isPreviewExpandedMobile}
                        aria-controls="wizard-preview-mobile"
                        className="flex w-full items-center justify-between rounded-xl border border-border bg-bg-elevated px-4 py-3 text-left shadow-xs transition hover:border-accent/40"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-brand text-sm font-semibold text-ink">
                            Twój przepis
                          </span>
                          {!isPreviewExpandedMobile && (
                            <p className="mt-0.5 truncate text-xs text-ink-soft">
                              {mobileSummaryText}
                            </p>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${
                            isPreviewExpandedMobile ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isPreviewExpandedMobile && (
                        <div id="wizard-preview-mobile" className="mt-3">
                          <WizardPreviewPanel
                            step={step}
                            isGuestMode={isGuestMode}
                            userPrompt={generator.userPrompt}
                            ingredients={generator.ingredients}
                            prepTime={generator.prepTime}
                            portionMode={generator.portionMode}
                            servingSize={generator.servingSize}
                            targetWeight={generator.targetWeight}
                            hungerLevel={generator.hungerLevel}
                            isThermomixMode={generator.isThermomixMode}
                            mealType={generator.mealType}
                          />
                        </div>
                      )}
                    </div>

                    {/* Desktop: sticky panel */}
                    <div className="hidden lg:sticky lg:top-24 lg:block">
                      <WizardPreviewPanel
                        step={step}
                        isGuestMode={isGuestMode}
                        userPrompt={generator.userPrompt}
                        ingredients={generator.ingredients}
                        prepTime={generator.prepTime}
                        portionMode={generator.portionMode}
                        servingSize={generator.servingSize}
                        targetWeight={generator.targetWeight}
                        hungerLevel={generator.hungerLevel}
                        isThermomixMode={generator.isThermomixMode}
                        mealType={generator.mealType}
                      />
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === "loading" && (
          <div
            key="wizard-loading"
            className="mx-auto max-w-[1760px] px-4 py-12 sm:px-6 lg:px-8"
          >
            <LoadingView />
          </div>
        )}

        {view === "success" && data?.meals && (
          <div key="wizard-success">
            <SuccessView
              meals={data.meals}
              isGuestMode={isGuestMode}
              onReset={handleBackToForm}
              onRegenerate={handleRegenerate}
              onGuestCta={handleGuestCta}
              onSelectMeal={(meal) => handleSelectMeal(meal, data.meals)}
            />
          </div>
        )}

        {view === "error" && (
          <div
            key="wizard-error"
            className="mx-auto max-w-[1760px] px-4 py-12 sm:px-6 lg:px-8"
          >
            <ErrorView
              isGuestMode={isGuestMode}
              guestRetryAfterSeconds={guestRetryAfterSeconds}
              errorMessage={
                error instanceof Error ? error.message : null
              }
              onBackToForm={handleBackToForm}
              onGuestCta={handleGuestCta}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================
// Naglowek wizarda - gradient bg + tytul + krotki opis
// ============================================

function WizardHeader({
  isGuestMode,
  isSummaryStep,
  totalSteps,
}: {
  isGuestMode: boolean;
  isSummaryStep: boolean;
  totalSteps: number;
}) {
  return (
    <AppPageHeader
      align={isSummaryStep ? "center" : "left"}
      eyebrow={
        <p className="font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
          {isSummaryStep
            ? "Ostatni krok"
            : isGuestMode
              ? "Podgląd generatora"
              : "Generator posiłków"}
        </p>
      }
      title={
        isSummaryStep ? (
          <>
            <span className="sm:hidden">
              Sprawdź{" "}
              <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
                wybory
              </span>
            </span>
            <span className="hidden sm:inline">
              Sprawdź{" "}
              <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
                swoje wybory
              </span>
              <span className="text-ink-soft"> przed generowaniem.</span>
            </span>
          </>
        ) : (
          <>
            <span className="sm:hidden">
              Zaprojektuj{" "}
              <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
                przepis
              </span>
            </span>
            <span className="hidden sm:inline">
              Zaprojektuj{" "}
              <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
                swój przepis
              </span>
              <span className="text-ink-soft"> w {totalSteps} krokach.</span>
            </span>
          </>
        )
      }
      description={
        isSummaryStep ? (
          <>
            <span className="sm:hidden">Sprawdź wybory i generuj.</span>
            <span className="hidden sm:inline">
              To jest finalna kontrola.
              <br />
              Możesz wrócić do pojedynczych ustawień albo wygenerować 3
              propozycje do wyboru.
            </span>
          </>
        ) : isGuestMode ? (
          <>
            <span className="sm:hidden">
              Wybierz parametry i zobacz darmowy podgląd.
            </span>
            <span className="hidden sm:inline">
              Wersja pokazowa: 3 darmowe propozycje. Każdy wybór buduje
              podsumowanie po prawej.
            </span>
          </>
        ) : (
          <>
            <span className="sm:hidden">
              Wybierz parametry, a MealGenie ułoży propozycje.
            </span>
            <span className="hidden sm:inline">
              Każdy wybór buduje podsumowanie po prawej. Możesz pomijać kroki -
              sensowne wartości domyślne są już ustawione.
            </span>
          </>
        )
      }
      action={
        !isGuestMode && !isSummaryStep ? (
          <Link
            to="/settings"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-md px-0 py-0 text-sm font-semibold leading-none text-accent transition duration-fast ease-out hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:rounded-pill sm:border sm:border-border-strong sm:bg-bg-elevated sm:px-5 sm:py-2.5 sm:shadow-xs sm:hover:border-accent sm:hover:bg-accent-soft lg:self-end"
          >
            Edytuj preferencje
          </Link>
        ) : null
      }
    />
  );
}
