import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
import {
  slideVariants,
  viewVariants,
  wizardStepLayoutTransition,
} from "./wizardMotion";
import { useMealGeneratorState } from "./useMealGeneratorState";
import { useWizardNavigation } from "./useWizardNavigation";

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
    isLastStep,
    canGoBack,
    goToNextStep,
    goToPrevStep,
    jumpToDisplayedStep,
  } = useWizardNavigation({ isGuestMode });

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
          />
        );
      case 2:
        return (
          <Step2Time
            prepTime={generator.prepTime}
            onPrepTimeChange={generatorActions.setPrepTime}
            isGuestMode={isGuestMode}
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
          />
        );
      case 4:
        return (
          <Step4MealType
            mealType={generator.mealType}
            onMealTypeChange={generatorActions.setMealType}
            isGuestMode={isGuestMode}
          />
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------
  // Keyboard shortcuts - Cmd/Ctrl+Enter = generuj natychmiast
  // -------------------------------------------------------
  useEffect(() => {
    if (view !== "form") return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleGenerate, view]);

  // -------------------------------------------------------
  // Scroll przy zmianie kroku - bez ruszania scrolla przy edycji pól
  // -------------------------------------------------------
  useEffect(() => {
    if (view !== "form") return;

    if (!hasMountedStepCardRef.current) {
      hasMountedStepCardRef.current = true;
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      stepCardRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion, step, view]);

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
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <WizardHeader isGuestMode={isGuestMode} totalSteps={totalSteps} />

            <div className="mx-auto max-w-[1760px] px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-8">
              <div className="grid min-w-0 gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
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
                    layout={!prefersReducedMotion}
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : wizardStepLayoutTransition
                    }
                    className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-bg-elevated p-6 shadow-md sm:p-8 lg:p-10"
                  >
                    <AnimatePresence
                      mode={prefersReducedMotion ? "wait" : "popLayout"}
                      custom={direction}
                      initial={false}
                    >
                      <motion.div
                        key={step}
                        layout={!prefersReducedMotion}
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
                    isGuestMode={isGuestMode}
                    onBack={goToPrevStep}
                    onSkip={goToNextStep}
                    onNext={goToNextStep}
                    onGenerate={handleGenerate}
                  />
                </div>

                {/* Prawa: sticky preview (desktop) / collapsible bottomsheet (mobile) */}
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
                      <span className="font-brand text-sm font-semibold text-ink">
                        Twój przepis
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-ink-soft transition-transform ${
                          isPreviewExpandedMobile ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isPreviewExpandedMobile && (
                      <div id="wizard-preview-mobile" className="mt-3">
                        <WizardPreviewPanel
                          step={displayStep}
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
                      step={displayStep}
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
          <div
            key="wizard-success"
            className="mx-auto max-w-[1760px] px-4 py-12 sm:px-6 lg:px-8"
          >
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
  totalSteps,
}: {
  isGuestMode: boolean;
  totalSteps: number;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Dekoracyjne gradienty w tle - jak DashboardHeader */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron-soft/30 via-transparent to-accent-soft/15 dark:from-saffron/6 dark:via-transparent dark:to-accent/4" />
        <div className="absolute -left-[10%] -top-[40%] h-[20rem] w-[20rem] rounded-full bg-saffron/20 blur-[100px] dark:bg-saffron/8" />
        <div className="absolute -right-[5%] top-[20%] h-[16rem] w-[16rem] rounded-full bg-accent/15 blur-[80px] dark:bg-accent/6" />
      </div>

      <div className="relative mx-auto max-w-[1760px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-brand text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-ink-muted">
              {isGuestMode ? "Podgląd generatora" : "Generator posiłków"}
            </p>
            <h1 className="font-serif text-3xl font-medium leading-[1.05] text-ink sm:text-4xl lg:text-[2.75rem]">
              Zaprojektuj{" "}
              <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
                swój przepis
              </span>
              <span className="text-ink-soft"> w {totalSteps} krokach.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              {isGuestMode
                ? "Wersja pokazowa: 3 darmowe propozycje. Każdy wybór buduje podsumowanie po prawej."
                : "Każdy wybór buduje podsumowanie po prawej. Możesz pomijać kroki - sensowne wartości domyślne są już ustawione."}
            </p>
          </div>

          {!isGuestMode && (
            <Link
              to="/settings"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-pill border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold leading-none text-accent shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent lg:self-end"
            >
              Edytuj preferencje
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
