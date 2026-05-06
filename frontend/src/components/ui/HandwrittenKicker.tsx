import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export function HandwrittenKicker({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("font-script text-xl italic leading-none text-accent", className)}
    />
  );
}
