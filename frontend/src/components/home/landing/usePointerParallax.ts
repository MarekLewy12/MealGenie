import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PointerEventHandler,
} from "react";

type PointerParallaxOptions = {
  disabled?: boolean;
  maxRotate?: number;
  maxTranslate?: number;
  scale?: number;
  spring?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
  };
};

export function usePointerParallax({
  disabled = false,
  maxRotate = 5,
  maxTranslate = 12,
  scale = 1.015,
  spring,
}: PointerParallaxOptions = {}) {
  const shouldReduceMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const active = useMotionValue(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointerSupport = () => setHasFinePointer(mediaQuery.matches);

    updatePointerSupport();
    mediaQuery.addEventListener("change", updatePointerSupport);

    return () => mediaQuery.removeEventListener("change", updatePointerSupport);
  }, []);

  const motionDisabled = Boolean(disabled || shouldReduceMotion || !hasFinePointer);
  const springConfig = {
    damping: spring?.damping ?? 26,
    mass: spring?.mass ?? 0.42,
    stiffness: spring?.stiffness ?? 180,
  };

  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);
  const smoothActive = useSpring(active, springConfig);

  const x = useTransform(smoothX, [-0.5, 0.5], [-maxTranslate, maxTranslate]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-maxTranslate, maxTranslate]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxRotate, -maxRotate]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxRotate, maxRotate]);
  const scaleValue = useTransform(smoothActive, [0, 1], [1, scale]);

  useEffect(() => {
    if (!motionDisabled) return;

    pointerX.set(0);
    pointerY.set(0);
    active.set(0);
  }, [active, motionDisabled, pointerX, pointerY]);

  const onPointerMove: PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (motionDisabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / rect.width - 0.5;
      const nextY = (event.clientY - rect.top) / rect.height - 0.5;

      pointerX.set(nextX);
      pointerY.set(nextY);
      active.set(1);
    },
    [active, motionDisabled, pointerX, pointerY],
  );

  const onPointerLeave: PointerEventHandler<HTMLElement> = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
    active.set(0);
  }, [active, pointerX, pointerY]);

  const style: MotionStyle = useMemo(
    () =>
      motionDisabled
        ? {}
        : {
            rotateX,
            rotateY,
            scale: scaleValue,
            transformPerspective: 1200,
            x,
            y,
          },
    [motionDisabled, rotateX, rotateY, scaleValue, x, y],
  );

  return {
    isEnabled: !motionDisabled,
    onPointerLeave,
    onPointerMove,
    style,
  };
}
