import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

type AppPageHeaderAlign = "left" | "center";

const appPageHeaderLayoutTransition = {
  layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

type AppPageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  sideContent?: ReactNode;
  align?: AppPageHeaderAlign;
  titleId?: string;
  maxWidthClassName?: string;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  action,
  sideContent,
  align = "left",
  titleId,
  maxWidthClassName = "max-w-[1760px]",
}: AppPageHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCentered = align === "center";
  const rightContent = sideContent ?? action;

  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-bg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/15 via-transparent to-bg dark:from-accent-soft/[0.03] dark:to-bg" />
        <div className="absolute -left-[10%] -top-[35%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-accent-soft/80 to-saffron-soft/65 blur-[100px] dark:from-accent/16 dark:to-saffron/6 dark:blur-[110px]" />
        <div className="absolute -right-[8%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-basil-soft/60 blur-[85px] dark:bg-basil/14 dark:blur-[95px]" />
      </div>

      <div
        className={cn(
          "relative mx-auto px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10",
          maxWidthClassName,
        )}
      >
        <motion.div
          layout={!prefersReducedMotion}
          transition={
            prefersReducedMotion ? undefined : appPageHeaderLayoutTransition
          }
          className={cn(
            "flex flex-col gap-6",
            isCentered
              ? "items-center text-center"
              : "items-center gap-4 text-center sm:gap-6 lg:flex-row lg:items-center lg:justify-between lg:text-left",
          )}
        >
          <motion.div
            layout={!prefersReducedMotion}
            transition={
              prefersReducedMotion ? undefined : appPageHeaderLayoutTransition
            }
            className={cn(
              "flex min-w-0 flex-col gap-3",
              isCentered ? "items-center" : "items-center lg:items-start",
            )}
          >
            {eyebrow ? <div>{eyebrow}</div> : null}

            <h1
              id={titleId}
              className="font-serif text-2xl font-medium leading-[1.05] text-ink sm:text-4xl lg:text-[2.75rem]"
            >
              {title}
            </h1>

            {description ? (
              <p
                className={cn(
                  "text-sm leading-6 text-ink-soft sm:text-base",
                  isCentered ? "mx-auto max-w-2xl" : "max-w-4xl",
                )}
              >
                {description}
              </p>
            ) : null}
          </motion.div>

          {rightContent ? (
            <div
              className={cn(
                "flex w-full shrink-0 flex-wrap justify-center gap-3 lg:w-auto",
                isCentered ? "self-center" : "lg:self-end",
              )}
            >
              {rightContent}
            </div>
          ) : null}
        </motion.div>
      </div>
    </header>
  );
}
