import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";
import {
  ChefHat,
  Flame,
  Heart,
  Loader2,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import {
  OnboardingForm,
  type SettingsCategoryId,
} from "../components/OnboardingForm";
import { AppPageHeader } from "../components/AppPageHeader";
import { HandwrittenKicker } from "../components/ui";
import { getPreferences } from "../services/api";

const settingsCategories: Array<{
  id: SettingsCategoryId;
  label: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    id: "food",
    label: "Jedzenie",
    description: "Dieta i ulubione kuchnie",
    Icon: ChefHat,
  },
  {
    id: "limits",
    label: "Ograniczenia",
    description: "Alergie i nielubiane składniki",
    Icon: Heart,
  },
  {
    id: "kitchen",
    label: "Kuchnia",
    description: "Umiejętności i sprzęt",
    Icon: Settings2,
  },
  {
    id: "preferences",
    label: "Preferencje",
    description: "Budżet i poziom ostrości",
    Icon: Flame,
  },
];

export function SettingsPage() {
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategoryId>("food");
  const settingsPanelRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences,
  });

  const activeCategoryMeta =
    settingsCategories.find((category) => category.id === activeCategory) ??
    settingsCategories[0];

  const ActiveIcon = activeCategoryMeta.Icon;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.requestAnimationFrame(() => {
      const panelTop = settingsPanelRef.current?.getBoundingClientRect().top;

      if (panelTop === undefined || panelTop >= 24) {
        return;
      }

      settingsPanelRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [activeCategory, shouldReduceMotion]);

  return (
    <section className="min-h-full bg-bg text-ink">
      <AppPageHeader
        maxWidthClassName="max-w-6xl"
        eyebrow={<HandwrittenKicker>twoje zasady</HandwrittenKicker>}
        title={
          <>
            Profil{" "}
            <span className="bg-gradient-to-r from-accent via-accent-hover to-saffron bg-clip-text text-transparent">
              kulinarny
            </span>
          </>
        }
        description="Te ustawienia są używane przez AI do generowania Twoich posiłków i doboru odpowiednich składników."
      />

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16 lg:pt-8">
        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-accent">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
          </div>
        ) : isError ? (
          <div className="p-10 text-center font-medium text-bordeaux">
            Nie udało się pobrać ustawień. Spróbuj odświeżyć stronę.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-24">
              <nav
                aria-label="Kategorie ustawień profilu kulinarnego"
                className="rounded-2xl border border-border bg-bg-elevated p-3 shadow-sm"
              >
                <p className="mb-3 hidden px-2 font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-muted lg:block">
                  Kategorie
                </p>

                <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
                  {settingsCategories.map((category) => {
                    const CategoryIcon = category.Icon;
                    const isActive = category.id === activeCategory;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex min-w-[12rem] cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left transition duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full lg:min-w-0 ${
                          isActive
                            ? "border-accent bg-accent-soft text-accent-deep shadow-xs"
                            : "border-transparent text-ink-soft hover:border-border-strong hover:bg-bg-sunken hover:text-ink"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                            isActive
                              ? "border-accent/30 bg-bg-elevated text-accent"
                              : "border-border bg-bg-sunken text-ink-muted group-hover:text-accent"
                          }`}
                        >
                          <CategoryIcon className="h-4.5 w-4.5" aria-hidden="true" />
                        </span>

                        <span className="min-w-0">
                          <span className="block font-brand text-sm font-semibold leading-5">
                            {category.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-current opacity-75">
                            {category.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </aside>

            <div
              ref={settingsPanelRef}
              className="scroll-mt-6 rounded-2xl border border-border bg-bg-elevated p-5 shadow-sm sm:p-7 lg:scroll-mt-24 lg:p-8"
            >
              <div className="mb-7 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <ActiveIcon className="h-6 w-6" aria-hidden="true" />
                </div>

                <div>
                  <p className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    Aktywna sekcja
                  </p>
                  <h2 className="mt-1 font-brand text-2xl font-semibold leading-tight text-ink">
                    {activeCategoryMeta.label}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {activeCategoryMeta.description}
                  </p>
                </div>
              </div>

              <OnboardingForm
                initialValues={data ?? undefined}
                isEditing
                activeCategory={activeCategory}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
