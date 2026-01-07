import { motion } from "framer-motion";
import { ArrowDown, X } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export function PainPointsSection() {
  const { ref, isInView } = useScrollAnimation(0.3);

  const painPoints = [
    {
      emoji: "😫",
      title: "Znowu to samo...",
      description: "Rotacja 5 tych samych dań w kółko",
    },
    {
      emoji: "🤯",
      title: "Zero pomysłów",
      description: "Stoisz przed lodówką i nic nie przychodzi do głowy",
    },
    {
      emoji: "😤",
      title: "Za trudne przepisy",
      description: "Internet pełen dań wymagających 50 składników",
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-slate-50/50 py-20 dark:bg-slate-900/30"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Znasz to uczucie? 🙋
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Codzienne dylematy kuchenne, które rozwiązuje MealGenie
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              className="group relative rounded-2xl border border-red-200/50 bg-white p-6 shadow-lg shadow-red-100/30 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-red-500/20 dark:bg-slate-800/50 dark:shadow-red-900/10"
            >
              <div className="mb-4 text-5xl">{point.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {point.description}
              </p>

              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/20">
                <X className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <ArrowDown className="h-8 w-8 animate-bounce text-indigo-500" />
          <p className="mt-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            MealGenie rozwiązuje wszystkie te problemy ✨
          </p>
        </motion.div>
      </div>
    </section>
  );
}
