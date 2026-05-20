import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCw, XCircle } from "lucide-react";

import { Button, Eyebrow } from "../ui";
import { viewVariants } from "./wizardMotion";

// ============================================
// View "error" - bordeaux ikona + komunikat + CTA (retry / guest CTA)
// ============================================

type ErrorViewProps = {
  isGuestMode: boolean;
  guestRetryAfterSeconds: number | null;
  errorMessage: string | null;
  onBackToForm: () => void;
  onGuestCta: () => void;
};

export function ErrorView({
  isGuestMode,
  guestRetryAfterSeconds,
  errorMessage,
  onBackToForm,
  onGuestCta,
}: ErrorViewProps) {
  const isGuestLimitReached =
    isGuestMode && guestRetryAfterSeconds !== null;

  return (
    <motion.div
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-2xl space-y-6 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill border border-bordeaux/20 bg-accent-soft text-bordeaux"
      >
        <XCircle className="h-10 w-10" />
      </motion.div>

      <div className="space-y-3">
        <Eyebrow tone="muted">Generator</Eyebrow>
        <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
          {isGuestLimitReached
            ? "Darmowa próba jest już wykorzystana"
            : "Ups! Coś poszło nie tak"}
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-6 text-ink-soft">
          {isGuestLimitReached
            ? `Spróbuj ponownie za około ${formatRetryAfter(guestRetryAfterSeconds!)} albo załóż konto, aby generować bez limitu.`
            : (errorMessage ?? "Nie udało się wygenerować posiłków.")}
        </p>
      </div>

      {isGuestLimitReached ? (
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={onGuestCta}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="rounded-lg"
          >
            Załóż konto
          </Button>
          <Button
            onClick={onBackToForm}
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="rounded-lg"
          >
            Wróć do formularza
          </Button>
        </div>
      ) : (
        <Button
          onClick={onBackToForm}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="rounded-lg"
        >
          Spróbuj ponownie
        </Button>
      )}
    </motion.div>
  );
}

// Helper: formatuje sekundy do "X min" lub "X godz. Y min"
function formatRetryAfter(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${Math.max(1, Math.ceil(seconds / 60))} min`;
  }

  if (minutes === 0) {
    return `${hours} godz.`;
  }

  return `${hours} godz. ${minutes} min`;
}
