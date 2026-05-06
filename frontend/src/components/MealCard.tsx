import type { MealSuggestion } from "../types/meal";
import { Badge, Button, DottedRow, MealEmoji } from "./ui";

type MealCardProps = {
  meal: MealSuggestion;
  onSelect: () => void;
  showAction?: boolean;
};

const difficultyBadgeVariant: Record<
  MealSuggestion["difficulty"],
  "basil" | "saffron" | "danger"
> = {
  Easy: "basil",
  Medium: "saffron",
  Hard: "danger",
};

const difficultyLabel: Record<MealSuggestion["difficulty"], string> = {
  Easy: "łatwe",
  Medium: "średnie",
  Hard: "trudne",
};

export function MealCard({ meal, onSelect, showAction = true }: MealCardProps) {
  const displayedIngredients = meal.ingredients.slice(0, 4);
  const remainingCount = meal.ingredients.length - displayedIngredients.length;
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageSrc = meal.imageUrl?.startsWith("/meal-images/")
    ? `${apiBaseUrl}${meal.imageUrl}`
    : meal.imageUrl;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border-strong bg-bg-elevated text-ink shadow-[0_18px_38px_-30px_rgba(58,40,24,0.58),0_1px_0_rgba(255,255,255,0.42)_inset] outline outline-1 outline-offset-2 outline-border-strong/80 transition duration-base ease-out hover:-translate-y-0.5 hover:border-accent/55 hover:outline-accent/35 hover:shadow-[0_24px_44px_-30px_rgba(58,40,24,0.68),0_1px_0_rgba(255,255,255,0.45)_inset]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-sunken sm:aspect-video">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={`Zdjęcie dania: ${meal.name}`}
              className="h-full w-full object-cover brightness-[0.94] contrast-[1.03] saturate-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-accent/5 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_45%),var(--bg-sunken)]">
            <MealEmoji size="lg" fallback="MG" className="h-20 w-20 text-2xl text-accent" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg-elevated/45 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="min-w-0">
          <div className="mb-2 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-accent">
            pomysł na dziś
          </div>
          <h3 className="font-brand text-xl font-semibold leading-tight tracking-[-0.01em] text-ink">
            {meal.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">
            {meal.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={difficultyBadgeVariant[meal.difficulty]}>
            {difficultyLabel[meal.difficulty]}
          </Badge>
          <Badge variant="neutral">{meal.cookingTimeMinutes} min</Badge>
          <Badge variant="accent">
            {meal.calories ? `${meal.calories} kcal` : "kcal n/d"}
          </Badge>
        </div>

        <div className="rounded-md border border-border bg-bg/55 p-4">
          <div className="mb-3 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-accent">
            Składniki
          </div>
          <ul className="space-y-2" role="list">
            {displayedIngredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                <DottedRow
                  label={ingredient.name}
                  value={`${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ""}`}
                />
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="pt-1 text-sm text-ink-muted">
                + {remainingCount} więcej
              </li>
            )}
          </ul>
        </div>

        {showAction && (
          <div className="mt-auto pt-1">
            <Button onClick={onSelect} className="w-full rounded-lg shadow-accent">
              Wybieram to danie
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
