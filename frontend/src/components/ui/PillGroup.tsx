import { cn } from "../../utils/cn";

export interface PillGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PillGroupProps {
  legend: string;
  options: PillGroupOption[];
  value: string[];
  onChange: (value: string[]) => void;
  type?: "single" | "multi";
  className?: string;
  disabled?: boolean;
}

export function PillGroup({
  legend,
  options,
  value,
  onChange,
  type = "single",
  className,
  disabled = false,
}: PillGroupProps) {
  const toggleValue = (optionValue: string) => {
    if (type === "single") {
      onChange(value.includes(optionValue) ? [] : [optionValue]);
      return;
    }

    onChange(
      value.includes(optionValue)
        ? value.filter((selectedValue) => selectedValue !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <fieldset className={cn("grid gap-3", className)} disabled={disabled}>
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value.includes(option.value);
          const isDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              disabled={isDisabled}
              onClick={() => toggleValue(option.value)}
              className={cn(
                "inline-flex min-h-11 items-center justify-center rounded-pill border px-4 py-2 text-sm font-semibold transition duration-fast ease-out",
                "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
                isActive
                  ? "border-accent bg-accent text-ink-inverse shadow-accent"
                  : "border-border-strong bg-bg-elevated text-ink-soft shadow-xs hover:border-accent hover:bg-accent-soft hover:text-ink",
                isDisabled && "cursor-not-allowed border-border bg-bg-sunken text-ink-disabled shadow-none",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
