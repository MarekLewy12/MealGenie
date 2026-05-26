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
  Send,
  ShoppingBasket,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge, Button, HandwrittenKicker } from "../components/ui";
import { useAgentSession } from "../hooks/useAgentSession";
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
    <section className="relative flex min-h-full flex-col bg-bg text-ink">
      <div
        className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[10%] h-[40rem] w-[40rem] rounded-full bg-accent/5 blur-[120px] dark:bg-accent/[0.03]" />
        <div className="absolute right-[15%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-saffron/5 blur-[100px] dark:bg-saffron/[0.02]" />
      </div>

      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 sm:pb-12 lg:px-8 lg:pt-8",
          shouldShowCanvas
            ? "max-w-screen-2xl lg:flex-row lg:items-start lg:gap-8"
            : "max-w-7xl 2xl:max-w-[92rem]",
        )}
      >
        <main className="relative z-10 flex min-h-[35rem] flex-1 flex-col lg:h-[calc(100vh-6rem)] lg:min-h-[32rem]">
          <div
            className="flex-1 overflow-y-auto px-1 pb-36 pt-6 sm:px-2 lg:px-4"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 3%, black 95%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 3%, black 95%, transparent)",
            }}
          >
            {!hasConversation ? (
              <AgentEmptyState onSelectPrompt={handleStarterPrompt} />
            ) : (
              <div className="flex flex-col gap-6 pb-6">
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
                            ? "rounded-2xl rounded-br-sm bg-accent text-ink-inverse shadow-[0_8px_24px_-12px_rgba(232,111,69,0.5)]"
                            : "rounded-2xl rounded-bl-sm border border-border/50 bg-bg-elevated/90 text-ink shadow-sm backdrop-blur-sm",
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
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
            <form
              onSubmit={handleSubmit}
              className="pointer-events-auto relative flex w-full max-w-3xl items-end gap-2 rounded-[2rem] border border-border/80 bg-bg-elevated/80 p-2 shadow-lg backdrop-blur-xl transition-all focus-within:border-accent/60 focus-within:shadow-[0_8px_32px_-12px_rgba(232,111,69,0.25),0_0_0_4px_rgba(232,111,69,0.15)] dark:border-white/10 dark:bg-bg-elevated/40 xl:max-w-4xl"
            >
              <label htmlFor="agent-message" className="sr-only">
                Wiadomość do Agenta
              </label>
              <textarea
                id="agent-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasConversation ? "Napisz odpowiedź..." : "O czym dziś myślisz?"
                }
                rows={1}
                disabled={isBusy}
                className="agent-message-input max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isBusy}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink-inverse shadow-accent transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-ink-disabled disabled:shadow-none"
              >
                {agent.isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="sr-only">Wyślij</span>
              </button>
            </form>
          </div>
        </main>

        {shouldShowCanvas ? (
          <div className="w-full shrink-0 lg:w-[26rem] xl:w-[28rem]">
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
          </div>
        ) : null}
      </div>
    </section>
  );
}

function AgentEmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center py-10 text-center 2xl:max-w-[86rem]">
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

        <h2 className="text-balance font-serif text-4xl font-medium leading-tight sm:text-5xl">
          W czym mogę Ci dziś{" "}
          <span className="text-summary-gradient">pomóc?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
          Nie musisz wypełniać formularzy. Powiedz mi, co masz w lodówce, ile
          masz czasu albo na co masz ochotę.
        </p>

        <div className="mx-auto mt-10 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-border/50 bg-bg-elevated/80 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="line-clamp-3 text-sm font-medium leading-relaxed text-ink transition-colors group-hover:text-accent-deep">
                {prompt}
              </span>
              <div className="mt-4 flex w-full justify-end">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-sunken transition-colors group-hover:bg-accent-soft">
                  <ArrowRight
                    className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          ))}
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
      className="relative flex min-h-[32rem] flex-col overflow-hidden rounded-[24px] border border-border bg-bg-elevated shadow-[0_12px_32px_-12px_rgba(32,37,31,0.1)] lg:h-[calc(100vh-6rem)]"
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
