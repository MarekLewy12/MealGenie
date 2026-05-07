import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export function HandwrittenKicker({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(
        "font-script italic leading-none text-accent",
        className,
        "text-[1.7rem]",
      )}
    />
  );
}
