import type { SVGAttributes } from "react";

import { cn } from "../../utils/cn";

export function FolkDivider({ className, ...props }: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 240 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-full text-accent", className)}
    >
      <path
        d="M8 12h70m84 0h70"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
      <path
        d="M120 4c4 5.5 9.5 8 16 8-6.5 0-12 2.5-16 8-4-5.5-9.5-8-16-8 6.5 0 12-2.5 16-8Z"
        fill="currentColor"
      />
      <circle cx="92" cy="12" r="3" fill="currentColor" />
      <circle cx="148" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}
