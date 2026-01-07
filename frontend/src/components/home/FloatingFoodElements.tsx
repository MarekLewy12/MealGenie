import { motion } from "framer-motion";

export function FloatingFoodElements() {
  const foods = [
    { emoji: "🥑", size: "text-5xl", top: "12%", left: "6%", delay: 0 },
    { emoji: "🍳", size: "text-4xl", top: "22%", right: "10%", delay: 0.5 },
    { emoji: "🥗", size: "text-6xl", bottom: "32%", left: "4%", delay: 1 },
    { emoji: "🍝", size: "text-4xl", top: "58%", right: "6%", delay: 1.5 },
    { emoji: "🥘", size: "text-5xl", bottom: "18%", right: "14%", delay: 2 },
    { emoji: "🧀", size: "text-3xl", top: "38%", left: "14%", delay: 0.8 },
    { emoji: "🍅", size: "text-4xl", bottom: "42%", left: "20%", delay: 1.2 },
    { emoji: "🥕", size: "text-4xl", top: "8%", right: "28%", delay: 0.3 },
    { emoji: "🍤", size: "text-3xl", bottom: "12%", left: "30%", delay: 1.7 },
    { emoji: "🥦", size: "text-4xl", top: "30%", left: "32%", delay: 2.1 },
    { emoji: "🍋", size: "text-3xl", bottom: "28%", right: "28%", delay: 1.1 },
    { emoji: "🍓", size: "text-4xl", top: "68%", left: "10%", delay: 2.4 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {foods.map((food, i) => (
        <motion.div
          key={i}
          className={`absolute ${food.size} opacity-25 dark:opacity-15`}
          style={{
            top: food.top,
            left: food.left,
            right: food.right,
            bottom: food.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            delay: food.delay,
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {food.emoji}
        </motion.div>
      ))}
    </div>
  );
}
