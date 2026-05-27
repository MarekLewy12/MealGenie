import {
  type ElementType,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
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
import type {
  AgentMessage,
  AgentPlanRevisionSection,
  AgentStep,
} from "../types/agent";
import { cn } from "../utils/cn";

const starterPrompts = [
  "Ryż, jajka i 20 minut. Co zrobimy?",
  "Sycąca kolacja z listą zakupów.",
  "Obiad bez mięsa na dziś.",
  "Resztki warzyw, zero marnowania.",
];

const STEP_PACE_MS = 680;

const shoppingUnitLabels: Record<string, string> = {
  tbsp: "łyżka",
  "tbsp.": "łyżka",
  tbs: "łyżka",
  tablespoon: "łyżka",
  tablespoons: "łyżka",
  tsp: "łyżeczka",
  "tsp.": "łyżeczka",
  teaspoon: "łyżeczka",
  teaspoons: "łyżeczka",
  pinch: "szczypta",
  pinches: "szczypta",
  pcs: "szt.",
  "pcs.": "szt.",
  pc: "szt.",
  "pc.": "szt.",
  piece: "szt.",
  pieces: "szt.",
  pack: "opak.",
  package: "opak.",
  packages: "opak.",
};

function getMessageKey(message: AgentMessage, index: number) {
  return `${message.role}-${index}-${message.content}`;
}

function formatShoppingUnit(unit?: string | null) {
  if (!unit) {
    return "";
  }

  const normalized = unit.trim().toLowerCase().replace(/\s+/g, " ");
  return shoppingUnitLabels[normalized] ?? unit;
}

function formatShoppingAmount(quantity: number, unit?: string | null) {
  return [quantity, formatShoppingUnit(unit)].filter(Boolean).join(" ");
}

function usePacedAgentSteps({
  runId,
  shouldReduceMotion,
  steps,
}: {
  runId: string | null;
  shouldReduceMotion: boolean | null;
  steps: AgentStep[];
}) {
  const [paceIndex, setPaceIndex] = useState(-1);
  const [pacedRunId, setPacedRunId] = useState<string | null>(null);
  const stepsSignature = steps
    .map((step) => `${step.key}:${step.status}`)
    .join("|");

  useEffect(() => {
    if (!runId || steps.length === 0) {
      const timeoutId = window.setTimeout(() => {
        setPaceIndex(-1);
        setPacedRunId(runId);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    if (runId !== pacedRunId) {
      const timeoutId = window.setTimeout(() => {
        setPacedRunId(runId);
        setPaceIndex(shouldReduceMotion ? steps.length - 1 : 0);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [pacedRunId, runId, shouldReduceMotion, steps.length]);

  useEffect(() => {
    if (shouldReduceMotion || paceIndex < 0 || paceIndex >= steps.length - 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPaceIndex((current) => Math.min(current + 1, steps.length - 1));
    }, STEP_PACE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [paceIndex, shouldReduceMotion, steps.length, stepsSignature]);

  useEffect(() => {
    if (
      !shouldReduceMotion &&
      steps[0]?.status === "running" &&
      paceIndex > 0
    ) {
      const timeoutId = window.setTimeout(() => setPaceIndex(0), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [paceIndex, shouldReduceMotion, stepsSignature, steps]);

  const pacedSteps = useMemo(() => {
    if (shouldReduceMotion || paceIndex < 0) {
      return steps;
    }

    return steps.map((step, index) => {
      if (index > paceIndex) {
        return { ...step, status: "pending" as const };
      }

      if (
        index === paceIndex &&
        index < steps.length - 1 &&
        step.status === "succeeded"
      ) {
        return { ...step, status: "running" as const };
      }

      return step;
    });
  }, [paceIndex, shouldReduceMotion, steps]);

  return {
    isPacing:
      !shouldReduceMotion &&
      steps.length > 0 &&
      paceIndex >= 0 &&
      paceIndex < steps.length - 1,
    steps: pacedSteps,
  };
}

export function AgentPage() {
  const [draft, setDraft] = useState("");
  const [mobileTab, setMobileTab] = useState<"chat" | "plan">("chat");
  const agent = useAgentSession();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const redirectedMealIdRef = useRef<string | null>(null);
  const prevPlanRef = useRef<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const hasConversation = agent.messages.length > 0;
  const isBusy = agent.isBusy;
  const { isPacing: isPacingSteps, steps: pacedSteps } = usePacedAgentSteps({
    runId: agent.runId,
    steps: agent.steps,
    shouldReduceMotion,
  });
  const premiumEase = [0.16, 1, 0.3, 1] as const;
  const layoutTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.72, ease: premiumEase };

  useEffect(() => {
    if (agent.plan && !prevPlanRef.current) {
      prevPlanRef.current = true;
      const timeoutId = window.setTimeout(() => setMobileTab("plan"), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [agent.plan]);

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

  const handleRestartFromError = () => {
    const lastUserMessage = [...agent.messages]
      .reverse()
      .find((message) => message.role === "user");

    agent.resetSession();
    setDraft(lastUserMessage?.content ?? "");
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

      {hasConversation ? (
        <div className="relative z-20 shrink-0 border-b border-border bg-bg-elevated/80 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-lg px-4">
            {[
              { key: "chat", label: "Rozmowa", icon: MessageSquareText },
              { key: "plan", label: "Plan", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMobileTab(key as "chat" | "plan")}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors",
                  mobileTab === key
                    ? "text-accent"
                    : "text-ink-muted hover:text-ink-soft",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {mobileTab === key ? (
                  <motion.div
                    layoutId="agent-tab-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-accent"
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
                {key === "plan" && agent.plan && mobileTab !== "plan" ? (
                  <span className="absolute right-6 top-2.5 h-2 w-2 rounded-full bg-accent" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <motion.div
        layout
        transition={{ layout: layoutTransition }}
        className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col gap-6 px-4 pb-0 pt-4 sm:px-6 sm:pt-5 lg:flex-row lg:items-stretch lg:gap-8 lg:px-8 lg:pt-6"
      >
        <main
          className={cn(
            "relative z-10 min-h-0 flex-1 flex-col lg:flex lg:h-full lg:border-r lg:border-border/40 lg:pr-2",
            mobileTab === "plan" ? "hidden lg:flex" : "flex",
          )}
        >
          {hasConversation ? (
            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent shadow-sm">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                    Rozmowa z Agentem
                  </h1>
                  <p className="text-sm text-ink-muted">
                    Wspólnie planujemy posiłek
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => agent.resetSession()}
                disabled={agent.isBusy}
                className="group flex items-center gap-2 rounded-lg border border-border/60 bg-bg-elevated px-3 py-1.5 text-sm font-semibold text-ink-soft shadow-xs transition duration-fast hover:border-accent/40 hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-50"
              >
                <Loader2
                  className={cn(
                    "h-4 w-4",
                    agent.isBusy ? "animate-spin text-accent" : "hidden",
                  )}
                  aria-hidden="true"
                />
                {!agent.isBusy ? (
                  <Sparkles
                    className="h-4 w-4 text-ink-muted group-hover:text-accent"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="hidden sm:inline-block">Nowa rozmowa</span>
              </button>
            </div>
          ) : null}

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
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -20,
                          scale: 0.985,
                          filter: "blur(8px)",
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.44,
                    ease: premiumEase,
                  }}
                >
                  <AgentEmptyState onSelectPrompt={handleStarterPrompt} />
                </motion.div>
              ) : (
                <motion.div
                  key="agent-conversation"
                  className="flex flex-col pb-6"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.22 }}
                >
                  <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 xl:max-w-4xl">
                    {agent.messages.map((message, index) => (
                      <motion.div
                        key={getMessageKey(message, index)}
                        layout
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: 16, scale: 0.98 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : 0.35,
                          ease: premiumEase,
                          layout: { duration: 0.35, ease: premiumEase },
                        }}
                        className={cn(
                          "flex w-full",
                          message.role === "user" ? "justify-end" : "justify-start",
                        )}
                      >
                        <div className="flex max-w-[88%] items-end gap-3 sm:max-w-[80%] lg:max-w-[85%]">
                          {message.role === "assistant" ? (
                            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent sm:flex">
                              <Bot className="h-4 w-4" aria-hidden="true" />
                            </div>
                          ) : null}

                          <div
                            className={cn(
                              "px-5 py-4 text-base leading-relaxed shadow-sm",
                              message.role === "user"
                                ? "rounded-2xl rounded-br-sm bg-accent text-white shadow-[0_8px_24px_-12px_rgba(232,111,69,0.5)] transition-shadow duration-200 hover:shadow-[0_10px_30px_-10px_rgba(232,111,69,0.65)]"
                                : "rounded-2xl rounded-bl-sm border border-border/50 bg-gradient-to-br from-bg-elevated/90 to-bg-elevated/70 text-ink shadow-sm backdrop-blur-md dark:border-white/10 dark:from-white/[0.07] dark:to-white/[0.04]",
                            )}
                          >
                            {message.role === "user" ? (
                              <p className="whitespace-pre-wrap">
                                {message.content}
                              </p>
                            ) : (
                              <div className="prose prose-base max-w-none prose-p:my-0 prose-p:leading-relaxed prose-strong:text-ink prose-ul:my-2 prose-li:my-0 dark:prose-invert">
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

                    <AnimatePresence>
                      {agent.isSending ? (
                        <motion.div
                          key="typing-indicator"
                          layout
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, y: 6, scale: 0.95 }
                          }
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{
                            opacity: 0,
                            y: -4,
                            scale: 0.96,
                            transition: { duration: 0.15 },
                          }}
                          transition={{
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex justify-start sm:ml-11"
                        >
                          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border/50 bg-gradient-to-br from-bg-elevated/90 to-bg-elevated/70 px-4 py-3.5 shadow-sm backdrop-blur-md">
                            {[0, 160, 320].map((delay) => (
                              <span
                                key={delay}
                                className="h-2 w-2 rounded-full bg-ink-muted/60"
                                style={{
                                  animation: shouldReduceMotion
                                    ? "none"
                                    : `agentTypingBounce 1.2s ease-in-out ${delay}ms infinite`,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    {agent.error && !agent.isExecuting ? (
                      <div className="ml-0 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm font-medium text-bordeaux sm:ml-11">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <span>{agent.error.message}</span>
                          <button
                            type="button"
                            onClick={handleRestartFromError}
                            className="inline-flex shrink-0 items-center justify-center rounded-full border border-bordeaux/20 bg-bg-elevated/80 px-3 py-1.5 font-brand text-xs font-semibold uppercase tracking-[0.12em] text-bordeaux shadow-sm transition-all hover:-translate-y-0.5 hover:border-bordeaux/35 hover:bg-bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
                          >
                            Popraw prompt
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div ref={messagesEndRef} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0 px-4 pb-5 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
            <form
              onSubmit={handleSubmit}
              className={cn(
                "relative mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[2rem] border border-accent/45 bg-bg-elevated/90 p-2 shadow-[0_16px_42px_-24px_rgba(32,37,31,0.34),0_0_0_1px_rgba(255,255,255,0.55)_inset,0_0_34px_-24px_rgba(232,111,69,0.5)] backdrop-blur-xl transition-all focus-within:border-accent/80 focus-within:shadow-[0_18px_46px_-24px_rgba(32,37,31,0.38),0_0_0_1px_rgba(255,255,255,0.68)_inset,0_0_0_4px_rgba(232,111,69,0.16),0_0_40px_-22px_rgba(232,111,69,0.75)] dark:border-accent/35 dark:bg-black/55 dark:shadow-[0_16px_42px_-24px_rgba(0,0,0,0.78),0_0_0_1px_rgba(255,255,255,0.08)_inset,0_0_34px_-24px_rgba(232,138,74,0.55)] xl:max-w-4xl",
                isBusy &&
                  "border-accent/70 shadow-[0_16px_42px_-24px_rgba(32,37,31,0.34),0_0_0_1px_rgba(255,255,255,0.55)_inset,0_0_0_3px_rgba(232,111,69,0.12),0_0_34px_-20px_rgba(232,111,69,0.65)]",
              )}
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
                className="agent-message-input min-h-12 flex-1 resize-none overflow-hidden bg-transparent px-4 py-3 text-base leading-6 text-ink outline-none transition-[height] duration-200 ease-out placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
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

        <motion.div
          layout
          transition={{ layout: layoutTransition }}
          className={cn(
            "min-h-0 lg:shrink-0 lg:pb-6",
            agent.plan
              ? "lg:w-[32rem] xl:w-[36rem] 2xl:w-[42rem]"
              : hasConversation
                ? "lg:w-[24rem] xl:w-[26rem] 2xl:w-[28rem]"
                : "lg:w-[30rem] xl:w-[34rem] 2xl:w-[38rem]",
            mobileTab === "plan"
              ? "flex flex-1 flex-col px-4 pb-6 lg:flex lg:px-0"
              : "hidden lg:flex",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {agent.plan ? (
              <PlanCanvas
                canExecute={agent.canExecute}
                error={agent.isExecuting ? agent.error?.message : null}
                isExecuting={agent.isExecuting}
                isUpdating={agent.status === "planning" || isPacingSteps}
                plan={agent.plan}
                shouldReduceMotion={shouldReduceMotion}
                steps={pacedSteps}
                onExecute={() =>
                  void agent.executePlan([
                    "create_recipe",
                    "populate_shopping_list",
                  ])
                }
              />
            ) : hasConversation ? (
              <AgentProcessCanvas
                error={agent.error?.message ?? null}
                shouldReduceMotion={shouldReduceMotion}
                steps={pacedSteps}
              />
            ) : (
              <PlanPlaceholder shouldReduceMotion={shouldReduceMotion} />
            )}
          </AnimatePresence>
        </motion.div>
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
      <div className="pointer-events-none absolute inset-y-4 left-0 right-0 -z-10 hidden overflow-hidden 2xl:block">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-2 top-[6%] text-accent/[0.18] dark:text-accent/[0.16]"
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
          className="absolute right-2 top-[10%] text-saffron/20 dark:text-saffron/[0.18]"
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
          className="absolute bottom-[8%] left-3 text-basil/[0.18] dark:text-basil/[0.16]"
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
          className="absolute bottom-[10%] right-3 text-accent/[0.18] dark:text-accent/[0.16]"
        >
          <ChefHat className="h-9 w-9" aria-hidden="true" />
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
    <div className="rounded-2xl border border-white/45 bg-bg-elevated/75 p-4 shadow-[0_14px_36px_-24px_rgba(32,37,31,0.45),0_0_0_1px_rgba(255,255,255,0.38)_inset] backdrop-blur-xl dark:border-white/10 dark:bg-black/35 dark:shadow-[0_14px_36px_-24px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent shadow-sm">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="font-brand text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
          {visibleSteps.some((step) => step.status === "running")
            ? "Pracuję nad tym"
            : "Co sprawdziłem"}
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

function AgentProcessCanvas({
  error,
  shouldReduceMotion,
  steps,
}: {
  error: string | null;
  shouldReduceMotion: boolean | null;
  steps: AgentStep[];
}) {
  const hasRunningStep = steps.some((step) => step.status === "running");

  return (
    <motion.aside
      key="agent-process"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 12 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[32rem] w-full flex-col overflow-hidden rounded-[24px] border border-white/35 bg-bg-elevated/55 p-5 shadow-[0_18px_44px_-28px_rgba(32,37,31,0.45),0_0_0_1px_rgba(255,255,255,0.34)_inset] backdrop-blur-xl dark:border-white/10 dark:bg-black/30 dark:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.08)_inset] lg:h-full"
      aria-label="Proces pracy Agenta"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-[70px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-8 h-52 w-52 rounded-full bg-basil/10 blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative">
        <Badge variant="accent">
          {hasRunningStep ? "Agent pracuje" : "Analiza gotowa"}
        </Badge>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink">
          {hasRunningStep ? "Układam kierunek" : "Analiza gotowa"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {hasRunningStep
            ? "Zbieram kontekst, sprawdzam ograniczenia i przygotowuję następny ruch."
            : "Wszystko sprawdzone. Odpowiedź zaraz się pojawi."}
        </p>
      </div>

      <div className="relative mt-6">
        {steps.length > 0 ? (
          (() => {
            const done = steps.filter(
              (step) =>
                step.status === "succeeded" || step.status === "skipped",
            ).length;
            const pct = Math.round((done / steps.length) * 100);

            return (
              <div className="mb-4 h-0.5 w-full overflow-hidden rounded-full bg-border/50">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            );
          })()
        ) : null}
        <AgentTimeline steps={steps} />
      </div>

      {error ? (
        <div className="relative mt-5 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm font-medium text-bordeaux">
          {error}
        </div>
      ) : null}

      <div className="relative mt-auto pt-6">
        <div className="rounded-2xl border border-border/50 bg-bg-elevated/65 px-4 py-3 text-xs leading-relaxed text-ink-soft shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
          Plan pojawi się tutaj, gdy Agent skończy analizę i będzie gotowy do
          akceptacji.
        </div>
      </div>
    </motion.aside>
  );
}

function PlanCanvas({
  canExecute,
  error,
  isExecuting,
  isUpdating,
  onExecute,
  plan,
  shouldReduceMotion,
  steps,
}: {
  canExecute: boolean;
  error: string | null;
  isExecuting: boolean;
  isUpdating: boolean;
  onExecute: () => void;
  plan: NonNullable<ReturnType<typeof useAgentSession>["plan"]>;
  shouldReduceMotion: boolean | null;
  steps: AgentStep[];
}) {
  const changedSections = new Set<AgentPlanRevisionSection>(
    plan.revision?.changedSections ?? [],
  );
  const hasRevision = Boolean(plan.revision);

  return (
    <motion.aside
      key="plan-ready"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[32rem] w-full flex-col overflow-hidden rounded-[24px] border border-border bg-bg-elevated shadow-[0_12px_32px_-12px_rgba(32,37,31,0.1)] lg:h-full"
      aria-label="Plan Agenta"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[60px]"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative border-b border-border bg-bg-sunken/40 px-6 py-5 transition-colors sm:px-8 xl:px-10",
          changedSections.has("overview") ? "bg-accent-soft/50" : null,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">
            {isUpdating ? "Aktualizuję plan" : "Plan gotowy"}
          </Badge>
          {hasRevision ? <Badge variant="neutral">Zaktualizowano</Badge> : null}
        </div>
        <motion.div
          key={plan.revision?.createdAt ?? "initial"}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {plan.title}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            {plan.summary}
          </p>
          {plan.revision ? (
            <p className="mt-3 rounded-xl border border-accent/20 bg-bg-elevated/70 px-3 py-2 text-xs font-medium leading-relaxed text-accent-deep shadow-sm backdrop-blur-sm dark:text-accent-hover">
              {plan.revision.summary}
            </p>
          ) : null}
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 xl:px-10">
        {isUpdating && steps.length > 0 ? (
          <div className="mb-5">
            <AgentTimeline steps={steps} />
          </div>
        ) : null}

        <div className="grid gap-7 text-base">
          <PlanSection
            changed={changedSections.has("details")}
            title="Uzasadnienie"
            icon={MessageSquareText}
          >
            <p className="leading-relaxed">{plan.rationale}</p>
          </PlanSection>

          <PlanSection
            changed={changedSections.has("ingredients")}
            title="Baza dania"
            icon={ChefHat}
          >
            {plan.usedIngredients.length > 0 ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {plan.usedIngredients.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-[0.95rem] text-ink"
                  >
                    <div
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-basil/60"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-ink-muted">Agent nie wskazał bazy dania.</p>
            )}
          </PlanSection>

          <PlanSection
            changed={changedSections.has("shopping")}
            title="Do kupienia"
            icon={ShoppingBasket}
          >
            {plan.shoppingDraft.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {plan.shoppingDraft.map((item) => (
                  <li
                    key={`${item.name}-${item.unit ?? ""}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-bg-sunken px-4 py-3 shadow-xs"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                        aria-hidden="true"
                      />
                      <span className="truncate font-medium text-ink">
                        {item.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-ink-muted">
                      {formatShoppingAmount(item.quantity, item.unit)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-basil/20 bg-basil-soft/40 px-4 py-3 text-basil">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-[0.95rem] font-medium">
                  Masz wszystko, co potrzebne!
                </span>
              </div>
            )}
          </PlanSection>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm font-medium text-bordeaux">
            {error}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border bg-bg-elevated px-6 py-5 sm:px-8 xl:px-10">
        <Button
          type="button"
          disabled={!canExecute || isExecuting || isUpdating}
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
          {isExecuting
            ? "Gotuję przepis..."
            : isUpdating
              ? "Aktualizuję plan..."
              : "Akceptuję - przygotuj przepis"}
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
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-[32rem] w-full flex-col overflow-hidden rounded-[24px] border border-border/75 bg-gradient-to-br from-bg-elevated/95 via-bg-elevated/85 to-bg-sunken/55 shadow-[0_18px_46px_-28px_rgba(32,37,31,0.5),0_0_0_1px_rgba(255,255,255,0.62)_inset] backdrop-blur-md dark:border-white/[0.14] dark:from-white/[0.08] dark:via-white/[0.05] dark:to-black/35 dark:shadow-[0_20px_52px_-30px_rgba(0,0,0,0.86),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
      aria-label="Canvas planu - oczekiwanie"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-4 h-48 w-48 rounded-full bg-saffron/[0.08] blur-[70px]"
        aria-hidden="true"
      />

      <div className="relative border-b border-border/60 bg-bg-elevated/55 px-6 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-border/70 bg-bg-elevated text-accent shadow-xs dark:border-white/10 dark:bg-white/[0.06]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="font-brand text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
            Canvas planu
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-accent/10 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-bg-elevated text-accent shadow-[0_12px_28px_-18px_rgba(232,111,69,0.55)]">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
        </div>

        <h3 className="font-serif text-xl font-semibold leading-tight text-ink">
          Tutaj pojawi się Twój plan
        </h3>
        <p className="mt-3 max-w-[22rem] text-sm leading-relaxed text-ink-soft">
          Zacznij rozmowę z Agentem po lewej. Gdy zbierze wystarczająco dużo
          informacji, skomponuje tutaj konkretny plan do akceptacji.
        </p>

        <div className="mt-8 w-full space-y-3 opacity-65">
          <div className="mx-auto h-4 w-3/4 rounded-full bg-border-strong/60 dark:bg-white/[0.18]" />
          <div className="h-3 w-full rounded-full bg-border/70 dark:bg-white/[0.12]" />
          <div className="h-3 w-5/6 rounded-full bg-border/70 dark:bg-white/[0.12]" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Składniki", "Zakupy", "Czas"].map((label) => (
              <div
                key={label}
                className="h-6 w-16 rounded-full bg-border/70 dark:bg-white/[0.12]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/60 bg-bg-elevated/45 px-6 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <p className="text-center text-xs leading-relaxed text-ink-soft">
          Po akceptacji planu Agent automatycznie wygeneruje pełny przepis.
        </p>
      </div>
    </motion.aside>
  );
}

function PlanSection({
  changed = false,
  title,
  icon: Icon,
  children,
}: {
  changed?: boolean;
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "-mx-3 rounded-2xl px-3 py-2 transition-colors",
        changed
          ? "border border-accent/20 bg-accent-soft/45 shadow-[0_10px_24px_-20px_rgba(232,111,69,0.45)]"
          : "border border-transparent",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            changed ? "text-accent" : "text-ink-muted",
          )}
          aria-hidden="true"
        />
        <h3 className="font-brand text-sm font-bold uppercase tracking-[0.12em] text-ink-muted">
          {title}
        </h3>
        {changed ? (
          <span className="ml-auto rounded-full bg-bg-elevated/80 px-2 py-0.5 font-brand text-[0.65rem] font-bold uppercase tracking-[0.12em] text-accent-deep shadow-xs dark:text-accent-hover">
            Zaktualizowano
          </span>
        ) : null}
      </div>
      <motion.div
        key={changed ? "changed" : "stable"}
        initial={shouldReduceMotion ? false : { opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-ink-soft"
      >
        {children}
      </motion.div>
    </section>
  );
}
