import type { Variants } from "framer-motion";

export const landingEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealViewport = {
  once: true,
  amount: 0.24,
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
      duration: 0.78,
      ease: landingEase,
      staggerChildren: 0.12,
      delayChildren: 0.06,
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
      duration: 0.64,
      ease: landingEase,
    },
  },
};

export const contentStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
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
      duration: 0.68,
      ease: landingEase,
    },
  },
};

export const landingStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
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
      duration: 0.62,
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
      duration: 0.64,
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

export const showcaseTabEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: landingEase,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: {
      duration: 0.28,
      ease: landingEase,
    },
  },
};

export const bentoCardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: landingEase,
    },
  },
};

export const pulseConnector: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: landingEase,
    },
  },
};
