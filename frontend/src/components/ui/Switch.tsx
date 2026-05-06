import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({
  checked,
  onChange,
  onClick,
  disabled,
  className,
  type = "button",
  ...props
}: SwitchProps) {
  return (
    <button
      {...props}
      type={type}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          onChange(!checked);
        }
      }}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center rounded-pill p-1 transition duration-fast ease-out",
        "cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
        checked ? "bg-accent" : "bg-bg-sunken",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span
        className={cn(
          "h-6 w-6 rounded-full bg-bg-elevated shadow-sm transition duration-fast ease-out",
          checked && "translate-x-4 bg-ink-inverse",
        )}
      />
    </button>
  );
}
