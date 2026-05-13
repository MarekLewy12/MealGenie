import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";

import { AppSidebar } from "./AppSidebar";
import { ChatDrawer } from "./ChatDrawer";
import { TopContextBar } from "./TopContextBar";

export function AuthenticatedLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  return (
    <div className="relative flex min-h-0 flex-1 bg-bg text-ink">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-bg-elevated/78 shadow-xs backdrop-blur-xl lg:flex">
        <AppSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopContextBar onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Zamknij menu aplikacji"
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
            />

            <motion.aside
              aria-label="Menu aplikacji"
              className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border bg-bg-elevated shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-end border-b border-border px-3 py-3">
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Zamknij menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-bg-sunken text-ink-soft transition hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 flex-1">
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
