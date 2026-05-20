import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat } from "lucide-react";

import { viewVariants } from "./wizardMotion";

const culinaryFacts = [
  "Tworzę dla Ciebie unikalne zestawienia smaków...",
  "🍅 Pomidory były kiedyś uważane w Europie za trujące.",
  "Mieszam wybrane przez Ciebie składniki z magią AI...",
  "🍯 Miód jest jedynym jedzeniem, które nigdy się nie psuje.",
  "Szukam przepisów idealnie dopasowanych do Twojego czasu...",
  "🥑 Awokado to z botanicznego punktu widzenia... jagoda!",
  "Generuję apetyczne zdjęcia dla Twoich propozycji...",
  "🧀 Ser został odkryty przypadkowo ponad 4000 lat temu.",
  "Już prawie gotowe, dogrywam ostatnie szczegóły...",
];

export function LoadingView() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % culinaryFacts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-12">
        <motion.div
          className="absolute inset-0 rounded-full bg-accent"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-accent text-ink-inverse shadow-[var(--shadow-accent)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChefHat className="h-14 w-14" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="text-center">
        <h2 className="font-brand text-2xl font-semibold text-ink sm:text-3xl">
          MealGenie <span className="text-summary-gradient">pracuje...</span>
        </h2>
      </div>

      <div className="relative mt-8 h-20 w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <p className="font-serif text-xl font-medium text-ink-soft">
              {culinaryFacts[currentFactIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-sunken">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "5%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 20, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
