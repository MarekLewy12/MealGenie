import type { Variants } from "framer-motion";

export const landingEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealViewport = {
  once: true,
  amount: 0.14,
} as const;

export const sectionEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: landingEase,
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
};

export const headingLineEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: landingEase,
    },
  },
};

export const contentStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.52,
      ease: landingEase,
    },
  },
};

export const landingStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const landingFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: landingEase,
    },
  },
};

export const landingSoftScale: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: landingEase,
    },
  },
};

export const landingSectionReveal = sectionEntrance;

export const landingCardPop = cardEntrance;

export const landingLineReveal: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0.35,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.72,
      ease: landingEase,
    },
  },
};
