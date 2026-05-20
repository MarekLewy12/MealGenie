import type { Variants } from "framer-motion";

// ============================================
// Direction-aware slide miedzy krokami
// custom = 1 (forward), -1 (backward)
// ============================================

export const slideVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 30 : -30,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    transition: { duration: 0.22, ease: [0.65, 0, 0.35, 1] },
  }),
};

export const wizardStepLayoutTransition = {
  layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

// ============================================
// Pop-in fade dla elementów preview panelu
// (uzywany gdy user zmienia wartosc - akcent flash)
// ============================================

export const previewItemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

// Animacja "flash" gdy wartosc sie zmienia (scale pulse + accent glow)
export const previewFlashTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

// ============================================
// View transitions: form -> loading -> success / error
// ============================================

export const viewVariants: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export const successStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const successItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const successIconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};
