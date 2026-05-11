import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { OnboardingForm } from "../components/OnboardingForm";
import { HandwrittenKicker } from "../components/ui";
import { getPreferences } from "../services/api";

export function SettingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-accent">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center font-medium text-bordeaux">
        Nie udało się pobrać ustawień. Spróbuj odświeżyć stronę.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 text-ink sm:px-6 lg:px-8">
      <div className="mb-8 lg:mb-12">
        <HandwrittenKicker>twoje zasady</HandwrittenKicker>
        <h1 className="mt-2 font-brand text-3xl font-bold text-ink sm:text-4xl">
          Profil kulinarny
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
          Te ustawienia są używane przez AI do generowania Twoich posiłków i
          doboru odpowiednich składników.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm sm:p-10">
        <OnboardingForm initialValues={data ?? undefined} isEditing={true} />
      </div>
    </section>
  );
}
