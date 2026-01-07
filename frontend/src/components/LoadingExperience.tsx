import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const culinaryFacts = [
  "🍯 Miód jest jedynym jedzeniem, które nigdy się nie psuje",
  "🍅 Pomidory były kiedyś uważane za trujące w Europie",
  "🍕 Pierwsza pizza Margherita miała kolory flagi włoskiej",
  "🌶️ Wasabi w sushi barach to zwykle barwiony chrzan",
  "💎 Szafran jest najdroższą przyprawą na świecie",
  "🥑 Awokado to botanicznie... jagoda!",
  "🍫 Czekolada była kiedyś używana jako waluta u Azteków",
  "🧀 Ser został odkryty przypadkowo ~4000 lat temu",
];

export function LoadingExperience() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % culinaryFacts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center gap-12 px-6 py-16">
      <motion.div
        animate={{
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-8 shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-900/50"
      >
        <ChefHat className="h-16 w-16 text-white" />
      </motion.div>

      <div className="relative h-24 w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              {culinaryFacts[currentFactIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "linear" }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Tworzę personalizowane propozycje...
        </p>
      </div>

    </div>
  );
}
