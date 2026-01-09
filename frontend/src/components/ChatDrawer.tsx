import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquare, Send, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { chatWithAssistant } from "../services/api";
import { useChatStore } from "../store/chatStore";
import { notify } from "../store/notificationStore";

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const HISTORY_WINDOW = 15;

export function ChatDrawer() {
  const {
    messages,
    isLoading,
    isOpen,
    closeChat,
    addMessage,
    clearHistory,
    setLoading,
  } = useChatStore();
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
      const currentMessages = useChatStore.getState().messages;
      const historyPayload = currentMessages
        .slice(-HISTORY_WINDOW)
        .map((message) => ({ role: message.role, content: message.content }));

      const response = await chatWithAssistant({
        mode: "global",
        messages: historyPayload,
      });

      addMessage("assistant", response.message.content);
    } catch (error) {
      console.error(error);
      notify.error("Asystent mial problem z odpowiedzia.");
      addMessage(
        "assistant",
        "Przepraszam, cos poszlo nie tak. Sprobuj ponownie.",
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Asystent AI
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Twoj kulinarny ekspert
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearHistory}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                  title="Wyczysc historie"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Zamknij"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center opacity-60">
                  <MessageSquare className="h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    Zapytaj o przepis, zamienniki <br /> lub co zrobic z
                    resztek w lodowce.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-sm ${
                        message.role === "user"
                          ? "rounded-br-none bg-indigo-600 text-white"
                          : "rounded-bl-none border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div
                        className={`prose prose-sm max-w-none break-words leading-relaxed ${
                          message.role === "user"
                            ? "prose-invert"
                            : "prose-slate dark:prose-invert"
                        } prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:mb-2 prose-headings:mt-2`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Asystent pisze...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-100 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#0b1220]"
            >
              <div className="relative flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  rows={1}
                  placeholder={
                    isLoading ? "Czekam na odpowiedz..." : "Napisz wiadomosc..."
                  }
                  className="min-h-[48px] max-h-[120px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Enter wysyla, Shift+Enter nowa linia
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
