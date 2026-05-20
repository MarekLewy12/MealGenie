import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";

import { cn } from "../../utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  id,
  label,
  hint,
  error,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = ariaInvalid ?? Boolean(error);

  return (
    <div className="grid gap-2">
      <label htmlFor={textareaId} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(
          "min-h-28 w-full resize-y rounded-md border border-border bg-bg-elevated px-4 py-3 text-sm text-ink shadow-xs transition duration-fast ease-out",
          "placeholder:text-ink-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft focus-visible:!outline-none focus-visible:![box-shadow:none]",
          "disabled:cursor-not-allowed disabled:bg-bg-sunken disabled:text-ink-disabled",
          error && "border-bordeaux focus:border-bordeaux focus:ring-accent-soft",
          className,
        )}
        {...props}
      />
      {hint ? <p id={hintId} className="text-xs text-ink-soft">{hint}</p> : null}
      {error ? <p id={errorId} className="text-xs font-semibold text-bordeaux">{error}</p> : null}
    </div>
  );
}
