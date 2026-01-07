import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  const scrollToContent = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 cursor-pointer"
      onClick={scrollToContent}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
        Przewiń w dół
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-6 w-6 text-indigo-400 dark:text-indigo-500" />
      </motion.div>
    </motion.div>
  );
}
