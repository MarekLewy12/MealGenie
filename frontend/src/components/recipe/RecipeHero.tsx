import { motion } from "framer-motion";
import type { ElementType } from "react";
import { ChefHat, Clock3, Flame } from "lucide-react";

import { Badge, FolkDivider, HandwrittenKicker, MealEmoji } from "../ui";
import { cn } from "../../utils/cn";

export type RecipeHeroProps = {
  title: string;
  description?: string;
  imageUrl?: string | null;
  badgeLabel: string;
  badgeVariant?: "accent" | "basil" | "saffron" | "neutral";
  kickerText?: string;
  stats: {
    totalTime: number;
    difficultyLabel: string;
    calories?: number;
    portionLabel: string;
    portionValue: string;
    PortionIcon: ElementType;
  };
  isLoading?: boolean;
  edgeToEdge?: boolean;
};

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[82px] flex-col items-center justify-center gap-1 px-3 py-3 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <span className="max-w-full truncate font-serif text-lg font-medium text-ink">
        {value}
      </span>
    </div>
  );
}

export function RecipeHero({
  title,
  description,
  imageUrl,
  badgeLabel,
  badgeVariant = "accent",
  kickerText = "twój przepis",
  stats,
  isLoading = false,
  edgeToEdge = false,
}: RecipeHeroProps) {
  return (
    <div
      className={cn(
        "relative grid overflow-hidden border border-border bg-bg-elevated shadow-lg lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]",
        edgeToEdge
          ? "rounded-none border-x-0 border-t-0 shadow-[0_24px_70px_-48px_var(--accent)]"
          : "rounded-[2rem]",
      )}
    >
      {edgeToEdge ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.38),transparent_26%,transparent_74%,rgba(194,87,40,0.14))] dark:bg-[linear-gradient(115deg,rgba(255,255,255,0.06),transparent_28%,transparent_74%,rgba(194,87,40,0.16))]"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className="relative min-h-[300px] overflow-hidden bg-bg-sunken shadow-[0_1px_0_rgba(255,255,255,0.45)_inset] sm:min-h-[400px] lg:min-h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_45%),var(--bg-sunken)]">
            <MealEmoji name={title} size="lg" className="text-8xl text-accent" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent lg:hidden" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent via-ink/5 to-ink/20 lg:block" />

        <div className="absolute left-5 top-5">
          <Badge
            variant={badgeVariant}
            className="bg-bg-elevated/90 shadow-sm backdrop-blur-md"
          >
            {badgeLabel}
          </Badge>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_18%,var(--accent-soft),transparent_34%),var(--bg-elevated)] p-6 text-center dark:bg-[radial-gradient(circle_at_50%_18%,rgba(194,87,40,0.16),transparent_36%),var(--bg-elevated)] sm:p-10 lg:p-12">
        <motion.div
          initial={isLoading ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <HandwrittenKicker className="mb-2">{kickerText}</HandwrittenKicker>

          <h1 className="text-summary-gradient font-brand text-3xl font-semibold leading-[1.05] sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {description}
            </p>
          ) : null}

          <FolkDivider className="mx-auto my-6 max-w-[12rem] text-border-strong" />

          <div className="mt-6 grid grid-cols-2 divide-x divide-y divide-border border-y border-border py-4 md:grid-cols-4 md:divide-y-0">
            <HeroStat icon={Clock3} label="Czas" value={`${stats.totalTime} min`} />
            <HeroStat
              icon={ChefHat}
              label="Trudność"
              value={stats.difficultyLabel}
            />
            <HeroStat
              icon={Flame}
              label="Kalorie"
              value={stats.calories ? `${stats.calories} kcal` : "—"}
            />
            <HeroStat
              icon={stats.PortionIcon}
              label={stats.portionLabel}
              value={stats.portionValue}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
