import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation(threshold = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  return { ref, isInView };
}
