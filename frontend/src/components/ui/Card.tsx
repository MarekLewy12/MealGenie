import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export type CardVariant = "paper" | "sunken" | "dark";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  liftOnHover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  paper: "border-border bg-bg-elevated text-ink shadow-sm",
  sunken: "border-border bg-bg-sunken text-ink shadow-xs",
  dark: "border-transparent bg-bg-inverse text-ink-inverse shadow-md",
};

export function Card({
  variant = "paper",
  liftOnHover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 transition duration-base ease-out",
        variantClasses[variant],
        liftOnHover && "hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}
