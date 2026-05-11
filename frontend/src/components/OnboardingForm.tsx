import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  IconAward,
  IconBasket,
  IconBlender,
  IconBowl,
  IconBowlChopsticks,
  IconBreadOff,
  IconChefHat,
  IconClock,
  IconCoin,
  IconCooker,
  IconFlame,
  IconGauge,
  IconGrill,
  IconHeart,
  IconLeaf,
  IconListCheck,
  IconMeat,
  IconMicrowave,
  IconMoodSmile,
  IconPepper,
  IconPlant2,
  IconReceipt,
  IconSalad,
  IconSoup,
  IconSparkles,
  IconSteam,
  IconTemperature,
  IconToolsKitchen,
  IconToolsKitchen3,
  IconWind,
  type TablerIcon,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { z } from "zod";

import { Badge, Button } from "./ui";
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
type ChoiceTone = "accent" | "basil" | "saffron" | "neutral";
type ChoiceCardOption<TValue extends string> = {
  value: TValue;
  label: string;
  description: string;
  Icon: TablerIcon;
  tone?: ChoiceTone;
};
type EquipmentOption = {
  value: EquipmentValue;
  label: string;
  Icon: TablerIcon;
};
type EquipmentCategory = {
  id: string;
  title: string;
  options: EquipmentOption[];
};

type OnboardingFormProps = {
  initialValues?: Partial<SavePreferencesPayload>;
  isEditing?: boolean;
};

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

const choiceToneClasses: Record<
  ChoiceTone,
  {
    icon: string;
    selected: string;
  }
> = {
  accent: {
    icon: "bg-accent-soft text-accent-deep",
    selected: "border-accent bg-accent-soft text-accent-deep",
  },
  basil: {
    icon: "bg-basil-soft text-basil",
    selected: "border-basil bg-basil-soft text-basil",
  },
  saffron: {
    icon: "bg-saffron-soft text-saffron",
    selected: "border-saffron bg-saffron-soft text-saffron",
  },
  neutral: {
    icon: "bg-bg-sunken text-ink-soft",
    selected: "border-border-strong bg-bg-sunken text-ink",
  },
};

const dietOptions = [
  {
    value: Diet.NONE,
    label: DIET_LABELS.NONE,
    description: "Bez sztywnych zasad. MealGenie może proponować pełen zakres dań.",
    Icon: IconBowl,
    tone: "neutral",
  },
  {
    value: Diet.VEGETARIAN,
    label: DIET_LABELS.VEGETARIAN,
    description: "Dania bez mięsa, z nabiałem i jajkami, jeśli pasują do przepisu.",
    Icon: IconLeaf,
    tone: "basil",
  },
  {
    value: Diet.VEGAN,
    label: DIET_LABELS.VEGAN,
    description: "Wyłącznie roślinne propozycje, bez produktów odzwierzęcych.",
    Icon: IconPlant2,
    tone: "basil",
  },
  {
    value: Diet.KETO,
    label: DIET_LABELS.KETO,
    description: "Mniej węglowodanów, więcej tłuszczów i sycących składników.",
    Icon: IconMeat,
    tone: "accent",
  },
  {
    value: Diet.PALEO,
    label: DIET_LABELS.PALEO,
    description: "Proste składniki, mięso, warzywa, owoce i orzechy.",
    Icon: IconSalad,
    tone: "saffron",
  },
  {
    value: Diet.GLUTEN_FREE,
    label: DIET_LABELS.GLUTEN_FREE,
    description: "Pomijamy produkty z glutenem i szukamy naturalnych zamienników.",
    Icon: IconBreadOff,
    tone: "neutral",
  },
] satisfies ChoiceCardOption<(typeof Diet)[keyof typeof Diet]>[];

const skillOptions = [
  {
    value: CookingSkill.BEGINNER,
    label: SKILL_LABELS.BEGINNER,
    description: "Wolisz proste techniki, krótkie instrukcje i mało naczyń.",
    Icon: IconMoodSmile,
    tone: "basil",
  },
  {
    value: CookingSkill.INTERMEDIATE,
    label: SKILL_LABELS.INTERMEDIATE,
    description: "Gotujesz regularnie i chętnie łączysz kilka kroków naraz.",
    Icon: IconChefHat,
    tone: "accent",
  },
  {
    value: CookingSkill.ADVANCED,
    label: SKILL_LABELS.ADVANCED,
    description: "Możesz wejść w precyzyjne techniki i bardziej ambitne przepisy.",
    Icon: IconAward,
    tone: "saffron",
  },
] satisfies ChoiceCardOption<
  (typeof CookingSkill)[keyof typeof CookingSkill]
>[];

const budgetOptions = [
  {
    value: Budget.NONE,
    label: BUDGET_LABELS.NONE,
    description: "Priorytetem jest smak i dopasowanie, bez cięcia kosztów.",
    Icon: IconSparkles,
    tone: "neutral",
  },
  {
    value: Budget.ECONOMICAL,
    label: BUDGET_LABELS.ECONOMICAL,
    description: "Tanie, dostępne składniki i mniej produktów specjalnych.",
    Icon: IconCoin,
    tone: "basil",
  },
  {
    value: Budget.MEDIUM,
    label: BUDGET_LABELS.MEDIUM,
    description: "Rozsądny balans między ceną, wygodą i jakością.",
    Icon: IconBasket,
    tone: "accent",
  },
  {
    value: Budget.PREMIUM,
    label: BUDGET_LABELS.PREMIUM,
    description: "Możemy sięgać po ciekawsze składniki i bardziej dopracowane dania.",
    Icon: IconReceipt,
    tone: "saffron",
  },
] satisfies ChoiceCardOption<(typeof Budget)[keyof typeof Budget]>[];

const equipmentCategories = [
  {
    id: "basics",
    title: "Podstawy",
    options: [
      { value: Equipment.OVEN, label: EQUIPMENT_LABELS.OVEN, Icon: IconCooker },
      { value: Equipment.STOVE, label: EQUIPMENT_LABELS.STOVE, Icon: IconFlame },
      {
        value: Equipment.MICROWAVE,
        label: EQUIPMENT_LABELS.MICROWAVE,
        Icon: IconMicrowave,
      },
      {
        value: Equipment.BLENDER,
        label: EQUIPMENT_LABELS.BLENDER,
        Icon: IconBlender,
      },
    ],
  },
  {
    id: "automatic",
    title: "Urządzenia automatyczne",
    options: [
      {
        value: Equipment.MULTICOOKER,
        label: EQUIPMENT_LABELS.MULTICOOKER,
        Icon: IconSoup,
      },
      {
        value: Equipment.SLOW_COOKER,
        label: EQUIPMENT_LABELS.SLOW_COOKER,
        Icon: IconClock,
      },
      {
        value: Equipment.RICE_COOKER,
        label: EQUIPMENT_LABELS.RICE_COOKER,
        Icon: IconBowlChopsticks,
      },
      {
        value: Equipment.FOOD_PROCESSOR,
        label: EQUIPMENT_LABELS.FOOD_PROCESSOR,
        Icon: IconToolsKitchen3,
      },
    ],
  },
  {
    id: "special-techniques",
    title: "Techniki specjalne",
    options: [
      {
        value: Equipment.AIR_FRYER,
        label: EQUIPMENT_LABELS.AIR_FRYER,
        Icon: IconWind,
      },
      {
        value: Equipment.STEAMER,
        label: EQUIPMENT_LABELS.STEAMER,
        Icon: IconSteam,
      },
      {
        value: Equipment.SOUS_VIDE,
        label: EQUIPMENT_LABELS.SOUS_VIDE,
        Icon: IconTemperature,
      },
      {
        value: Equipment.ELECTRIC_GRILL,
        label: EQUIPMENT_LABELS.ELECTRIC_GRILL,
        Icon: IconGrill,
      },
    ],
  },
] satisfies EquipmentCategory[];

const stepDetails = [
  {
    label: "Jak jesz?",
    emoji: "🍽️",
    title: "Wybierz styl jedzenia",
    description:
      "To baza dla propozycji, które mają pasować do Twojego sposobu odżywiania.",
  },
  {
    label: "Czego unikać?",
    emoji: "🥜",
    title: "Powiedz, czego lepiej nie dodawać",
    description:
      "Alergie, nietolerancje i składniki, których po prostu nie lubisz.",
  },
  {
    label: "Umiejętności",
    emoji: "👩‍🍳",
    title: "Dopasujmy trudność przepisów",
    description:
      "MealGenie będzie dobierać tempo, techniki i poziom szczegółowości instrukcji.",
  },
  {
    label: "Sprzęt",
    emoji: "🍳",
    title: "Zaznacz, co masz pod ręką",
    description:
      "Dzięki temu przepisy będą realne do zrobienia w Twojej kuchni.",
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
type SectionHeaderAlign = "left" | "center";

function PreferenceSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  align?: SectionHeaderAlign;
}) {
  return (
    <div
      className={`max-w-2xl space-y-1.5 ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h4 className="font-brand text-xl font-semibold leading-tight text-ink">
        {title}
      </h4>
      <p className="text-sm leading-6 text-ink-soft">{description}</p>
    </div>
  );
}

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

function ChoiceCard<TValue extends string>({
  option,
  isSelected,
  onSelect,
}: {
  option: ChoiceCardOption<TValue>;
  isSelected: boolean;
  onSelect: (value: TValue) => void;
}) {
  const Icon = option.Icon;
  const tone = option.tone ?? "neutral";
  const toneClasses = choiceToneClasses[tone];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(option.value)}
      className={`group relative flex min-h-36 cursor-pointer flex-col items-start gap-3 rounded-xl border p-4 text-left shadow-xs transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isSelected
          ? `${toneClasses.selected} shadow-sm`
          : "border-border bg-bg-sunken text-ink-soft hover:border-border-strong hover:bg-bg-elevated hover:text-ink"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition duration-fast ease-out ${
          isSelected ? "bg-bg-elevated/75" : toneClasses.icon
        }`}
        aria-hidden="true"
      >
        <Icon
          className={`h-5 w-5 transition-transform ${
            isSelected ? "scale-110" : "group-hover:scale-110"
          }`}
        />
      </span>
      <span className="space-y-1.5">
        <span className="block text-base font-semibold leading-6 text-ink">
          {option.label}
        </span>
        <span className="block text-sm leading-6 text-ink-soft">
          {option.description}
        </span>
      </span>
      {isSelected ? (
        <CheckCircle2
          className="absolute right-3 top-3 h-4 w-4 text-accent"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

function ChoiceCardGroup<TValue extends string>({
  legend,
  description,
  eyebrow,
  headerAlign = "left",
  options,
  value,
  onChange,
  gridClassName = "grid-cols-1 sm:grid-cols-2",
}: {
  legend: string;
  description: string;
  eyebrow?: string;
  headerAlign?: SectionHeaderAlign;
  options: Array<ChoiceCardOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  gridClassName?: string;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">{legend}</legend>
      <PreferenceSectionHeader
        eyebrow={eyebrow}
        title={legend}
        description={description}
        align={headerAlign}
      />
      <div className={`grid gap-3 ${gridClassName}`}>
        {options.map((option) => (
          <ChoiceCard
            key={option.value}
            option={option}
            isSelected={value === option.value}
            onSelect={onChange}
          />
        ))}
      </div>
    </fieldset>
  );
}

function SummaryBadgeList({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-sm font-medium text-ink-muted">Brak</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant="neutral" className="text-[0.8rem]">
          {value}
        </Badge>
      ))}
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      {Array.isArray(value) ? (
        <SummaryBadgeList values={value} />
      ) : (
        <p className="text-sm font-semibold leading-6 text-ink">{value}</p>
      )}
    </div>
  );
}

function SummaryCategory({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: TablerIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-bg-elevated p-4 shadow-xs">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-deep"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="font-brand text-lg font-semibold text-ink">{title}</h4>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function OnboardingForm({
  initialValues,
  isEditing = false,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const spiceLevelInputId = useId();
  const wizardStepTopRef = useRef<HTMLDivElement | null>(null);
  const hasMountedWizardRef = useRef(false);
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
    formState: { isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: formDefaultValues,
  });

  const currentValues = useWatch({ control }) as PreferencesFormData;
  const spiceLevel = currentValues.spiceLevel ?? defaultValues.spiceLevel;

  useEffect(() => {
    if (isEditing) {
      return;
    }

    if (!hasMountedWizardRef.current) {
      hasMountedWizardRef.current = true;
      return;
    }

    wizardStepTopRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [isEditing, shouldReduceMotion, step]);

  const onSubmit = async (values: PreferencesFormData) => {
    setErrorMsg(null);
    try {
      await savePreferences(values);
      if (isEditing) {
        notify.success("Zapisano zmiany!", "Sukces");
        window.setTimeout(() => {
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

  const nextStep = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setStep((currentStep) => Math.min(currentStep + 1, WIZARD_STEP_COUNT));
  };

  const prevStep = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const sectionHeaderAlign: SectionHeaderAlign = isEditing ? "left" : "center";

  const renderSection1 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Jak jesz?
        </h3>
      ) : null}
      <Controller
        control={control}
        name="diet"
        render={({ field }) => (
          <ChoiceCardGroup
            legend="Dieta"
            eyebrow="Wybór główny"
            description="Wybierz styl jedzenia, który ma prowadzić propozycje MealGenie."
            headerAlign={sectionHeaderAlign}
            options={dietOptions}
            value={field.value}
            onChange={field.onChange}
            gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />
        )}
      />
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
          <div className="space-y-4">
            <PreferenceSectionHeader
              eyebrow="Bezpieczeństwo"
              title="Alergie i nietolerancje"
              description="Dodaj rzeczy, których MealGenie ma zawsze unikać w przepisach."
              align={sectionHeaderAlign}
            />
            <TagInput
              label="Alergie i nietolerancje"
              labelHidden
              placeholder="np. orzechy, laktoza"
              value={field.value}
              onChange={field.onChange}
            />
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="dislikedIngredients"
          render={({ field }) => (
            <div className="space-y-4">
              <PreferenceSectionHeader
                eyebrow="Smak"
                title="Nielubiane składniki"
                description="Składniki, które możesz jeść, ale nie chcesz ich w propozycjach."
                align={sectionHeaderAlign}
              />
              <TagInput
                label="Nielubiane składniki"
                labelHidden
                placeholder="np. brukselka"
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="favCuisines"
          render={({ field }) => (
            <div className="space-y-4">
              <PreferenceSectionHeader
                eyebrow="Inspiracje"
                title="Ulubione kuchnie"
                description="Kierunki smakowe, do których warto częściej wracać."
                align={sectionHeaderAlign}
              />
              <TagInput
                label="Ulubione kuchnie"
                labelHidden
                placeholder="np. włoska, tajska"
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />
      </div>
    </div>
  );

  const renderSection3 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Poziom umiejętności
        </h3>
      ) : null}
      <Controller
        control={control}
        name="cookingSkill"
        render={({ field }) => (
          <ChoiceCardGroup
            legend="Jak pewnie czujesz się w kuchni?"
            eyebrow="Poziom trudności"
            description="Wybierz poziom, który najlepiej opisuje Twoje tempo i komfort gotowania."
            headerAlign={sectionHeaderAlign}
            options={skillOptions}
            value={field.value}
            onChange={field.onChange}
            gridClassName="grid-cols-1 md:grid-cols-3"
          />
        )}
      />
    </div>
  );

  const renderSection4 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Sprzęt kuchenny
        </h3>
      ) : null}
      <Controller
        control={control}
        name="kitchenEquipment"
        render={({ field }) => (
          <div className="space-y-5">
            <PreferenceSectionHeader
              eyebrow="Możliwości kuchni"
              title="Twój sprzęt kuchenny"
              description="Zaznacz urządzenia, które realnie masz dostępne podczas gotowania."
              align={sectionHeaderAlign}
            />
            <div className="space-y-7">
              {equipmentCategories.map((category) => (
                <div
                  key={category.id}
                  className="space-y-4"
                  role="group"
                  aria-labelledby={`equipment-category-${category.id}`}
                >
                  <div className="flex justify-center">
                    <h4
                      id={`equipment-category-${category.id}`}
                      className="text-center font-brand text-base font-semibold text-ink"
                    >
                      {category.title}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {category.options.map((option) => {
                      const isSelected = field.value.includes(option.value);
                      const Icon = option.Icon;
                      const nextValue = isSelected
                        ? field.value.filter((value) => value !== option.value)
                        : [...field.value, option.value];

                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => field.onChange(nextValue)}
                          className={`group relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border p-4 text-center transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
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
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );

  const renderSection5 = ({ showHeading = true }: SectionOptions = {}) => (
    <div className="space-y-6">
      {showHeading ? (
        <h3 className="font-brand text-xl font-semibold text-ink">
          Budżet i ostrość
        </h3>
      ) : null}
      <Controller
        control={control}
        name="budget"
        render={({ field }) => (
          <ChoiceCardGroup
            legend="Budżet"
            eyebrow="Koszt składników"
            description="Ustal, jak bardzo MealGenie ma pilnować ceny zakupów."
            headerAlign={sectionHeaderAlign}
            options={budgetOptions}
            value={field.value}
            onChange={field.onChange}
            gridClassName="grid-cols-1 sm:grid-cols-2"
          />
        )}
      />

      <div className="rounded-xl border border-border bg-bg-sunken p-4 shadow-xs sm:p-5">
        <div className="space-y-4">
          <PreferenceSectionHeader
            eyebrow="Charakter dań"
            title="Poziom ostrości"
            description="Ustaw, jak pikantne mogą być domyślne propozycje posiłków."
            align={sectionHeaderAlign}
          />
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor={spiceLevelInputId}
              className="sr-only"
            >
              Poziom ostrości
            </label>
            <span className="inline-flex items-center gap-2 rounded-pill bg-bg-elevated px-2.5 py-1 text-xs font-bold text-ink-soft">
              <IconPepper className="h-4 w-4 text-accent" aria-hidden="true" />
              {spiceLevelLabels[spiceLevel] ?? "Umiarkowany"}
            </span>
          </div>
          <input
            id={spiceLevelInputId}
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

  const renderSection6 = ({ showHeading = true }: SectionOptions = {}) => {
    const selectedEquipment = currentValues.kitchenEquipment.map(
      (equipment) => EQUIPMENT_LABELS[equipment] ?? equipment,
    );

    return (
      <div className="space-y-6">
        {showHeading ? (
          <h3 className="font-brand text-xl font-semibold text-ink">
            Podsumowanie
          </h3>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryCategory title="Jedzenie" Icon={IconListCheck}>
            <SummaryItem
              label="Dieta"
              value={DIET_LABELS[currentValues.diet] ?? "Brak"}
            />
            <SummaryItem label="Ulubione kuchnie" value={currentValues.favCuisines} />
          </SummaryCategory>

          <SummaryCategory title="Ograniczenia" Icon={IconHeart}>
            <SummaryItem label="Alergie" value={currentValues.allergies} />
            <SummaryItem
              label="Nielubiane składniki"
              value={currentValues.dislikedIngredients}
            />
          </SummaryCategory>

          <SummaryCategory title="Kuchnia" Icon={IconToolsKitchen}>
            <SummaryItem
              label="Umiejętności"
              value={SKILL_LABELS[currentValues.cookingSkill] ?? "Brak"}
            />
            <SummaryItem label="Sprzęt" value={selectedEquipment} />
          </SummaryCategory>

          <SummaryCategory title="Preferencje" Icon={IconGauge}>
            <SummaryItem
              label="Budżet"
              value={BUDGET_LABELS[currentValues.budget] ?? "Brak"}
            />
            <SummaryItem
              label="Ostrość"
              value={spiceLevelLabels[currentValues.spiceLevel] ?? "Brak"}
            />
          </SummaryCategory>
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
      case 6:
        return renderSection6({ showHeading: false });
      default:
        return renderSection1({ showHeading: false });
    }
  };

  const currentStepDetails = stepDetails[step - 1];
  const isLastWizardStep = step === WIZARD_STEP_COUNT;

  return (
    <motion.form
      layout={!isEditing && !shouldReduceMotion}
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
          <div
            className="w-full border-t border-dotted border-border-dotted"
            aria-hidden="true"
          />
          {renderSection5()}
        </>
      ) : (
        <>
          <motion.div layout={!shouldReduceMotion} className="mb-8 space-y-5">
            <div
              ref={wizardStepTopRef}
              className="flex scroll-mt-24 items-center justify-between gap-4"
            >
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
