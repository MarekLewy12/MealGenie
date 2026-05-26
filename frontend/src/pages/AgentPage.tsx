import {
  type ElementType,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChefHat,
  ListChecks,
  Loader2,
  MessageSquareText,
  Scale,
  Send,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge, Button, HandwrittenKicker } from "../components/ui";
import { useAgentSession } from "../hooks/useAgentSession";
import { useAuthStore } from "../store/authStore";
import { notify } from "../store/notificationStore";
import type { AgentStep } from "../types/agent";
import { cn } from "../utils/cn";

const starterPrompts = [
  "Ryż, jajka i 20 minut. Co zrobimy?",
  "Sycąca kolacja z listą zakupów.",
  "Obiad bez mięsa na dziś.",
  "Resztki warzyw, zero marnowania.",
];

export function AgentPage() {
  const [draft, setDraft] = useState("");
  const agent = useAgentSession();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const redirectedMealIdRef = useRef<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const hasConversation = agent.messages.length > 0;
  const isBusy = agent.isSending || agent.isExecuting;
  const shouldShowCanvas = hasConversation || Boolean(agent.plan);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [agent.messages.length, agent.steps.length, shouldReduceMotion]);

  useEffect(() => {
    const mealHistoryId = agent.executeResult?.mealHistoryId;

    if (!mealHistoryId || redirectedMealIdRef.current === mealHistoryId) {
      return;
    }

    redirectedMealIdRef.current = mealHistoryId;
    notify.success("Plan wykonany! Przepis jest gotowy.", "Agent MealGenie");
    navigate(`/recipe/${mealHistoryId}`);
  }, [agent.executeResult?.mealHistoryId, navigate]);

  useEffect(() => {
    const input = messageInputRef.current;
    if (!input) return;

    const previousHeight = input.offsetHeight;
    input.style.height = "auto";
    const nextHeight = input.scrollHeight;

    if (previousHeight !== nextHeight) {
      input.style.height = `${previousHeight}px`;
      window.requestAnimationFrame(() => {
        input.style.height = `${nextHeight}px`;
      });
      return;
    }

    input.style.height = `${nextHeight}px`;
  }, [draft]);

  const submitDraft = () => {
    const message = draft.trim();
    if (!message || isBusy) return;

    setDraft("");
    void agent.submitMessage(message);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitDraft();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    submitDraft();
  };

  const handleStarterPrompt = (prompt: string) => {
    if (isBusy) return;

    setDraft("");
    void agent.submitMessage(prompt);
  };

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-bg text-ink">
      {/* MAGIA AI W TLE - AURORA */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-[-10%] top-[-5%] h-[40rem] w-[40rem] rounded-full bg-accent/15 blur-[100px] dark:bg-accent/10" />
        <div className="absolute right-[-5%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-saffron/15 blur-[100px] dark:bg-saffron/10" />
        <div className="absolute bottom-[-10%] left-[20%] h-[40rem] w-[40rem] rounded-full bg-basil/15 blur-[100px] dark:bg-basil/10" />
      </div>

      <motion.div
        layout
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.36,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "mx-auto flex min-h-0 w-full flex-1 flex-col gap-6 px-4 pb-0 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6",
          shouldShowCanvas
            ? "max-w-screen-2xl lg:flex-row lg:items-stretch lg:gap-8"
            : "max-w-7xl 2xl:max-w-[92rem]",
        )}
      >
        <main className="relative z-10 flex min-h-0 flex-1 flex-col lg:h-full">
          <div
            className={cn(
              "flex-1 overflow-y-auto px-1 sm:px-2 lg:px-4",
              hasConversation ? "pt-6" : "pt-0",
            )}
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!hasConversation ? (
                <motion.div
                  key="agent-empty-state"
                  className="h-full"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -12, scale: 0.98 }
                  }
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AgentEmptyState onSelectPrompt={handleStarterPrompt} />
                </motion.div>
              ) : (
                <motion.div
                  key="agent-conversation"
                  className="flex flex-col gap-6 pb-6"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                {agent.messages.map((message, index) => (
                  <motion.div
                    key={`${message.createdAt}-${index}`}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "flex w-full",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div className="flex max-w-[85%] items-end gap-3 sm:max-w-[75%]">
                      {message.role === "assistant" ? (
                        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent sm:flex">
                          <Bot className="h-4 w-4" aria-hidden="true" />
                        </div>
                      ) : null}

                      <div
                        className={cn(
                          "px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                          message.role === "user"
                            ? "rounded-2xl rounded-br-sm bg-accent text-white shadow-[0_8px_24px_-12px_rgba(232,111,69,0.5)]"
                            : "rounded-2xl rounded-bl-sm border border-border/50 bg-bg-elevated/80 text-ink shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]",
                        )}
                      >
                        {message.role === "user" ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-p:my-0 prose-p:leading-relaxed prose-strong:text-ink prose-ul:my-2 prose-li:my-0 dark:prose-invert">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {agent.steps.length > 0 ? (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-0 sm:ml-11"
                  >
                    <AgentTimeline steps={agent.steps} />
                  </motion.div>
                ) : null}

                {agent.isSending ? (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start sm:ml-11"
                  >
                    <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-bg-elevated px-4 py-3 shadow-sm">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                ) : null}

                {agent.error && !agent.isExecuting ? (
                  <div className="ml-0 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm font-medium text-bordeaux sm:ml-11">
                    {agent.error.message}
                  </div>
                ) : null}

                <div ref={messagesEndRef} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0 px-4 pb-8 pt-6 sm:px-6 sm:pt-7 lg:px-8">
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[2rem] border border-accent/45 bg-bg-elevated/90 p-2 shadow-[0_16px_42px_-24px_rgba(32,37,31,0.34),0_0_0_1px_rgba(255,255,255,0.55)_inset,0_0_34px_-24px_rgba(232,111,69,0.5)] backdrop-blur-xl transition-all focus-within:border-accent/80 focus-within:shadow-[0_18px_46px_-24px_rgba(32,37,31,0.38),0_0_0_1px_rgba(255,255,255,0.68)_inset,0_0_0_4px_rgba(232,111,69,0.16),0_0_40px_-22px_rgba(232,111,69,0.75)] dark:border-accent/35 dark:bg-black/55 dark:shadow-[0_16px_42px_-24px_rgba(0,0,0,0.78),0_0_0_1px_rgba(255,255,255,0.08)_inset,0_0_34px_-24px_rgba(232,138,74,0.55)] xl:max-w-4xl"
            >
              <label htmlFor="agent-message" className="sr-only">
                Wiadomość do Agenta
              </label>
              <textarea
                ref={messageInputRef}
                id="agent-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasConversation ? "Napisz odpowiedź..." : "O czym dziś myślisz?"
                }
                rows={1}
                disabled={isBusy}
                className="agent-message-input min-h-11 flex-1 resize-none overflow-hidden bg-transparent px-3 py-2.5 text-sm leading-6 text-ink outline-none transition-[height] duration-200 ease-out placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isBusy}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent p-0 text-ink-inverse shadow-accent transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-ink-disabled disabled:shadow-none"
              >
                {agent.isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-5 w-5 translate-x-px" aria-hidden="true" />
                )}
                <span className="sr-only">Wyślij</span>
              </button>
            </form>
          </div>
        </main>

        <AnimatePresence initial={false}>
          {shouldShowCanvas ? (
            <motion.div
              key="agent-canvas-column"
              layout
              initial={
                shouldReduceMotion ? false : { opacity: 0, x: 28, scale: 0.98 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 18, scale: 0.98 }
              }
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="w-full shrink-0 lg:h-full lg:w-[26rem] xl:w-[28rem]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {agent.plan ? (
                  <PlanCanvas
                    canExecute={agent.canExecute}
                    error={agent.isExecuting ? agent.error?.message : null}
                    isExecuting={agent.isExecuting}
                    plan={agent.plan}
                    shouldReduceMotion={shouldReduceMotion}
                    onExecute={() =>
                      void agent.executePlan([
                        "create_recipe",
                        "populate_shopping_list",
                      ])
                    }
                  />
                ) : (
                  <PlanPlaceholder shouldReduceMotion={shouldReduceMotion} />
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function AgentEmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center pb-6 pt-2 text-center sm:pb-8 2xl:max-w-[86rem]">
      <div className="pointer-events-none absolute inset-y-4 left-0 right-0 -z-10 hidden xl:block">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-8 top-[8%] text-accent/30 dark:text-accent/30 2xl:left-12"
        >
          <Sparkles className="h-10 w-10" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute right-8 top-[14%] text-saffron/40 dark:text-saffron/40 2xl:right-12"
        >
          <Bot className="h-12 w-12" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[8%] left-12 text-basil/30 dark:text-basil/30 2xl:left-20"
        >
          <Wand2 className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, 8, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute bottom-[14%] right-12 text-accent/30 dark:text-accent/30 2xl:right-20"
        >
          <ChefHat className="h-9 w-9" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
          className="absolute left-6 top-[46%] text-saffron/30 dark:text-saffron/30 2xl:left-16"
        >
          <ListChecks className="h-7 w-7" aria-hidden="true" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], scale: [1, 0.94, 1] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.2,
          }}
          className="absolute right-6 top-[50%] text-basil/30 dark:text-basil/30 2xl:right-16"
        >
          <ShoppingBasket className="h-8 w-8" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl animate-fade-in-up flex-col items-center">
        <HandwrittenKicker className="mb-4 text-xl text-accent/80 sm:text-2xl">
          twój osobisty planer
        </HandwrittenKicker>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent shadow-sm ring-4 ring-bg-sunken/50">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* PERSONALIZOWANE POWITANIE */}
        <h2 className="text-balance font-serif text-4xl font-medium leading-tight sm:text-5xl">
          Cześć
          {firstName ? (
            <>
              {" "}
              <span className="text-summary-gradient">{firstName}</span>
            </>
          ) : null}
          , w czym mogę Ci dziś pomóc?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          <span className="font-brand text-lg font-semibold text-accent-deep dark:text-accent-hover">
            Nie musisz wypełniać formularzy.
          </span>
          <br />
          <span>
            Powiedz mi, co masz w lodówce, ile masz czasu albo na co masz
            ochotę.
          </span>
        </p>

        <div className="mx-auto mt-10 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="group flex items-center justify-between rounded-2xl border border-border/50 bg-bg-elevated/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/50 hover:bg-bg-elevated hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="pr-4 text-sm font-medium leading-relaxed text-ink transition-colors group-hover:text-accent-deep dark:group-hover:text-accent-hover">
                {prompt}
              </span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-sunken transition-colors group-hover:bg-accent-soft dark:bg-white/5 dark:group-hover:bg-accent/20">
                <ArrowRight
                  className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent dark:text-ink-soft dark:group-hover:text-accent-hover"
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 flex w-full max-w-3xl flex-col items-center border-t border-border/50 pb-3 pt-8 sm:pb-5">
          <p className="mb-6 font-brand text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
            Co potrafię dla Ciebie zrobić
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 rounded-full border border-accent/25 bg-bg-elevated/70 px-4 py-2 text-sm font-medium text-ink-soft shadow-[0_10px_26px_-20px_rgba(32,37,31,0.35)] backdrop-blur-md dark:border-white/12 dark:bg-black/25 dark:text-ink-soft">
              <ShoppingBasket className="h-4 w-4 text-accent" aria-hidden="true" />
              Zrobię listę brakujących zakupów
            </div>
            <div className="flex items-center gap-2 rounded-full border border-basil/25 bg-bg-elevated/70 px-4 py-2 text-sm font-medium text-ink-soft shadow-[0_10px_26px_-20px_rgba(32,37,31,0.35)] backdrop-blur-md dark:border-white/12 dark:bg-black/25 dark:text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-basil" aria-hidden="true" />
              Dopilnuję Twoich alergii
            </div>
            <div className="flex items-center gap-2 rounded-full border border-saffron/35 bg-bg-elevated/70 px-4 py-2 text-sm font-medium text-ink-soft shadow-[0_10px_26px_-20px_rgba(32,37,31,0.35)] backdrop-blur-md dark:border-white/12 dark:bg-black/25 dark:text-ink-soft">
              <Scale className="h-4 w-4 text-saffron" aria-hidden="true" />
              Przeliczę każdą gramaturę
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentTimeline({ steps }: { steps: AgentStep[] }) {
  const visibleSteps = steps.filter((step) => step.status !== "pending");

  if (visibleSteps.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-bg-sunken/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        <span className="font-brand text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
          Co sprawdziłem
        </span>
      </div>
      <div className="grid gap-3">
        {visibleSteps.map((step, index) => {
          const isSuccess = step.status === "succeeded";
          const isRunning = step.status === "running";
          const isError = step.status === "failed";

          return (
            <div key={`${step.key}-${index}`} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                {isSuccess ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-basil-soft text-basil">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                ) : isError ? (
                  <div className="h-2 w-2 rounded-full bg-bordeaux" />
                ) : isRunning ? (
                  <div className="h-2 w-2 animate-ping rounded-full bg-accent" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                )}
              </div>
              <div className="min-w-0">
                <span
                  className={cn(
                    "font-medium",
                    isError ? "text-bordeaux" : "text-ink",
                  )}
                >
                  {step.label}
                </span>
                {step.summary ? (
                  <span className="mt-0.5 block text-xs text-ink-soft">
                    {step.summary}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanCanvas({
  canExecute,
  error,
  isExecuting,
  onExecute,
  plan,
  shouldReduceMotion,
}: {
  canExecute: boolean;
  error: string | null;
  isExecuting: boolean;
  onExecute: () => void;
  plan: NonNullable<ReturnType<typeof useAgentSession>["plan"]>;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.aside
      key="plan-ready"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[32rem] flex-col overflow-hidden rounded-[24px] border border-border bg-bg-elevated shadow-[0_12px_32px_-12px_rgba(32,37,31,0.1)] lg:h-full"
      aria-label="Plan Agenta"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[60px]"
        aria-hidden="true"
      />

      <div className="relative border-b border-border bg-bg-sunken/40 px-6 py-5">
        <Badge variant="accent">Plan gotowy</Badge>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink">
          {plan.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {plan.summary}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid gap-6 text-sm">
          <PlanSection title="Uzasadnienie" icon={MessageSquareText}>
            <p className="leading-relaxed">{plan.rationale}</p>
          </PlanSection>

          <PlanSection title="Baza dania" icon={ChefHat}>
            {plan.usedIngredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plan.usedIngredients.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-basil/20 bg-basil-soft px-3 py-1 text-xs font-semibold text-basil"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-ink-muted">Agent nie wskazał bazy dania.</p>
            )}
          </PlanSection>

          <PlanSection title="Do kupienia" icon={ShoppingBasket}>
            {plan.shoppingDraft.length > 0 ? (
              <ul className="space-y-2">
                {plan.shoppingDraft.map((item) => (
                  <li
                    key={`${item.name}-${item.unit ?? ""}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-bg-sunken px-3 py-2.5 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="font-medium text-ink">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-ink-muted">
                      {item.quantity} {item.unit ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-ink-muted">Masz wszystko, co potrzebne!</p>
            )}
          </PlanSection>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm font-medium text-bordeaux">
            {error}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border bg-bg-elevated p-5">
        <Button
          type="button"
          disabled={!canExecute || isExecuting}
          rightIcon={
            isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )
          }
          className="w-full py-3.5 shadow-accent"
          onClick={onExecute}
        >
          {isExecuting ? "Gotuję przepis..." : "Akceptuję - przygotuj przepis"}
        </Button>
      </div>
    </motion.aside>
  );
}

function PlanPlaceholder({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.aside
      key="plan-placeholder"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[24rem] flex-col items-center justify-center rounded-[24px] border border-transparent bg-gradient-to-br from-bg-elevated/40 to-transparent p-8 text-center shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] backdrop-blur-sm dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] lg:min-h-[32rem]"
    >
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-accent/15 blur-xl" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-bg-elevated text-accent shadow-sm">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h3 className="font-brand text-lg font-semibold text-ink">
        Canvas planu
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
        Porozmawiaj z Agentem. Gdy zbierze wystarczająco dużo informacji,
        przygotuje tutaj dla Ciebie konkretny plan do akceptacji.
      </p>
    </motion.aside>
  );
}

function PlanSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        <h3 className="font-brand text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
          {title}
        </h3>
      </div>
      <div className="text-ink-soft">{children}</div>
    </section>
  );
}
