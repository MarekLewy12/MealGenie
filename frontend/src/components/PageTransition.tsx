import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
  skipInitialAnimation?: boolean;
};

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function PageTransition({
  children,
  className = "",
  skipInitialAnimation = false,
}: PageTransitionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial={skipInitialAnimation || shouldReduceMotion ? false : "initial"}
      animate={shouldReduceMotion ? undefined : "animate"}
      exit={shouldReduceMotion ? undefined : "exit"}
      className={`flex min-h-0 w-full flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
