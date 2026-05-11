import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Droplets,
  Flame,
  Loader2,
  Microwave,
  Thermometer,
  Utensils,
  Wind,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { z } from "zod";

import { Button } from "./ui";
import { TagInput } from "./TagInput";
import { savePreferences, type SavePreferencesPayload } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { notify } from "../store/notificationStore";
import { Budget, CookingSkill, Diet, Equipment } from "../constants/enums";
import {
  BUDGET_LABELS,
  DIET_LABELS,
  EQUIPMENT_LABELS,
  SKILL_LABELS,
} from "../constants/translations";

const preferencesSchema = z.object({
  diet: z.nativeEnum(Diet),
  allergies: z.array(z.string()),
  favCuisines: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  cookingSkill: z.nativeEnum(CookingSkill),
  kitchenEquipment: z.array(z.nativeEnum(Equipment)),
  budget: z.nativeEnum(Budget),
  spiceLevel: z.number().int().min(1).max(5),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;
type EquipmentValue = PreferencesFormData["kitchenEquipment"][number];

type OnboardingFormProps = {
  initialValues?: Partial<SavePreferencesPayload>;
  isEditing?: boolean;
};

const selectStyles =
  "min-h-14 w-full rounded-xl border border-border bg-bg-sunken px-4 py-2.5 text-base text-ink shadow-xs outline-none transition duration-fast ease-out focus:border-accent focus:bg-bg-elevated focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:bg-bg-sunken disabled:text-ink-disabled";
const labelStyles = "mb-2 block text-sm font-semibold text-ink";
const inlineLabelStyles = "text-sm font-semibold text-ink";

const defaultValues: PreferencesFormData = {
  diet: Diet.NONE,
  allergies: [],
  favCuisines: [],
  dislikedIngredients: [],
  cookingSkill: CookingSkill.BEGINNER,
  kitchenEquipment: [],
  budget: Budget.MEDIUM,
  spiceLevel: 3,
};

const spiceLevelLabels: Record<number, string> = {
  1: "Łagodny",
  2: "Lekko pikantny",
  3: "Umiarkowany",
  4: "Pikantny",
  5: "Bardzo ostry",
};

const stepDetails = [
  {
    label: "Jak jesz?",
    emoji: "🍽️",
    title: "Zacznijmy od Twojego stylu jedzenia",
    description:
      "Dzięki temu MealGenie nie będzie proponować rzeczy, które od razu odpadają.",
  },
  {
    label: "Czego unikać?",
    emoji: "🥜",
    title: "Powiedz, czego lepiej nie dodawać",
    description:
      "Alergie, nietolerancje i składniki, których po prostu nie lubisz.",
  },
  {
    label: "Jak gotujesz?",
    emoji: "🍳",
    title: "Dopasujmy przepisy do Twojej kuchni",
    description:
      "Wybierz poziom i sprzęt, żeby przepisy były realne do zrobienia.",
  },
  {
    label: "Budżet i ostrość",
    emoji: "🌶️",
    title: "Ostatnie szlify",
    description:
      "Ustawimy koszt i poziom pikanterii, żeby propozycje były bliżej Twojego dnia.",
  },
  {
    label: "Podsumowanie",
    emoji: "✨",
    title: "Wszystko gotowe",
    description:
      "Sprawdź, czy wszystko się zgadza. Te preferencje będą bazą dla każdego planu.",
  },
] as const;

const WIZARD_STEP_COUNT = stepDetails.length;

const slideVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

type SectionOptions = {
  showHeading?: boolean;
};

function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: unknown,
): value is T[keyof T] {
  return (
    typeof value === "string" &&
    Object.values(enumObject).some((enumValue) => enumValue === value)
  );
}

function normalizePreferences(
  initialValues?: Partial<SavePreferencesPayload>,
): PreferencesFormData {
  if (!initialValues) {
    return defaultValues;
  }

  return {
    diet: isEnumValue(Diet, initialValues.diet)
      ? initialValues.diet
      : defaultValues.diet,
    allergies: Array.isArray(initialValues.allergies)
      ? initialValues.allergies
      : defaultValues.allergies,
    favCuisines: Array.isArray(initialValues.favCuisines)
      ? initialValues.favCuisines
      : defaultValues.favCuisines,
    dislikedIngredients: Array.isArray(initialValues.dislikedIngredients)
      ? initialValues.dislikedIngredients
      : defaultValues.dislikedIngredients,
    cookingSkill: isEnumValue(CookingSkill, initialValues.cookingSkill)
      ? initialValues.cookingSkill
      : defaultValues.cookingSkill,
    kitchenEquipment: Array.isArray(initialValues.kitchenEquipment)
      ? initialValues.kitchenEquipment.filter(
          (equipment): equipment is EquipmentValue =>
            isEnumValue(Equipment, equipment),
        )
      : defaultValues.kitchenEquipment,
    budget: isEnumValue(Budget, initialValues.budget)
      ? initialValues.budget
      : defaultValues.budget,
    spiceLevel:
      typeof initialValues.spiceLevel === "number" &&
      Number.isInteger(initialValues.spiceLevel) &&
      initialValues.spiceLevel >= 1 &&
      initialValues.spiceLevel <= 5
        ? initialValues.spiceLevel
        : defaultValues.spiceLevel,
  };
}

function getEquipmentIcon(label: string): LucideIcon {
  const normalizedLabel = label.toLowerCase();

  if (
    normalizedLabel.includes("piekarnik") ||
    normalizedLabel.includes("kuchenka") ||
    normalizedLabel.includes("grill")
  ) {
    return Flame;
  }

  if (normalizedLabel.includes("mikrof")) {
    return Microwave;
  }

  if (
    normalizedLabel.includes("frytkownica") ||
    normalizedLabel.includes("air")
  ) {
    return Wind;
  }

  if (normalizedLabel.includes("parowar")) {
    return Droplets;
  }

  if (normalizedLabel.includes("sous")) {
    return Thermometer;
  }

  if (
    normalizedLabel.includes("blender") ||
    normalizedLabel.includes("miks")
  ) {
    return Coffee;
  }

  return Utensils;
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) {
  const displayValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : "Brak"
    : value;

  return (
    <div className="flex flex-col gap-1.5 border-b border-border-dotted pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      <span className="font-medium leading-6 text-ink">{displayValue}</span>
    </div>
  );
}

export function OnboardingForm({
  initialValues,
  isEditing = false,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const updateOnboardingStatus = useAuthStore(
    (state) => state.updateOnboardingStatus,
  );
  const formDefaultValues = useMemo(
    () => normalizePreferences(initialValues),
    [initialValues],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: formDefaultValues,
  });

  const spiceLevel = watch("spiceLevel") ?? defaultValues.spiceLevel;

  useEffect(
    () => () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
    },
    [],
  );

  const onSubmit = async (values: PreferencesFormData) => {
    setErrorMsg(null);
    try {
      await savePreferences(values);
      if (isEditing) {
        notify.success("Zapisano zmiany!", "Sukces");
        navigationTimerRef.current = setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        updateOnboardingStatus(true);
        notify.success("Preferencje zapisane!", "Witaj");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg("Coś poszło nie tak przy zapisywaniu. Spróbuj ponownie.");
      notify.error(
        "Nie udało się zapisać preferencji. Spróbuj ponownie.",
        "Błąd zapisu",
      );
    }
  };

  const equipmentOptions: Array<{ value: EquipmentValue; label: string }> =
    Object.values(Equipment).map((equipment) => ({
      value: equipment,
      label: EQUIPMENT_LABELS[equipment],
    }));

  const nextStep = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setStep((currentStep) => Math.min(currentStep + 1, WIZARD_STEP_COUNT));
  };

  const prevStep = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const renderSection1 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Jak jesz?
        </h3>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyles}>Dieta</label>
          <select className={selectStyles} {...register("diet")}>
            {Object.values(Diet).map((value) => (
              <option key={value} value={value}>
                {DIET_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderSection2 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Czego unikać?
        </h3>
      ) : null}
      <Controller
        control={control}
        name="allergies"
        render={({ field }) => (
          <TagInput
            label="Alergie i nietolerancje"
            placeholder="np. orzechy, laktoza"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="dislikedIngredients"
          render={({ field }) => (
            <TagInput
              label="Nielubiane składniki"
              placeholder="np. brukselka"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="favCuisines"
          render={({ field }) => (
            <TagInput
              label="Ulubione kuchnie"
              placeholder="np. włoska, tajska"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );

  const renderSection3 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Jak gotujesz?
        </h3>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyles}>Poziom umiejętności</label>
          <select className={selectStyles} {...register("cookingSkill")}>
            {Object.values(CookingSkill).map((value) => (
              <option key={value} value={value}>
                {SKILL_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Controller
        control={control}
        name="kitchenEquipment"
        render={({ field }) => (
          <div className="space-y-3">
            <label className={labelStyles}>Twój sprzęt kuchenny</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {equipmentOptions.map((option) => {
                const isSelected = field.value.includes(option.value);
                const Icon = getEquipmentIcon(option.label);
                const nextValue = isSelected
                  ? field.value.filter((value) => value !== option.value)
                  : [...field.value, option.value];

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => field.onChange(nextValue)}
                    className={`group relative flex min-h-32 flex-col items-center justify-center gap-2.5 rounded-xl border p-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isSelected
                        ? "border-accent bg-accent-soft text-accent-deep shadow-xs dark:bg-accent/20 dark:text-accent"
                        : "border-border bg-bg-sunken text-ink-soft shadow-xs hover:border-border-strong hover:bg-bg-elevated hover:text-ink"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 transition-transform ${
                        isSelected ? "scale-110" : "group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold leading-5">
                      {option.label}
                    </span>
                    {isSelected ? (
                      <CheckCircle2
                        className="absolute right-2 top-2 h-4 w-4 text-accent"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />
    </div>
  );

  const renderSection4 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Budżet i ostrość
        </h3>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyles}>Budżet</label>
          <select className={selectStyles} {...register("budget")}>
            {Object.values(Budget).map((value) => (
              <option key={value} value={value}>
                {BUDGET_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label className={inlineLabelStyles}>Poziom ostrości</label>
            <span className="rounded-pill bg-bg-sunken px-2.5 py-1 text-xs font-bold text-ink-soft">
              {spiceLevelLabels[spiceLevel] ?? "Umiarkowany"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            {...register("spiceLevel", { valueAsNumber: true })}
            className="h-2 w-full cursor-pointer appearance-none rounded-pill bg-border accent-accent outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2"
          />
          <div className="flex justify-between px-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`h-1.5 w-1.5 rounded-pill transition-colors ${
                  spiceLevel >= level ? "bg-accent" : "bg-border-strong"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection5 = ({ showHeading = true }: SectionOptions = {}) => {
    const currentValues = watch();

    return (
      <div className="space-y-6">
        {showHeading ? (
          <h3 className="font-brand text-xl font-semibold text-ink">
            Podsumowanie
          </h3>
        ) : null}
        <div className="rounded-2xl border border-border bg-bg-sunken p-5 shadow-xs sm:p-6">
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <SummaryRow
              label="Dieta"
              value={DIET_LABELS[currentValues.diet] ?? "Brak"}
            />
            <SummaryRow
              label="Umiejętności"
              value={SKILL_LABELS[currentValues.cookingSkill] ?? "Brak"}
            />
            <SummaryRow
              label="Budżet"
              value={BUDGET_LABELS[currentValues.budget] ?? "Brak"}
            />
            <SummaryRow
              label="Ostrość"
              value={spiceLevelLabels[currentValues.spiceLevel] ?? "Brak"}
            />
            <SummaryRow label="Alergie" value={currentValues.allergies} />
            <SummaryRow
              label="Nielubiane"
              value={currentValues.dislikedIngredients}
            />
            <SummaryRow
              label="Ulubione kuchnie"
              value={currentValues.favCuisines}
            />
            <SummaryRow
              label="Sprzęt"
              value={currentValues.kitchenEquipment.map(
                (equipment) => EQUIPMENT_LABELS[equipment] ?? equipment,
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderSection1({ showHeading: false });
      case 2:
        return renderSection2({ showHeading: false });
      case 3:
        return renderSection3({ showHeading: false });
      case 4:
        return renderSection4({ showHeading: false });
      case 5:
        return renderSection5({ showHeading: false });
      default:
        return renderSection1({ showHeading: false });
    }
  };

  const currentStepDetails = stepDetails[step - 1];
  const isLastWizardStep = step === WIZARD_STEP_COUNT;

  return (
    <motion.form
      layout={!shouldReduceMotion}
      transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
      onSubmit={handleSubmit(onSubmit)}
      className={
        isEditing
          ? "space-y-10"
          : "relative overflow-hidden rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm sm:p-10"
      }
    >
      {isEditing ? (
        <>
          {renderSection1()}
          <div
            className="w-full border-t border-dotted border-border-dotted"
            aria-hidden="true"
          />
          {renderSection2()}
          <div
            className="w-full border-t border-dotted border-border-dotted"
            aria-hidden="true"
          />
          {renderSection3()}
          <div
            className="w-full border-t border-dotted border-border-dotted"
            aria-hidden="true"
          />
          {renderSection4()}
        </>
      ) : (
        <>
          <motion.div layout={!shouldReduceMotion} className="mb-8 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                Krok {step} z {WIZARD_STEP_COUNT}
              </p>
              <p className="text-sm font-semibold text-ink-soft">
                {currentStepDetails.label}
              </p>
            </div>
            <div
              className="flex gap-2"
              role="list"
              aria-label="Postęp konfiguracji profilu kulinarnego"
            >
              {stepDetails.map(({ label }, index) => {
                const stepNumber = index + 1;
                const isCurrent = stepNumber === step;
                const isComplete = stepNumber <= step;

                return (
                  <span
                    key={label}
                    role="listitem"
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`${label}: krok ${stepNumber} z ${WIZARD_STEP_COUNT}`}
                    className={`h-1.5 flex-1 rounded-pill transition-colors duration-300 ${
                      isComplete ? "bg-accent" : "bg-bg-sunken"
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-start gap-4 border-b border-dotted border-border-dotted pb-6">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-2xl shadow-xs"
                aria-hidden="true"
              >
                {currentStepDetails.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="font-brand text-2xl font-semibold leading-tight text-ink text-balance">
                  {currentStepDetails.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft text-pretty">
                  {currentStepDetails.description}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div layout={!shouldReduceMotion} className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={step}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout={!shouldReduceMotion}
                className="w-full"
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {errorMsg ? (
        <div
          className="mt-6 rounded-md border border-bordeaux/30 bg-accent-soft p-4 text-sm font-medium text-bordeaux"
          role="alert"
        >
          {errorMsg}
        </div>
      ) : null}

      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row sm:items-center ${
          isEditing ? "sm:justify-start" : "sm:justify-between"
        }`}
      >
        {!isEditing && step > 1 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="min-h-14 w-full sm:w-auto"
          >
            Wstecz
          </Button>
        ) : null}

        {!isEditing && !isLastWizardStep ? (
          <Button
            key="wizard-next"
            type="button"
            onClick={nextStep}
            className="min-h-14 w-full sm:ml-auto sm:w-auto sm:min-w-32"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Dalej
          </Button>
        ) : (
          <Button
            key="wizard-submit"
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className={`min-h-14 w-full sm:w-auto ${
              isEditing ? "" : "sm:ml-auto sm:min-w-40"
            }`}
            rightIcon={
              isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )
            }
          >
            {isEditing ? "Zapisz zmiany" : "Zapisz i zakończ"}
          </Button>
        )}
      </div>
    </motion.form>
  );
}
