import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export type MealEmojiSize = "sm" | "md" | "lg";

export interface MealEmojiProps extends HTMLAttributes<HTMLSpanElement> {
  emoji?: string;
  fallback?: string;
  size?: MealEmojiSize;
}

const sizeClasses: Record<MealEmojiSize, string> = {
  sm: "h-8 w-8 text-lg",
  md: "h-12 w-12 text-2xl",
  lg: "h-16 w-16 text-4xl",
};

export function MealEmoji({
  emoji,
  fallback = "?",
  size = "md",
  className,
  ...props
}: MealEmojiProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-pill bg-bg-sunken font-semibold text-ink-soft shadow-xs",
        sizeClasses[size],
        className,
      )}
      role="img"
      aria-label={emoji ? "Ikona posilku" : "Brak ikony posilku"}
      {...props}
    >
      {emoji ?? fallback}
    </span>
  );
}
