import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export type EyebrowTone = "accent" | "muted" | "basil" | "saffron";

export interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: EyebrowTone;
}

const toneClasses: Record<EyebrowTone, string> = {
  accent: "text-accent",
  muted: "text-ink-muted",
  basil: "text-basil",
  saffron: "text-saffron",
};

export function Eyebrow({ tone = "accent", className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold uppercase leading-none tracking-[0.14em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
