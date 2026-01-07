import { motion } from "framer-motion";
import { ChefHat, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function CountUp({
  end,
  duration,
  suffix = "",
}: {
  end: number;
  duration: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),
        1,
      );

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

export function StatsSection() {
  const { ref, isInView } = useScrollAnimation(0.5);

  const stats = [
    { value: 3, suffix: " kroki", label: "Do gotowego planu", icon: ChefHat },
    { value: 15, suffix: " min", label: "Średni czas do kolacji", icon: Clock },
    { value: 100, suffix: "%", label: "Dopasowane do Ciebie", icon: Target },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/60 to-white py-16 dark:from-slate-950 dark:via-indigo-950/25 dark:to-slate-950"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20">
                <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {isInView ? (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
