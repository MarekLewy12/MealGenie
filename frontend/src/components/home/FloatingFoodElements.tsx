import { motion } from "framer-motion";

export function FloatingFoodElements() {
  const foods = [
    { emoji: "🥑", size: "text-4xl", top: "15%", left: "8%", delay: 0 },
    { emoji: "🍳", size: "text-3xl", top: "25%", right: "12%", delay: 0.5 },
    { emoji: "🥗", size: "text-5xl", bottom: "30%", left: "5%", delay: 1 },
    { emoji: "🍝", size: "text-3xl", top: "60%", right: "8%", delay: 1.5 },
    { emoji: "🥘", size: "text-4xl", bottom: "20%", right: "15%", delay: 2 },
    { emoji: "🧀", size: "text-2xl", top: "40%", left: "12%", delay: 0.8 },
    { emoji: "🍅", size: "text-3xl", bottom: "40%", left: "18%", delay: 1.2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {foods.map((food, i) => (
        <motion.div
          key={i}
          className={`absolute ${food.size} opacity-35 dark:opacity-25`}
          style={{
            top: food.top,
            left: food.left,
            right: food.right,
            bottom: food.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
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
