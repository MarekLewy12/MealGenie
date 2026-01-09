import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChefHat, Flame, BookOpen } from "lucide-react";

const loadingStages = [
  { icon: Sparkles, text: "Analizuję składniki...", color: "text-amber-400" },
  {
    icon: Flame,
    text: "Przygotowuję instrukcje...",
    color: "text-orange-400",
  },
  { icon: BookOpen, text: "Finalizuję przepis...", color: "text-emerald-400" },
];

const floatingIngredients = ["🥕", "🍅", "🧄", "🌿", "🧈", "🍋", "🫒", "🧅"];

export function RecipeLoadingAnimation() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % loadingStages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentStage = loadingStages[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-fuchsia-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIngredients.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-40"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top: `${15 + (i * 13) % 70}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1,
              }}
            >
              <motion.div
                className="absolute"
                style={{
                  x: 60,
                  y: 0,
                }}
              >
                <Sparkles className="h-5 w-5 text-amber-400" />
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-2xl shadow-purple-500/30"
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(168, 85, 247, 0.3)",
                "0 25px 50px -12px rgba(168, 85, 247, 0.6)",
                "0 25px 50px -12px rgba(168, 85, 247, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChefHat className="h-14 w-14 text-white" />
          </motion.div>
        </motion.div>

        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={`rounded-full bg-white/10 p-2 ${currentStage.color}`}
              >
                <StageIcon className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                {currentStage.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
          Nasz AI szef kuchni przygotowuje dla Ciebie szczegółowy przepis...
        </p>
      </div>
    </div>
  );
}
