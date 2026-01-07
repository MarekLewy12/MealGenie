import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
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
}: PageTransitionProps) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
