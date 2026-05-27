import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createFocusTrap, type FocusTrap } from "focus-trap";
import {
  ChefHat,
  MessageSquare,
  Send,
  Trash2,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { chatWithAssistant } from "../services/api";
import { useChatStore } from "../store/chatStore";
import { notify } from "../store/notificationStore";
import type { ChatRequest } from "../types/chat";
import { cn } from "../utils/cn";
import { Badge, Eyebrow, IconButton, MealEmoji } from "./ui";

const RECIPE_CHIPS = [
  { label: "📍 Na którym kroku jestem", prompt: "Jestem na kroku " },
  { label: "🔧 Coś poszło nie tak", prompt: "W kroku X wyszło mi " },
  { label: "🔄 Zamiennik składnika", prompt: "Czym mogę zastąpić " },
];

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const HISTORY_WINDOW = 15;
const DRAWER_TITLE_ID = "mealgenie-chat-drawer-title";
const DRAWER_DESCRIPTION_ID = "mealgenie-chat-drawer-description";

function formatMessageTime(timestamp: number) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function ChatDrawer() {
  const {
    isLoading,
    isOpen,
    recipeContext,
    closeChat,
    addMessage,
    clearCurrentSession,
    setLoading,
    getCurrentMessages,
    getCurrentMode,
    getCurrentRecipeId,
  } = useChatStore();
  const messages = getCurrentMessages();
  const mode = getCurrentMode();
  const recipeId = getCurrentRecipeId();
  const shouldReduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const drawerRef = useRef<HTMLElement | null>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !drawerRef.current) {
      return;
    }

    const drawerElement = drawerRef.current;
    const focusTrap = createFocusTrap(drawerElement, {
      initialFocus: () => closeButtonRef.current ?? drawerElement,
      fallbackFocus: () => drawerElement,
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      allowOutsideClick: true,
      clickOutsideDeactivates: false,
      onDeactivate: () => {
        if (useChatStore.getState().isOpen) {
          closeChat();
        }
      },
    });

    focusTrapRef.current = focusTrap;
    focusTrap.activate();

    return () => {
      focusTrap.deactivate({ returnFocus: true });
      focusTrapRef.current = null;
    };
  }, [closeChat, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [messages, isOpen, shouldReduceMotion]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    addMessage("user", trimmed);
    setInput("");
    setLoading(true);

    try {
      const currentMessages = useChatStore.getState().getCurrentMessages();
      const historyPayload = currentMessages
        .slice(-HISTORY_WINDOW)
        .map((message) => ({ role: message.role, content: message.content }));

      let request: ChatRequest;

      if (mode === "recipe" && recipeId) {
        request = {
          mode: "recipe",
          recipeId,
          messages: historyPayload,
        };
      } else {
        request = {
          mode: "global",
          messages: historyPayload,
        };
      }

      const response = await chatWithAssistant(request);

      addMessage("assistant", response.message.content);
    } catch (error) {
      console.error(error);
      notify.error("Asystent miał problem z odpowiedzią.");
      addMessage(
        "assistant",
        "Przepraszam, coś poszło nie tak. Spróbuj ponownie.",
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const title = mode === "recipe" ? "Asystent przepisu" : "Genie w kuchni";
  const subtitle =
    mode === "recipe" && recipeContext
      ? recipeContext.recipeName
      : "Twój spokojny pomocnik od gotowania";
  const modeBadge = mode === "recipe" ? "Tryb przepisu" : "Tryb globalny";
  const description =
    mode === "recipe"
      ? "Pytaj o kroki, składniki i techniki dla aktualnego przepisu."
      : "Pytaj o przepisy, składniki, techniki kulinarne i planowanie posiłków.";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={closeChat}
            className="fixed inset-0 z-40 cursor-pointer bg-ink/30 backdrop-blur-[2px] dark:bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.24,
              ease: "easeOut",
            }}
            aria-hidden
          />

          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={DRAWER_TITLE_ID}
            aria-describedby={DRAWER_DESCRIPTION_ID}
            tabIndex={-1}
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-full flex-col overflow-hidden border-l border-border bg-bg-elevated text-ink shadow-lg sm:w-[88vw] md:w-[70vw] lg:w-[560px] lg:max-w-[48vw]"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className={cn(
                "relative overflow-hidden border-b border-border px-4 py-4 sm:px-6",
                mode === "recipe"
                  ? "bg-accent-soft/70 dark:bg-accent-soft/55"
                  : "bg-bg-elevated",
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,87,40,0.13),transparent_44%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(232,138,74,0.09),transparent_46%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border shadow-xs",
                      mode === "recipe"
                        ? "border-accent/25 bg-bg-elevated text-accent"
                        : "border-basil/25 bg-basil-soft text-basil",
                    )}
                  >
                    {mode === "recipe" ? (
                      <ChefHat className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <MessageSquare className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Eyebrow tone={mode === "recipe" ? "accent" : "basil"}>
                        {modeBadge}
                      </Eyebrow>
                      <Badge variant={mode === "recipe" ? "accent" : "basil"}>
                        Gotowy
                      </Badge>
                    </div>
                    <h2
                      id={DRAWER_TITLE_ID}
                      className="font-brand text-xl font-semibold leading-tight text-ink"
                    >
                      {title}
                    </h2>
                    <p
                      id={DRAWER_DESCRIPTION_ID}
                      className="mt-1 max-w-[17rem] truncate text-sm text-ink-soft sm:max-w-[24rem]"
                    >
                      {subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <IconButton
                    aria-label="Wyczyść bieżącą rozmowę"
                    title="Wyczyść bieżącą rozmowę"
                    onClick={clearCurrentSession}
                    variant="ghost"
                    className="min-h-10 min-w-10 border-border/70 bg-bg-elevated/80 p-2 text-ink-soft hover:text-bordeaux"
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Zamknij chat"
                    title="Zamknij chat"
                    onClick={closeChat}
                    className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border border-border/70 bg-bg-elevated/80 p-2 text-ink-soft transition duration-fast ease-out hover:bg-accent-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {mode === "recipe" && (
              <div className="border-b border-border bg-bg px-4 py-3 sm:px-6">
                <p className="mb-2 text-xs font-semibold text-ink-soft">
                  Szybkie pytania:
                </p>
                <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1">
                  {RECIPE_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleChipClick(chip.prompt)}
                      className="min-h-9 cursor-pointer whitespace-nowrap rounded-pill border border-border-strong bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-accent transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              className="flex-1 overflow-y-auto bg-bg px-4 py-5 sm:px-6"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MealEmoji
                    emoji={mode === "recipe" ? "🍲" : "🥄"}
                    size="lg"
                    className={cn(
                      "mb-4",
                      mode === "recipe"
                        ? "bg-accent-soft text-accent"
                        : "bg-basil-soft text-basil",
                    )}
                  />
                  <h3 className="font-brand text-xl font-semibold text-ink">
                    {mode === "recipe"
                      ? "Potrzebujesz pomocy z przepisem?"
                      : "Cześć, co dziś gotujemy?"}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-ink-soft">
                    {description}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={cn(
                          "min-w-0 max-w-[85%] break-words px-4 py-3 text-sm leading-6 shadow-xs [overflow-wrap:anywhere]",
                          message.role === "user"
                            ? "rounded-[18px] rounded-br-sm bg-accent text-ink-inverse"
                            : "rounded-[18px] rounded-bl-sm border border-border bg-bg-elevated text-ink",
                        )}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none break-words prose-headings:font-brand prose-headings:text-ink prose-p:my-0 prose-p:text-ink prose-a:text-accent prose-strong:text-ink prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-code:break-words prose-code:text-accent-deep prose-pre:max-w-full prose-pre:overflow-x-auto prose-table:block prose-table:max-w-full prose-table:overflow-x-auto dark:prose-invert dark:prose-p:text-ink dark:prose-strong:text-ink">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                            {message.content}
                          </p>
                        )}
                        <p
                          className={cn(
                            "mt-2 text-[11px] leading-none opacity-70",
                            message.role === "user"
                              ? "text-right text-ink-inverse"
                              : "text-ink-muted",
                          )}
                        >
                          {message.role === "user" ? "Ty · " : "Genie · "}
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading ? (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-[18px] rounded-bl-sm border border-border bg-bg-elevated px-4 py-3 text-sm text-ink-soft shadow-xs">
                        <span className="sr-only">Genie pisze odpowiedź</span>
                        <span className="flex gap-1" aria-hidden="true">
                          <span className="h-2 w-2 animate-pulse rounded-pill bg-accent [animation-delay:0ms]" />
                          <span className="h-2 w-2 animate-pulse rounded-pill bg-accent [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-pulse rounded-pill bg-accent [animation-delay:240ms]" />
                        </span>
                        <span aria-hidden="true">pisze...</span>
                      </div>
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </div>
              )}

            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-bg-elevated p-3 sm:p-4"
            >
              <div className="flex items-end gap-2 rounded-lg border border-border bg-bg-sunken p-2 shadow-xs">
                <label htmlFor="mealgenie-chat-input" className="sr-only">
                  Wiadomość do Genie
                </label>
                <textarea
                  id="mealgenie-chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "recipe"
                      ? "Np. 'W kroku 3 sos wyszedł wodnisty...'"
                      : "Zapytaj o przepis, składnik albo plan..."
                  }
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-md border border-transparent bg-bg-elevated px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  aria-label="Wyślij wiadomość"
                  disabled={isLoading || !input.trim()}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-accent bg-accent text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-sunken disabled:text-ink-disabled disabled:shadow-none"
                >
                  {isLoading ? (
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-pill bg-current [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-pill bg-current [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-pill bg-current [animation-delay:240ms]" />
                    </span>
                  ) : (
                    <Send className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
