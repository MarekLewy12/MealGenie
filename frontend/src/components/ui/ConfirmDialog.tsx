import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createFocusTrap, type FocusTrap } from "focus-trap";
import { AlertTriangle, Info, Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";
import { Button } from "./Button";

type ConfirmDialogTone = "danger" | "default";

export type ConfirmDialogProps = {
  cancelLabel?: string;
  children?: ReactNode;
  confirmLabel: string;
  description: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  pendingLabel?: string;
  title: string;
  tone?: ConfirmDialogTone;
};

export function ConfirmDialog({
  cancelLabel = "Anuluj",
  children,
  confirmLabel,
  description,
  isPending = false,
  onCancel,
  onConfirm,
  open,
  pendingLabel = "Przetwarzam...",
  title,
  tone = "default",
}: ConfirmDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const dialogElement = dialogRef.current;
    const focusTrap = createFocusTrap(dialogElement, {
      initialFocus: () => cancelButtonRef.current ?? dialogElement,
      fallbackFocus: () => dialogElement,
      returnFocusOnDeactivate: false,
      escapeDeactivates: false,
      clickOutsideDeactivates: false,
      allowOutsideClick: true,
    });

    focusTrapRef.current = focusTrap;
    focusTrap.activate();

    return () => {
      focusTrap.deactivate({ returnFocus: false });
      focusTrapRef.current = null;
      window.requestAnimationFrame(() => {
        returnFocusRef.current?.focus();
        returnFocusRef.current = null;
      });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onCancel, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.18 }}
        >
          <button
            type="button"
            aria-label="Zamknij potwierdzenie"
            disabled={isPending}
            onClick={onCancel}
            tabIndex={-1}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition dark:bg-black/65"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            tabIndex={-1}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-bg-elevated text-ink shadow-[0_24px_70px_-34px_rgba(32,37,31,0.7),0_1px_0_rgba(255,255,255,0.55)_inset] outline-none dark:border-white/12"
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="px-6 py-6 sm:px-7 sm:py-7">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    tone === "danger"
                      ? "border border-bordeaux/20 bg-bordeaux/10 text-bordeaux"
                      : "border border-accent/20 bg-accent-soft text-accent",
                  )}
                  aria-hidden="true"
                >
                  {tone === "danger" ? (
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Info className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    id="confirm-dialog-title"
                    className="font-brand text-lg font-semibold leading-tight text-ink"
                  >
                    {title}
                  </h2>
                  <p
                    id="confirm-dialog-description"
                    className="mt-1.5 text-sm leading-relaxed text-ink-soft"
                  >
                    {description}
                  </p>
                </div>
              </div>

              {children ? <div className="mt-4">{children}</div> : null}
            </div>

            <div className="flex flex-col gap-2 px-6 pb-6 pt-0 sm:flex-row sm:justify-end sm:px-7">
              <Button
                ref={cancelButtonRef}
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className="w-full sm:w-auto sm:min-w-28"
              >
                {cancelLabel}
              </Button>
              <Button
                variant={tone === "danger" ? "danger" : "primary"}
                onClick={onConfirm}
                disabled={isPending}
                className="w-full sm:w-auto sm:min-w-40"
                leftIcon={
                  isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : undefined
                }
              >
                {isPending ? pendingLabel : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
