import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  PenLine,
  Refrigerator,
  RefreshCw,
  Sparkles,
  Scale,
  Timer,
  Hourglass,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  generateMealSuggestions,
  guestGenerateMealSuggestions,
} from "../services/api";
import { LoadingExperience } from "./LoadingExperience";
import { MealCard } from "./MealCard";
import { TagInput } from "./TagInput";
import {
  Button,
  Card,
  Eyebrow,
  FolkDivider,
  HandwrittenKicker,
  Switch,
  Textarea,
} from "./ui";
import type { MealSuggestion, MealType, PortionMode } from "../types/meal";
import { notify } from "../store/notificationStore";

const mealTypeOptions: Array<{
  value: MealType;
  label: string;
  hint: string;
  emoji: string;
}> = [
  {
    value: "BREAKFAST",
    label: "Śniadanie",
    hint: "lekko i szybko",
    emoji: "☕",
  },
  {
    value: "LUNCH",
    label: "Lunch/Obiad",
    hint: "mocno i treściwie",
    emoji: "🍲",
  },
  {
    value: "DINNER",
    label: "Kolacja",
    hint: "wieczorne inspiracje",
    emoji: "🥗",
  },
  {
    value: "SNACK",
    label: "Przekąska",
    hint: "małe co nieco",
    emoji: "🥪",
  },
  {
    value: "DESSERT",
    label: "Deser",
    hint: "słodkie inspiracje",
    emoji: "🍰",
  },
];

const mealTypeValues = new Set<MealType>(
  mealTypeOptions.map((option) => option.value),
);

const prepTimeOptions = [
  { value: 15, label: "15 min", hint: "na szybko", icon: Timer },
  { value: 30, label: "30 min", hint: "standardowo", icon: Clock3 },
  { value: 45, label: "45 min", hint: "spokojnie", icon: Hourglass },
  { value: 60, label: "60+ min", hint: "mam czas", icon: ChefHat },
];

type GeneratorView = "form" | "loading" | "success" | "error";
type MealGeneratorMode = "auth" | "guest";

type GuestLimitErrorResponse = {
  error?: string;
  message?: string;
  retryAfterSeconds?: number;
};

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const successIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

function LoadingSkeletons() {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated p-6 shadow-sm"
        >
          <div className="h-48 animate-pulse rounded-md bg-bg-sunken" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-bg-sunken" />
          <div className="h-4 w-full animate-pulse rounded bg-bg-sunken" />
        </motion.div>
      ))}
    </div>
  );
}

function formatRetryAfter(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${Math.max(1, Math.ceil(seconds / 60))} min`;
  }

  if (minutes === 0) {
    return `${hours} godz.`;
  }

  return `${hours} godz. ${minutes} min`;
}

type SuccessViewProps = {
  meals: MealSuggestion[];
  isGuestMode: boolean;
  onReset: () => void;
  onRegenerate: () => void;
  onGuestCta: () => void;
  onSelectMeal: (meal: MealSuggestion) => void;
};

function SuccessView({
  meals,
  isGuestMode,
  onReset,
  onRegenerate,
  onGuestCta,
  onSelectMeal,
}: SuccessViewProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <motion.div
          variants={successIconVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill border border-basil/30 bg-basil-soft text-basil shadow-sm"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-3"
        >
          <HandwrittenKicker>~ z Twojej lodówki ~</HandwrittenKicker>
          <h2 className="font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {isGuestMode
              ? "Gotowe! Oto darmowy podgląd"
              : `${meals.length} pomysły na dziś`}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-ink-soft">
            {isGuestMode
              ? "To wersja pokazowa bez personalizacji. Załóż konto, aby zapisać plan i przejść do pełnych przepisów."
              : "Szef kuchni skończył pracę. Oto propozycje dopasowane do Ciebie:"}
          </p>
          <FolkDivider className="mx-auto max-w-56 text-border-strong" />
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {meals.map((meal, index) => (
          <motion.div key={`${meal.name}-${index}`} variants={staggerItem}>
            <MealCard
              meal={meal}
              onSelect={() => onSelectMeal(meal)}
              showAction={!isGuestMode}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 pt-4"
      >
        {isGuestMode && (
          <Button
            onClick={onGuestCta}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="rounded-lg"
          >
            Załóż konto i gotuj dalej
          </Button>
        )}
        <Button
          onClick={onRegenerate}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="rounded-lg"
        >
          Generuj ponownie
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="rounded-lg"
        >
          {isGuestMode
            ? "Wróć i zmień parametry podglądu"
            : "Wróć do generatora i zmień parametry"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

type MealGeneratorProps = {
  mode?: MealGeneratorMode;
};

export function MealGenerator({ mode = "auth" }: MealGeneratorProps) {
  const isGuestMode = mode === "guest";
  const [mealType, setMealType] = useState<MealType>("LUNCH");
  const [prepTime, setPrepTime] = useState(30);
  const [servingSize, setServingSize] = useState(2);
  const [userPrompt, setUserPrompt] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isThermomixMode, setIsThermomixMode] = useState(false);
  const [view, setView] = useState<GeneratorView>("form");
  const [portionMode, setPortionMode] = useState<PortionMode>("servings");
  const [targetWeight, setTargetWeight] = useState(250);
  const [hungerLevel, setHungerLevel] = useState(3);
  const [guestRetryAfterSeconds, setGuestRetryAfterSeconds] = useState<
    number | null
  >(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate, data, error } = useMutation({
    mutationFn: () => {
      if (isGuestMode) {
        const normalizedGuestPrompt = userPrompt.trim();
        return guestGenerateMealSuggestions({
          mealType,
          prepTime,
          userPrompt:
            normalizedGuestPrompt.length > 0 ? normalizedGuestPrompt : undefined,
        });
      }

      return generateMealSuggestions({
        mealType,
        prepTime,
        servingSize: portionMode === "servings" ? servingSize : undefined,
        targetWeightGrams: portionMode === "weight" ? targetWeight : undefined,
        hungerLevel,
        userPrompt: userPrompt.length > 0 ? userPrompt : undefined,
        availableIngredients: ingredients,
        useEquipment: isThermomixMode ? ["THERMOMIX"] : [],
      });
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
        const responseData = err.response?.data as GuestLimitErrorResponse | undefined;
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

  const scrollToPageBottom = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleGenerate = () => {
    setGuestRetryAfterSeconds(null);
    setView("loading");
    scrollToPageBottom();
    mutate();
  };

  const handleRegenerate = () => {
    setGuestRetryAfterSeconds(null);
    setView("loading");
    scrollToPageBottom();
    mutate();
  };

  const handleBackToForm = () => {
    setGuestRetryAfterSeconds(null);
    setView("form");
  };

  const handleSelectMeal = (
    selectedMeal: MealSuggestion,
    allMeals: MealSuggestion[],
  ) => {
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
  };

  const handleGuestCta = () => {
    navigate("/login?mode=register");
  };

  useEffect(() => {
    const mealTypeParam = searchParams.get("mealType");
    const prepTimeParam = searchParams.get("prepTime");
    const servingSizeParam = searchParams.get("servingSize");

    if (mealTypeParam && mealTypeValues.has(mealTypeParam as MealType)) {
      setMealType(mealTypeParam as MealType);
    }
    if (prepTimeParam) {
      const parsedPrepTime = Number(prepTimeParam);
      if (Number.isFinite(parsedPrepTime)) {
        setPrepTime(Math.min(120, Math.max(15, parsedPrepTime)));
      }
    }
    if (servingSizeParam) {
      const parsedServingSize = Number(servingSizeParam);
      if (Number.isFinite(parsedServingSize)) {
        setServingSize(Math.min(10, Math.max(1, parsedServingSize)));
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full rounded-xl border border-border-strong bg-bg-elevated p-4 text-ink shadow-md sm:p-6 md:p-8">
      <AnimatePresence mode="wait">
        {view === "form" && (
          <motion.div
            key="generator-form"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="mb-8 max-w-3xl space-y-3">
              <Eyebrow>AI Kitchen</Eyebrow>
              <h2 className="font-brand text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                Kreator Posiłków
              </h2>
              <p className="text-sm leading-6 text-ink-soft">
                {isGuestMode
                  ? "Wersja pokazowa: wybierz typ posiłku i czas, a zobaczysz 3 propozycje bez personalizacji."
                  : "Opisz na co masz ochotę lub podaj składniki, a AI zrobi resztę."}
              </p>
            </div>

            <div className="space-y-5">
              <Card className="p-4 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-deep">
                    <PenLine className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <Eyebrow>1. Opis i składniki</Eyebrow>
                    <h3 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
                      Co ma trafić na talerz?
                    </h3>
                  </div>
                </div>

                <div className="grid gap-5">
                  <Textarea
                    label={
                      isGuestMode
                        ? "Czego szukasz? (opcjonalnie)"
                        : "Na co masz dzisiaj ochotę? (opcjonalnie)"
                    }
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder={
                      isGuestMode
                        ? "np. coś lekkiego, bez mięsa, kuchnia włoska..."
                        : "np. Coś lekkiego po treningu, mam ochotę na kuchnię azjatycką..."
                    }
                  />

                  {!isGuestMode && (
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <Refrigerator className="h-4 w-4 text-accent" aria-hidden="true" />
                        Składniki, które masz pod ręką
                      </div>
                      <TagInput
                        label="Dostępne składniki"
                        placeholder="np. kurczak, ryż, pomidory"
                        value={ingredients}
                        onChange={setIngredients}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-basil-soft text-basil">
                    <Clock3 className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <Eyebrow tone="basil">2. Czas i parametry</Eyebrow>
                    <h3 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
                      Dopasuj tempo gotowania
                    </h3>
                  </div>
                </div>

                <div
                  className={
                    isGuestMode
                      ? "grid gap-5"
                      : "grid gap-5 md:grid-cols-2 xl:grid-cols-4"
                  }
                >
                  <fieldset className="min-w-0">
                    <legend className="mb-2 text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink-muted">
                      Maks. czas
                    </legend>
                    <div
                      className={
                        isGuestMode
                          ? "grid grid-cols-2 gap-2 sm:grid-cols-4"
                          : "grid grid-cols-2 gap-2 xl:grid-cols-4"
                      }
                    >
                      {prepTimeOptions.map((option) => {
                        const isActive =
                          prepTime === option.value ||
                          (option.value === 60 && prepTime > 60);
                        const PrepTimeIcon = option.icon;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setPrepTime(option.value)}
                            className={`group relative inline-flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border px-3.5 py-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                              isActive
                                ? "border-accent bg-accent-soft text-ink shadow-accent ring-1 ring-accent/30"
                                : "border-border-strong bg-bg-elevated text-ink shadow-xs hover:-translate-y-0.5 hover:border-accent/70 hover:bg-bg hover:shadow-sm"
                            }`}
                          >
                            {isActive && (
                              <span
                                className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-pill bg-accent text-ink-inverse shadow-xs"
                                aria-hidden="true"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            )}
                            <span
                              className={`flex h-12 w-12 items-center justify-center rounded-md border transition ${
                                isActive
                                  ? "border-accent/30 bg-bg-elevated text-accent-deep"
                                  : "border-border bg-bg-sunken text-ink-soft group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:text-accent-deep"
                              }`}
                              aria-hidden="true"
                            >
                              <PrepTimeIcon className="h-5 w-5" />
                            </span>
                            <span className="font-brand text-base font-semibold leading-tight text-ink">
                              {option.label}
                            </span>
                            <span className="-mt-1 text-sm leading-5 text-ink-soft">
                              {option.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {!isGuestMode && (
                    <>
                      <fieldset className="min-w-0">
                        <legend className="mb-2 text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink-muted">
                          Tryb porcji
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-pressed={portionMode === "servings"}
                            onClick={() => setPortionMode("servings")}
                            className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                              portionMode === "servings"
                                ? "border-accent bg-accent text-ink-inverse shadow-accent"
                                : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
                            }`}
                          >
                            <Users className="h-4 w-4" aria-hidden="true" />
                            Osoby
                          </button>
                          <button
                            type="button"
                            aria-pressed={portionMode === "weight"}
                            onClick={() => setPortionMode("weight")}
                            className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                              portionMode === "weight"
                                ? "border-accent bg-accent text-ink-inverse shadow-accent"
                                : "border-border-strong bg-bg-elevated text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-ink"
                            }`}
                          >
                            <Scale className="h-4 w-4" aria-hidden="true" />
                            Gramy
                          </button>
                        </div>
                      </fieldset>

                      <div className="min-w-0">
                        {portionMode === "servings" ? (
                          <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink-muted">
                              Liczba osób: {servingSize}
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setServingSize((s) => Math.max(1, s - 1))}
                                className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-elevated text-lg font-semibold text-ink transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                aria-label="Zmniejsz liczbę osób"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-mono text-lg font-semibold text-ink">
                                {servingSize}
                              </span>
                              <button
                                type="button"
                                onClick={() => setServingSize((s) => Math.min(10, s + 1))}
                                className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-elevated text-lg font-semibold text-ink transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                aria-label="Zwiększ liczbę osób"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor="target-weight-input"
                              className="mb-2 block text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink-muted"
                            >
                              Docelowa waga
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                id="target-weight-input"
                                type="number"
                                min={50}
                                max={5000}
                                step={50}
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(Number(e.target.value))}
                                className="min-h-11 w-28 rounded-md border border-border bg-bg-elevated px-3 py-2 text-center font-mono font-semibold text-ink shadow-xs focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
                              />
                              <span className="text-sm font-semibold text-ink-soft">
                                gramów
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-ink-muted">
                              Idealne dla cukiernictwa i profesjonalnej gastronomii
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <label
                          htmlFor="hunger-level-range"
                          className="mb-2 block text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink-muted"
                        >
                          Poziom głodu
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-lg" title="Lekki posiłek">
                            😋
                          </span>
                          <input
                            id="hunger-level-range"
                            type="range"
                            min="1"
                            max="5"
                            value={hungerLevel}
                            onChange={(e) => setHungerLevel(Number(e.target.value))}
                            className="h-2 flex-1 cursor-pointer appearance-none rounded-pill bg-bg-sunken accent-accent"
                          />
                          <span className="text-lg" title="Uczta">
                            🍖
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-ink-muted">
                          <span>Lekko</span>
                          <span>Uczta</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-saffron-soft text-saffron">
                    <ChefHat className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <Eyebrow tone="saffron">3. Typ posiłku i generowanie</Eyebrow>
                    <h3 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
                      Wybierz kierunek
                    </h3>
                  </div>
                </div>

                {!isGuestMode && (
                  <div className="mb-6 rounded-lg border border-border bg-bg p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                            isThermomixMode
                              ? "bg-basil text-ink-inverse"
                              : "bg-bg-sunken text-ink-muted"
                          }`}
                        >
                          <ChefHat className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-ink">
                            Tryb Thermomix
                          </h4>
                          <p
                            id="thermomix-description"
                            className="text-xs leading-5 text-ink-soft"
                          >
                            AI przygotuje przepisy wykorzystujące robota.
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isThermomixMode}
                        onChange={setIsThermomixMode}
                        aria-label="Włącz lub wyłącz tryb Thermomix"
                        aria-describedby="thermomix-description"
                        className={isThermomixMode ? "bg-basil" : undefined}
                      />
                    </div>
                  </div>
                )}

                <fieldset className="mb-6">
                  <legend className="mb-3 text-sm font-semibold text-ink">
                    Typ posiłku (priorytet)
                  </legend>
                  <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-5">
                    {mealTypeOptions.map((option) => {
                      const isActive = option.value === mealType;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setMealType(option.value)}
                          className={`group relative flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border px-3.5 py-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                            isActive
                              ? "border-accent bg-accent-soft text-ink shadow-accent ring-1 ring-accent/30"
                              : "border-border-strong bg-bg-elevated text-ink shadow-xs hover:-translate-y-0.5 hover:border-accent/70 hover:bg-bg hover:shadow-sm"
                          }`}
                        >
                          {isActive && (
                            <span
                              className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-pill bg-accent text-ink-inverse shadow-xs"
                              aria-hidden="true"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-md border text-2xl transition ${
                              isActive
                                ? "border-accent/30 bg-bg-elevated text-accent-deep"
                                : "border-border bg-bg-sunken group-hover:border-accent/30 group-hover:bg-accent-soft"
                            }`}
                            aria-hidden="true"
                          >
                            {option.emoji}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-brand text-base font-semibold leading-tight text-ink">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-sm leading-5 text-ink-soft">
                              {option.hint}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <FolkDivider className="mb-5 text-border-strong" />

                <div className="flex flex-col items-center">
                  <Button
                    onClick={handleGenerate}
                    leftIcon={<Sparkles className="h-5 w-5" />}
                    className="w-full rounded-lg px-8 py-4 text-base shadow-accent hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(194,87,40,0.55)] active:translate-y-0 sm:w-auto"
                  >
                    {isGuestMode ? "Wypróbuj za darmo" : "Generuj posiłki"}
                  </Button>
                  <p className="mt-3 max-w-md text-center text-sm leading-6 text-ink-soft">
                    {isGuestMode
                      ? "Jedna darmowa próba bez konta. Potem przejdziesz do rejestracji."
                      : "Kliknij, a AI połączy Twoje składniki z preferencjami."}
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {view === "loading" && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LoadingExperience />
            <LoadingSkeletons />
          </motion.div>
        )}

        {view === "success" && data?.meals && (
          <SuccessView
            key="success"
            meals={data.meals}
            isGuestMode={isGuestMode}
            onReset={handleBackToForm}
            onRegenerate={handleRegenerate}
            onGuestCta={handleGuestCta}
            onSelectMeal={(meal) => handleSelectMeal(meal, data.meals)}
          />
        )}

        {view === "error" && (
          <motion.div
            key="error"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto max-w-2xl space-y-6 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill border border-bordeaux/20 bg-accent-soft text-bordeaux"
            >
              <XCircle className="h-10 w-10" />
            </motion.div>

            <div className="space-y-3">
              <Eyebrow tone="muted">Generator</Eyebrow>
              <h2 className="font-brand text-2xl font-semibold text-ink">
                {isGuestMode && guestRetryAfterSeconds !== null
                  ? "Darmowa próba jest już wykorzystana"
                  : "Ups! Coś poszło nie tak"}
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-6 text-ink-soft">
                {isGuestMode && guestRetryAfterSeconds !== null
                  ? `Spróbuj ponownie za około ${formatRetryAfter(guestRetryAfterSeconds)} albo załóż konto, aby generować bez limitu.`
                  : error instanceof Error
                    ? error.message
                    : "Nie udało się wygenerować posiłków."}
              </p>
            </div>

            {isGuestMode && guestRetryAfterSeconds !== null ? (
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={handleGuestCta}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="rounded-lg"
                >
                  Załóż konto
                </Button>
                <Button
                  onClick={handleBackToForm}
                  variant="secondary"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="rounded-lg"
                >
                  Wróć do formularza
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleBackToForm}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="rounded-lg"
              >
                Spróbuj ponownie
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
