import { Eyebrow, Textarea } from "../../ui";
import { TagInput } from "../../TagInput";

// ============================================
// Krok 1: Co masz na mysli? (prompt + skladniki)
// ============================================

type Step1PromptProps = {
  userPrompt: string;
  onUserPromptChange: (value: string) => void;
  ingredients: string[];
  onIngredientsChange: (value: string[]) => void;
  isGuestMode: boolean;
};

export function Step1Prompt({
  userPrompt,
  onUserPromptChange,
  ingredients,
  onIngredientsChange,
  isGuestMode,
}: Step1PromptProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="accent">Krok 1 z {isGuestMode ? "3" : "4"} · Inspiracja</Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Co dziś gotujemy?{" "}
          <span className="text-ink-soft">Powiedz w paru słowach.</span>
        </h2>
        <p className="max-w-xl text-base leading-7 text-ink-soft">
          {isGuestMode
            ? "Krótki opis pomoże MealGenie dobrać 3 propozycje. Możesz też zostawić puste i kliknąć Pomiń."
            : "Możesz opisać nastrój, ochotę albo wypisać składniki z lodówki. Im więcej szczegółów, tym celniejsze pomysły."}
        </p>
      </header>

      <Textarea
        label={
          isGuestMode
            ? "Czego szukasz? (opcjonalnie)"
            : "Na co masz dzisiaj ochotę? (opcjonalnie)"
        }
        value={userPrompt}
        onChange={(event) => onUserPromptChange(event.target.value)}
        placeholder={
          isGuestMode
            ? "np. coś lekkiego, bez mięsa, kuchnia włoska..."
            : "np. Coś lekkiego po treningu, mam ochotę na kuchnię azjatycką..."
        }
        rows={4}
      />

      {!isGuestMode && (
        <TagInput
          label="Masz coś w lodówce? (opcjonalnie)"
          value={ingredients}
          onChange={onIngredientsChange}
          placeholder="np. kurczak, ryż, pomidory"
        />
      )}
    </div>
  );
}
