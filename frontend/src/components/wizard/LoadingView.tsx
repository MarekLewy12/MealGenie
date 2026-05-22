import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, ImageIcon, Sparkles, Utensils } from "lucide-react";

import { viewVariants } from "./wizardMotion";

const culinaryFacts = [
  "Miód jest jedynym jedzeniem na świecie, które nigdy się nie psuje.",
  "Pomidory były kiedyś uważane w Europie za trujące, bo zaliczano je do psiankowatych.",
  "Szafran jest najdroższą przyprawą - zbiera się go wyłącznie ręcznie z kwiatów krokusa.",
  "Awokado to z botanicznego punktu widzenia... jagoda!",
  "Ser został odkryty przypadkowo ponad 4000 lat temu na Bliskim Wschodzie.",
  "Marchew pierwotnie była fioletowa, pomarańczowa odmiana powstała znacznie później.",
  "Truskawki są jedynymi owocami, które mają nasiona na zewnątrz.",
  "Czekolada była kiedyś używana jako waluta przez imperium Azteków.",
  "Czosnek, mimo swojego smaku, należy do tej samej rodziny roślin co lilia.",
];

const loadingPhases = [
  {
    text: "Analizuję Twoje preferencje i składniki...",
    icon: Sparkles,
    time: 0,
  },
  {
    text: "Opracowuję 3 idealne kompozycje smakowe...",
    icon: Utensils,
    time: 5000,
  },
  {
    text: "Rozpisuję parametry, makro i czasy gotowania...",
    icon: ChefHat,
    time: 12000,
  },
  {
    text: "Wywołuję sztuczną inteligencję do zdjęć...",
    icon: ImageIcon,
    time: 18000,
  },
  {
    text: "Generuję fotorealistyczne obrazy dań...",
    icon: ImageIcon,
    time: 26000,
  },
  {
    text: "Dogrywam ostatnie szczegóły kompozycji...",
    icon: Sparkles,
    time: 35000,
  },
];

const floatingElements = [
  {
    emoji: "🍅",
    top: "10%",
    left: "5%",
    delay: 0,
    duration: 15,
    size: "text-2xl",
    blur: "blur-sm",
    opacity: "opacity-15 dark:opacity-20",
    yMap: [0, -20, 10, 0],
    xMap: [0, 15, -10, 0],
    rotateMap: [0, 20, -10, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🌿",
    top: "40%",
    right: "8%",
    delay: 2,
    duration: 18,
    size: "text-xl",
    blur: "blur-[2px]",
    opacity: "opacity-20",
    yMap: [0, 25, -15, 0],
    xMap: [0, -10, 20, 0],
    rotateMap: [0, -30, 20, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🧅",
    top: "70%",
    left: "12%",
    delay: 1,
    duration: 16,
    size: "text-3xl",
    blur: "blur-sm",
    opacity: "opacity-10 dark:opacity-15",
    yMap: [0, -15, 20, 0],
    xMap: [0, 20, -15, 0],
    rotateMap: [0, 40, -10, 0],
    scaleMap: [0.95, 1.05, 0.95],
  },
  {
    emoji: "🧄",
    top: "85%",
    right: "15%",
    delay: 3,
    duration: 14,
    size: "text-2xl",
    blur: "blur-[1px]",
    opacity: "opacity-20",
    yMap: [0, -20, 15, 0],
    xMap: [0, -15, 10, 0],
    rotateMap: [0, -20, 15, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🥑",
    top: "25%",
    right: "18%",
    delay: 0.5,
    duration: 12,
    size: "text-3xl",
    blur: "blur-[1px]",
    opacity: "opacity-25",
    yMap: [0, -25, 15, 0],
    xMap: [0, -15, 10, 0],
    rotateMap: [0, -15, 20, 0],
    scaleMap: [1.05, 0.95, 1.05],
  },
  {
    emoji: "🥕",
    top: "55%",
    left: "20%",
    delay: 1.5,
    duration: 13,
    size: "text-4xl",
    blur: "blur-[1px]",
    opacity: "opacity-20",
    yMap: [0, 20, -20, 0],
    xMap: [0, 20, -10, 0],
    rotateMap: [0, 30, -15, 0],
    scaleMap: [0.95, 1.1, 0.95],
  },
  {
    emoji: "🍄",
    top: "15%",
    right: "35%",
    delay: 2.5,
    duration: 11,
    size: "text-2xl",
    blur: "blur-0",
    opacity: "opacity-30",
    yMap: [0, -15, 10, 0],
    xMap: [0, 10, -15, 0],
    rotateMap: [0, -20, 10, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🌶️",
    top: "45%",
    right: "3%",
    delay: 1,
    duration: 9,
    size: "text-5xl",
    blur: "blur-0",
    opacity: "opacity-30 dark:opacity-40",
    yMap: [0, 30, -15, 0],
    xMap: [0, -20, 15, 0],
    rotateMap: [0, 25, -20, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🍋",
    top: "80%",
    left: "3%",
    delay: 0,
    duration: 10,
    size: "text-5xl",
    blur: "blur-0",
    opacity: "opacity-25 dark:opacity-30",
    yMap: [0, -25, 15, 0],
    xMap: [0, 20, -15, 0],
    rotateMap: [0, -30, 15, 0],
    scaleMap: [1, 1.1, 1],
  },
  {
    emoji: "🥦",
    top: "30%",
    left: "4%",
    delay: 2,
    duration: 9.5,
    size: "text-4xl",
    blur: "blur-0",
    opacity: "opacity-30 dark:opacity-40",
    yMap: [0, -20, 20, 0],
    xMap: [0, -15, 20, 0],
    rotateMap: [0, 15, -15, 0],
    scaleMap: [1, 1.05, 1],
  },
  {
    emoji: "🧀",
    top: "65%",
    right: "25%",
    delay: 1.2,
    duration: 10.5,
    size: "text-3xl",
    blur: "blur-0",
    opacity: "opacity-25",
    yMap: [0, 20, -15, 0],
    xMap: [0, 15, -20, 0],
    rotateMap: [0, -20, 25, 0],
    scaleMap: [0.95, 1.05, 0.95],
  },
  {
    emoji: "🥖",
    top: "5%",
    left: "25%",
    delay: 3,
    duration: 14,
    size: "text-3xl",
    blur: "blur-sm",
    opacity: "opacity-20",
    yMap: [0, -15, 20, 0],
    xMap: [0, 10, -15, 0],
    rotateMap: [0, 20, -10, 0],
    scaleMap: [1, 1.05, 1],
  },
];

export function LoadingView() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const activePhase = loadingPhases[activePhaseIndex];
  const ActiveIcon = activePhase.icon;

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % culinaryFacts.length);
    }, 6000);

    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    const phaseInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextPhaseIndex = loadingPhases.reduce(
        (latestIndex, phase, index) =>
          elapsed >= phase.time ? index : latestIndex,
        0,
      );

      setActivePhaseIndex((prev) =>
        prev === nextPhaseIndex ? prev : nextPhaseIndex,
      );
    }, 500);

    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    const slowGenerationTimer = setTimeout(() => {
      setIsTakingLong(true);
    }, 45_000);

    return () => clearTimeout(slowGenerationTimer);
  }, []);

  return (
    <motion.div
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex min-h-[65vh] flex-col items-center justify-center px-4 py-12 lg:py-20"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block"
        aria-hidden="true"
      >
        {floatingElements.map((element, index) => (
          <motion.div
            key={`${element.emoji}-${index}`}
            className={`absolute drop-shadow-sm grayscale-[0.1] ${element.size} ${element.blur} ${element.opacity}`}
            style={{
              top: element.top,
              left: "left" in element ? element.left : undefined,
              right: "right" in element ? element.right : undefined,
            }}
            animate={{
              y: element.yMap,
              x: element.xMap,
              rotate: element.rotateMap,
              scale: element.scaleMap,
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative mb-12 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
          <div
            aria-hidden="true"
            className="hero-card-border-flow absolute inset-0 rounded-full opacity-100"
          />
          <div
            aria-hidden="true"
            className="hero-card-border-glow absolute inset-[-12px] rounded-full opacity-60 blur-xl"
          />
          <div className="absolute inset-1 rounded-full bg-bg-elevated" />

          <motion.div
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink-inverse shadow-[var(--shadow-accent)] sm:h-24 sm:w-24"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChefHat className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="mb-8 min-h-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhaseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2.5"
            >
              <ActiveIcon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-brand text-lg font-semibold text-ink sm:text-xl">
                {activePhase.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-10 w-full max-w-sm sm:max-w-md">
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-saffron"
              initial={{ width: "2%" }}
              animate={{ width: "98%" }}
              transition={{ duration: 42, ease: "easeOut" }}
            />
          </div>
          {isTakingLong && (
            <p className="mt-3 text-center text-sm leading-6 text-ink-soft">
              To trwa dłużej niż zwykle, ale nadal pracuję nad propozycjami.
            </p>
          )}
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-bg-elevated/40 p-6 shadow-sm backdrop-blur-md dark:bg-white/[0.03] sm:p-8">
          <p className="mb-3 text-center font-brand text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Czy wiesz, że...
          </p>
          <div className="relative h-[4.5rem] sm:h-[3.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center text-center"
              >
                <p className="font-serif text-lg font-medium leading-snug text-ink-soft sm:text-xl">
                  {culinaryFacts[currentFactIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
