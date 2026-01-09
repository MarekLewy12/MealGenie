import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ChatMessage, ChatRole } from "../types/chat";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (role: ChatRole, content: string) => void;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      isOpen: false,

      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),

      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              role,
              content,
              createdAt: Date.now(),
            },
          ],
        })),

      clearHistory: () => set({ messages: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "mealgenie-chat-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ messages: state.messages }),
    },
  ),
);
