import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "pill";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-ink-inverse shadow-accent hover:border-accent-hover hover:bg-accent-hover active:border-accent-pressed active:bg-accent-pressed",
  secondary:
    "border-border-strong bg-bg-elevated text-ink shadow-sm hover:border-accent hover:bg-accent-soft active:bg-bg-sunken",
  ghost:
    "border-transparent bg-transparent text-ink-soft hover:bg-accent-soft hover:text-ink active:bg-bg-sunken",
  pill:
    "rounded-pill border-border-strong bg-bg-elevated text-accent shadow-xs hover:border-accent hover:bg-accent-soft hover:text-accent-deep active:bg-bg-sunken",
};

export function Button({
  variant = "primary",
  type = "button",
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold leading-none transition duration-fast ease-out",
        "cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-sunken disabled:text-ink-disabled disabled:shadow-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {leftIcon ? <span className="shrink-0" aria-hidden="true">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="shrink-0" aria-hidden="true">{rightIcon}</span> : null}
    </button>
  );
}
