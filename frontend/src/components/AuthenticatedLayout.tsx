import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createFocusTrap, type FocusTrap } from "focus-trap";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";

import { AppSidebar } from "./AppSidebar";
import { ChatDrawer } from "./ChatDrawer";
import { TopContextBar } from "./TopContextBar";

export function AuthenticatedLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mobileNavDialogRef = useRef<HTMLDivElement | null>(null);
  const mobileNavCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavReturnFocusRef = useRef<HTMLElement | null>(null);
  const mobileNavFocusTrapRef = useRef<FocusTrap | null>(null);

  // Blokuje globalny scrollbar (html) - zalogowany layout uzywa wewnetrznego
  // scrolla w content area. Bez tego pojawiaja sie dwa aktywne scrollbary
  // (html + AuthenticatedLayout content area)
  useEffect(() => {
    const docEl = document.documentElement;
    const prevOverflow = docEl.style.overflow;
    docEl.style.overflow = "hidden";
    return () => {
      docEl.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen || !mobileNavDialogRef.current) return;

    const dialogElement = mobileNavDialogRef.current;
    const focusTrap = createFocusTrap(dialogElement, {
      initialFocus: () => mobileNavCloseButtonRef.current ?? dialogElement,
      fallbackFocus: () => dialogElement,
      returnFocusOnDeactivate: false,
      escapeDeactivates: true,
      allowOutsideClick: true,
      clickOutsideDeactivates: false,
      onDeactivate: () => {
        if (isMobileNavOpen) {
          setIsMobileNavOpen(false);
        }
      },
    });

    mobileNavFocusTrapRef.current = focusTrap;
    focusTrap.activate();

    return () => {
      focusTrap.deactivate({ returnFocus: false });
      mobileNavFocusTrapRef.current = null;
      window.requestAnimationFrame(() => {
        mobileNavReturnFocusRef.current?.focus();
        mobileNavReturnFocusRef.current = null;
      });
    };
  }, [isMobileNavOpen]);

  const openMobileNav = () => {
    mobileNavReturnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsMobileNavOpen(true);
  };

  return (
    <div className="relative flex min-h-0 flex-1 bg-bg text-ink">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-elevated/78 shadow-xs backdrop-blur-xl lg:flex">
        <AppSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopContextBar onOpenMobileNav={openMobileNav} />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            ref={mobileNavDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu aplikacji"
            tabIndex={-1}
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
          >
            <button
              type="button"
              aria-label="Zamknij menu aplikacji"
              onClick={() => setIsMobileNavOpen(false)}
              tabIndex={-1}
              className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
            />

            <motion.aside
              aria-label="Menu aplikacji"
              className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border bg-bg-elevated shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex justify-end border-b border-border px-3 py-3">
                <button
                  ref={mobileNavCloseButtonRef}
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Zamknij menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-bg-sunken text-ink-soft transition hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <AppSidebar onNavigate={() => setIsMobileNavOpen(false)} />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatDrawer />
    </div>
  );
}
