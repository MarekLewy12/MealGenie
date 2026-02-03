import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
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

const RECIPE_CHIPS = [
  { label: "📍 Na którym kroku jestem", prompt: "Jestem na kroku " },
  { label: "🔧 Coś poszło nie tak", prompt: "W kroku X wyszło mi " },
  { label: "🔄 Zamiennik składnika", prompt: "Czym mogę zastąpić " },
];

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const HISTORY_WINDOW = 15;

export function ChatDrawer() {
  const {
    isLoading,
    isOpen,
    recipeContext,
    closeChat,
    addMessage,
    clearCurrentSession,
    setLoading,
    openGlobalChat,
    getCurrentMessages,
    getCurrentMode,
    getCurrentRecipeId,
  } = useChatStore();
  const messages = getCurrentMessages();
  const mode = getCurrentMode();
  const recipeId = getCurrentRecipeId();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={closeChat}
            className="fixed inset-0 z-40 cursor-pointer bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />

          <motion.aside
            className="fixed left-0 top-0 z-50 flex h-full w-full flex-col border-r border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0b1220] lg:w-[480px]"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    mode === "recipe"
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                  }`}
                >
                  {mode === "recipe" ? (
                    <ChefHat className="h-5 w-5" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </div>
                <div>
                  {mode === "recipe" && recipeContext ? (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Asystent Przepisu
                      </p>
                      <p className="max-w-[200px] truncate text-xs text-amber-600 dark:text-amber-400">
                        📍 {recipeContext.recipeName}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Asystent AI
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Twój kulinarny ekspert
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mode === "recipe" && (
                  <button
                    type="button"
                    onClick={openGlobalChat}
                    className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    title="Wróć do asystenta globalnego"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearCurrentSession}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                  title="Wyczyść tę rozmowę"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Zamknij"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {mode === "recipe" && (
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Szybkie pytania:
                </p>
                <div className="flex flex-wrap gap-2">
                  {RECIPE_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleChipClick(chip.prompt)}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div
                    className={`mb-4 rounded-full p-4 ${
                      mode === "recipe"
                        ? "bg-amber-100 dark:bg-amber-500/15"
                        : "bg-emerald-100 dark:bg-emerald-500/15"
                    }`}
                  >
                    {mode === "recipe" ? (
                      <ChefHat className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                    ) : (
                      <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === "recipe"
                      ? "Potrzebujesz pomocy z przepisem?"
                      : "Cześć! Jak mogę pomóc?"}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                    {mode === "recipe"
                      ? "Zapytaj o dowolny krok, składnik lub technikę z tego przepisu."
                      : "Pytaj o przepisy, składniki, techniki kulinarne i planowanie posiłków."}
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
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-100 p-4 dark:border-slate-800"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "recipe"
                      ? "Np. 'W kroku 3 sos wyszedł wodnisty...'"
                      : "Napisz wiadomość..."
                  }
                  className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
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
