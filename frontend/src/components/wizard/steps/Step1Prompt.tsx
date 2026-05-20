import { MessageSquareText, Refrigerator } from "lucide-react";

import { Eyebrow } from "../../ui";
import { TagInput } from "../../TagInput";

const AUTH_PROMPT_MAX_LENGTH = 500;
const GUEST_PROMPT_MAX_LENGTH = 240;
const QUICK_INGREDIENTS = [
  "jajka",
  "kurczak",
  "ryż",
  "makaron",
  "pomidory",
  "twaróg",
  "cukinia",
  "papryka",
];

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
  const promptMaxLength = isGuestMode
    ? GUEST_PROMPT_MAX_LENGTH
    : AUTH_PROMPT_MAX_LENGTH;
  const promptCharacterCount = userPrompt.length;
  const availableQuickIngredients = QUICK_INGREDIENTS.filter(
    (suggestion) =>
      !ingredients.some(
        (ingredient) =>
          ingredient.toLowerCase() === suggestion.toLowerCase(),
      ),
  );

  const handleQuickIngredientAdd = (ingredient: string) => {
    onIngredientsChange([...ingredients, ingredient]);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Eyebrow tone="accent">
          Krok 1 z {isGuestMode ? "3" : "4"} · Inspiracja
        </Eyebrow>
        <h2 className="font-serif text-3xl font-medium leading-[1.08] text-ink sm:text-4xl lg:text-[2.5rem]">
          Co dziś gotujemy?{" "}
          <span className="text-ink-soft">Powiedz w paru słowach.</span>
        </h2>
        <p className="max-w-3xl text-base leading-7 text-ink-soft">
          {isGuestMode
            ? "Krótki opis pomoże MealGenie dobrać 3 propozycje. Możesz też zostawić puste i kliknąć Pomiń."
            : "Opisz smak lub produkty pod ręką. MealGenie potraktuje to jako wskazówki."}
        </p>
      </header>

      <div
        className={
          isGuestMode
            ? "space-y-5"
            : "grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]"
        }
      >
        <section className="flex h-full min-h-0 flex-col">
          <div className="mb-3 flex items-start gap-3">
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-soft text-accent-deep"
              aria-hidden="true"
            >
              <MessageSquareText className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-brand text-lg font-semibold leading-tight text-ink">
                Na co masz ochotę?
              </h3>
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                Opisz smak, nastrój albo cel posiłku.
              </p>
            </div>
          </div>

          <label
            htmlFor="meal-generator-prompt"
            className="mb-2 text-sm font-semibold text-ink"
          >
            {isGuestMode
              ? "Czego szukasz? (opcjonalnie)"
              : "Opisz pomysł na posiłek (opcjonalnie)"}
          </label>
          <div className="relative flex min-h-32 flex-1 sm:min-h-36">
            <textarea
              id="meal-generator-prompt"
              value={userPrompt}
              onChange={(event) => onUserPromptChange(event.target.value)}
              maxLength={promptMaxLength}
              placeholder={
                isGuestMode
                  ? "np. coś lekkiego, bez mięsa, kuchnia włoska..."
                  : "np. coś lekkiego po treningu, azjatyckie smaki, dużo warzyw, bez smażenia..."
              }
              rows={5}
              aria-describedby="meal-generator-prompt-counter"
              className="h-full min-h-32 w-full resize-none rounded-xl border border-border-strong bg-bg-elevated/90 px-4 py-3 pb-8 text-base leading-7 text-ink shadow-sm transition duration-fast ease-out placeholder:text-ink-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft focus-visible:!outline-none focus-visible:![box-shadow:none] disabled:cursor-not-allowed disabled:bg-bg-sunken disabled:text-ink-disabled sm:min-h-36"
            />
            <p
              id="meal-generator-prompt-counter"
              className="pointer-events-none absolute bottom-2 right-3 text-xs font-medium text-ink-muted"
            >
              {promptCharacterCount}/{promptMaxLength}
            </p>
          </div>
        </section>

        {!isGuestMode && (
          <section className="flex h-full min-h-0 flex-col">
            <div className="mb-3 flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-basil/25 bg-basil-soft text-basil"
                aria-hidden="true"
              >
                <Refrigerator className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-brand text-lg font-semibold leading-tight text-ink">
                  Masz coś w lodówce?
                </h3>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  Dodaj produkty, które chcesz wykorzystać.
                </p>
              </div>
            </div>

            <TagInput
              label="Składniki do wykorzystania (opcjonalnie)"
              value={ingredients}
              onChange={onIngredientsChange}
              placeholder="np. kurczak, ryż, pomidory"
            />

            {availableQuickIngredients.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-2">
                {availableQuickIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => handleQuickIngredientAdd(ingredient)}
                    className="inline-flex min-h-8 w-full items-center justify-center rounded-pill border border-border-strong bg-bg-elevated px-2.5 py-1 text-sm font-semibold text-ink-soft transition duration-fast ease-out hover:border-basil/50 hover:bg-basil-soft hover:text-basil focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
