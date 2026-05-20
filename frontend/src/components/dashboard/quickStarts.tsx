import { Link } from "react-router-dom";

import type { QuickStartItem } from "./quickStartItems";

// ============================================
// Karta pojedynczego quick start
// ============================================

export function QuickStartCard({ item }: { item: QuickStartItem }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      role="listitem"
      className={`group flex items-center gap-3 rounded-xl border border-border/70 bg-bg-elevated p-3.5 shadow-xs transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent dark:border-white/[0.08] dark:bg-white/[0.06] ${item.hoverBg}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.tone} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-brand text-sm font-semibold leading-tight text-ink">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs leading-4 text-ink-muted">
          {item.description}
        </span>
      </span>
    </Link>
  );
}
