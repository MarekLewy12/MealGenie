import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

export interface DottedRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
}

export function DottedRow({ label, value, className, ...props }: DottedRowProps) {
  return (
    <div className={cn("flex items-baseline gap-3 text-sm text-ink", className)} {...props}>
      <span className="min-w-0 break-words">{label}</span>
      <span className="mb-1 min-w-6 flex-1 border-b border-dotted border-border-dotted" aria-hidden="true" />
      <span className="shrink-0 font-semibold text-ink-soft">{value}</span>
    </div>
  );
}
