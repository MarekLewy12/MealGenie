import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export type BadgeVariant = "accent" | "basil" | "saffron" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  srLabel?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: "bg-accent-soft text-accent-deep",
  basil: "bg-basil-soft text-basil",
  saffron: "bg-saffron-soft text-saffron",
  danger: "bg-accent-soft text-bordeaux",
  neutral: "bg-bg-sunken text-ink-soft",
};

export function Badge({
  variant = "neutral",
  srLabel,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-bold leading-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {srLabel ? <span className="sr-only">{srLabel}: </span> : null}
      {children}
    </span>
  );
}
