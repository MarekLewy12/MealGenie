import { motion } from "framer-motion";

import { LoadingExperience } from "../LoadingExperience";
import { viewVariants } from "./wizardMotion";

// ============================================
// View "loading" - LoadingExperience + skeleton karty
// ============================================

export function LoadingView() {
  return (
    <motion.div
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LoadingExperience />
      <LoadingSkeletons />
    </motion.div>
  );
}

function LoadingSkeletons() {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated p-6 shadow-sm"
        >
          <div className="h-48 animate-pulse rounded-md bg-bg-sunken" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-bg-sunken" />
          <div className="h-4 w-full animate-pulse rounded bg-bg-sunken" />
        </motion.div>
      ))}
    </div>
  );
}
