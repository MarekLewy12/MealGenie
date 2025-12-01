import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { savePreferences } from "../services/api";
import { MultiSelectPills } from "./Form/MultiSelectPills";
import { TagInput } from "./TagInput.tsx";

import {
  Diet,
  CookingSkill,
  KitchenEquipment,
  BudgetLevel,
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
  prepTimePreference: z.number().int().nonnegative(),
  kitchenEquipment: z.array(z.nativeEnum(KitchenEquipment)).default([]),
  budget: z.nativeEnum(BudgetLevel),
  servingSize: z.number().int().min(1),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export function OnboardingForm() {
  const [message, setMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      diet: Diet.NONE,
      allergies: [],
      favCuisines: [],
      dislikedIngredients: [],
      cookingSkill: CookingSkill.BEGINNER,
      prepTimePreference: 30,
      kitchenEquipment: [],
      budget: BudgetLevel.CHEAP,
      servingSize: 2,
    },
  });

  const onSubmit = async (values: PreferencesFormData) => {
    try {
      await savePreferences(values);
      setMessage("Preferencje zapisane pomyślnie.");
      reset({ ...values });
    } catch (error: unknown) {
      console.error(error);
      setMessage("Nie udało się zapisać preferencji.");
    }
  };

  // Mapowanie sprzętu kuchennego na format odpowiedni dla pastylek
  const equipmentOptions = Object.values(KitchenEquipment).map((eq) => ({
    value: eq,
    label: EQUIPMENT_LABELS[eq],
  }));

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300/70">
            Onboarding
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Ustal swoje preferencje
          </h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Wybierz dietę, umiejętności i sprzęty kuchenne, aby MealGenie
            personalizował pomysły na posiłki.
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Dieta</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
              {...register("diet")}
            >
              {Object.values(Diet).map((value) => (
                <option key={value} value={value}>
                  {DIET_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Umiejętności kulinarne
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
              {...register("cookingSkill")}
            >
              {Object.values(CookingSkill).map((value) => (
                <option key={value} value={value}>
                  {SKILL_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Budżet</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
              {...register("budget")}
            >
              {Object.values(BudgetLevel).map((value) => (
                <option key={value} value={value}>
                  {BUDGET_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <Controller
            control={control}
            name="allergies"
            render={({ field }) => (
              <TagInput
                label="Alergie"
                placeholder="np. gluten, orzechy"
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
                placeholder="np. włoska, meksykańska"
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
                placeholder="np. seler, papryka"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="kitchenEquipment"
            render={({ field }) => (
              <MultiSelectPills
                label="Sprzęt kuchenny"
                options={equipmentOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Porcje</label>
            <Controller
              control={control}
              name="servingSize"
              render={({ field }) => (
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                />
              )}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Czas przygotowania (min)
            </label>
            <Controller
              control={control}
              name="prepTimePreference"
              render={({ field }) => (
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
          </div>
        </div>

        {errors && Object.keys(errors).length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            <p className="font-semibold">Błędy walidacji:</p>
            <ul className="mt-2 space-y-1">
              {Object.values(errors).map((err, index) => (
                <li key={index}>• {err?.message}</li>
              ))}
            </ul>
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-900/50"
        >
          {isSubmitting ? "Zapisywanie..." : "Zapisz preferencje"}
        </button>
      </form>
    </div>
  );
}
