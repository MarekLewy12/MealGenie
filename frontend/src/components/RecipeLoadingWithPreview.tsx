import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ChefHat,
  Flame,
  BookOpen,
  Clock,
  UtensilsCrossed,
} from "lucide-react";
import type { MealSuggestion } from "../types/meal";

const loadingStages = [
  { icon: Sparkles, text: "Analizuję składniki...", color: "text-amber-500" },
  {
    icon: Flame,
    text: "Przygotowuję instrukcje krok po kroku...",
    color: "text-orange-500",
  },
  {
    icon: BookOpen,
    text: "Finalizuję przepis i wartości odżywcze...",
    color: "text-emerald-500",
  },
];

const culinaryFacts = [
  "🍯 Miód jest jedynym jedzeniem, które nigdy się nie psuje",
  "🧀 Ser został odkryty przypadkowo około 4000 lat temu",
  "🥑 Awokado to botanicznie... jagoda!",
  "🌶️ Wasabi w większości sushi barów to barwiony chrzan",
  "🍫 Czekolada była używana jako waluta u Azteków",
  "🧈 Masło klarowane ma wyższą temperaturę dymienia niż zwykłe",
  "🍝 Marco Polo NIE przywiózł makaronu z Chin - to mit!",
  "🥕 Marchew pierwotnie była fioletowa, nie pomarańczowa",
];

type Props = {
  teaser?: MealSuggestion | null;
};

export function RecipeLoadingWithPreview({ teaser }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * culinaryFacts.length),
  );

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % loadingStages.length);
    }, 3000);

    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % culinaryFacts.length);
    }, 5000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(factInterval);
    };
  }, []);

  const currentStage = loadingStages[stageIndex];
  const StageIcon = currentStage.icon;

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const imageUrl = teaser?.imageUrl?.startsWith("/")
    ? `${apiBaseUrl}${teaser.imageUrl}`
    : teaser?.imageUrl;

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-16">
      {teaser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/80"
        >
          <div className="flex items-center gap-4 p-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={teaser.name}
                className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <UtensilsCrossed className="h-8 w-8 text-white/70" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">
                {teaser.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                {teaser.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{teaser.cookingTimeMinutes} min</span>
                {teaser.calories && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{teaser.calories} kcal</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-indigo-50/50 px-5 py-2.5 dark:border-slate-700 dark:bg-indigo-500/10">
            <p className="text-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
              ✨ AI rozbudowuje ten przepis dla Ciebie...
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col items-center gap-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.div
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-2xl shadow-purple-500/30"
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(168, 85, 247, 0.3)",
                "0 25px 50px -12px rgba(168, 85, 247, 0.5)",
                "0 25px 50px -12px rgba(168, 85, 247, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChefHat className="h-12 w-12 text-white" />
          </motion.div>
        </div>

        <div className="h-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <StageIcon className={`h-5 w-5 ${currentStage.color}`} />
              <span className="text-base font-medium text-slate-700 dark:text-slate-200">
                {currentStage.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="h-12 w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400"
          >
            {culinaryFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            initial={{ width: "5%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 20, ease: "easeOut" }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          Generowanie szczegółowego przepisu zajmuje ok. 15-25 sekund
        </p>
      </div>
    </div>
  );
}
