import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { savePreferences } from "../services/api";
import { MultiSelectPills } from "./Form/MultiSelectPills";
import { TagInput } from "./TagInput.tsx";
import { notify } from "../store/notificationStore";

import {
  Diet,
  CookingSkill,
  Equipment,
  Budget,
} from "../constants/enums";
import {
  DIET_LABELS,
  SKILL_LABELS,
  BUDGET_LABELS,
  EQUIPMENT_LABELS,
} from "../constants/translations";

const preferencesSchema = z.object({
  diet: z.nativeEnum(Diet),
  allergies: z.array(z.string()).default([]),
  favCuisines: z.array(z.string()).default([]),
  dislikedIngredients: z.array(z.string()).default([]),
  cookingSkill: z.nativeEnum(CookingSkill),
  kitchenEquipment: z.array(z.nativeEnum(Equipment)).default([]),
  budget: z.nativeEnum(Budget),
  spiceLevel: z.number().int().min(1).max(5).default(3),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

// Style dla inputów select/text
const inputStyles =
  "w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20";
const labelStyles =
  "block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2";
const spiceLevelLabels: Record<number, string> = {
  1: "Łagodny",
  2: "Lekko pikantny",
  3: "Umiarkowany",
  4: "Pikantny",
  5: "Bardzo ostry",
};

type OnboardingFormProps = {
  initialValues?: Partial<PreferencesFormData>;
  isEditing?: boolean;
};

export function OnboardingForm({
  initialValues,
  isEditing = false,
}: OnboardingFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      diet: Diet.NONE,
      allergies: [],
      favCuisines: [],
      dislikedIngredients: [],
      cookingSkill: CookingSkill.BEGINNER,
      kitchenEquipment: [],
      budget: Budget.MEDIUM,
      spiceLevel: 3,
      ...initialValues,
    },
  });

  const spiceLevel = watch("spiceLevel") ?? 3;

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

  const equipmentOptions = Object.values(Equipment).map((eq) => ({
    value: eq,
    label: EQUIPMENT_LABELS[eq],
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/50 md:p-10"
    >
      {/* SEKCJA 1: Podstawy */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            1
          </span>
          Fundamenty
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelStyles}>Dieta</label>
            <select className={inputStyles} {...register("diet")}>
              {Object.values(Diet).map((value) => (
                <option key={value} value={value}>
                  {DIET_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyles}>Budżet</label>
            <select className={inputStyles} {...register("budget")}>
              {Object.values(Budget).map((value) => (
                <option key={value} value={value}>
                  {BUDGET_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelStyles}>Poziom umiejętności</label>
            <select className={inputStyles} {...register("cookingSkill")}>
              {Object.values(CookingSkill).map((value) => (
                <option key={value} value={value}>
                  {SKILL_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Poziom ostrości
                </label>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                  {spiceLevelLabels[spiceLevel] ?? "Umiarkowany"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                {...register("spiceLevel", { valueAsNumber: true })}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-orange-500 dark:bg-slate-700"
              />
              <div className="flex justify-between px-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={`h-1.5 w-1.5 rounded-full ${
                      spiceLevel >= level
                        ? "bg-orange-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

      {/* SEKCJA 2: Szczegóły */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-xs font-bold text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">
            2
          </span>
          Smaki i Wykluczenia
        </h3>

        <Controller
          control={control}
          name="allergies"
          render={({ field }) => (
            <TagInput
              label="Alergie i Nietolerancje"
              placeholder="np. orzechy, laktoza"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

      {/* SEKCJA 3: Sprzęt */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
            3
          </span>
          Twój Arsenał
        </h3>

        <Controller
          control={control}
          name="kitchenEquipment"
          render={({ field }) => (
            <MultiSelectPills
              label=""
              options={equipmentOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Błędy / Sukces */}
      {errorMsg && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 py-4 text-base font-semibold text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-slate-800 disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {isSubmitting ? (
            "Zapisywanie..."
          ) : (
            <>
              {isEditing ? "Zapisz zmiany" : "Zapisz i przejdź dalej"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

    </form>
  );
}
