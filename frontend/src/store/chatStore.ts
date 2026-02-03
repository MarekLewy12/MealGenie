import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  ChatMessage,
  ChatMode,
  ChatRole,
  RecipeChatContext,
  SessionKey,
} from "../types/chat";
import { createSessionKey, parseSessionKey } from "../types/chat";

interface ChatState {
  sessions: Record<SessionKey, ChatMessage[]>;
  activeSessionKey: SessionKey;
  recipeContext: RecipeChatContext | null;
  isLoading: boolean;
  isOpen: boolean;
  openGlobalChat: () => void;
  openRecipeChat: (context: RecipeChatContext) => void;
  closeChat: () => void;
  addMessage: (role: ChatRole, content: string) => void;
  clearCurrentSession: () => void;
  clearAllSessions: () => void;
  setLoading: (loading: boolean) => void;
  getCurrentMessages: () => ChatMessage[];
  getCurrentMode: () => ChatMode;
  getCurrentRecipeId: () => string | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {
        global: [],
      },
      activeSessionKey: "global",
      recipeContext: null,
      isLoading: false,
      isOpen: false,

      openGlobalChat: () => {
        set({
          activeSessionKey: "global",
          recipeContext: null,
          isOpen: true,
        });
      },

      openRecipeChat: (context: RecipeChatContext) => {
        const sessionKey = createSessionKey("recipe", context.recipeId);

        set((state) => ({
          activeSessionKey: sessionKey,
          recipeContext: context,
          isOpen: true,
          sessions: {
            ...state.sessions,
            [sessionKey]: state.sessions[sessionKey] || [],
          },
        }));
      },

      closeChat: () => set({ isOpen: false }),

      addMessage: (role, content) =>
        set((state) => {
          const sessionKey = get().activeSessionKey;
          const currentMessages = state.sessions[sessionKey] || [];
          const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role,
            content,
            createdAt: Date.now(),
          };

          return {
            sessions: {
              ...state.sessions,
              [sessionKey]: [...currentMessages, newMessage],
            },
          };
        }),

      clearCurrentSession: () => {
        const sessionKey = get().activeSessionKey;

        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionKey]: [],
          },
        }));
      },

      clearAllSessions: () => {
        set({
          sessions: { global: [] },
          activeSessionKey: "global",
          recipeContext: null,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      getCurrentMessages: () => {
        const state = get();
        return state.sessions[state.activeSessionKey] || [];
      },

      getCurrentMode: () => {
        const { mode } = parseSessionKey(get().activeSessionKey);
        return mode;
      },

      getCurrentRecipeId: () => {
        const { recipeId } = parseSessionKey(get().activeSessionKey);
        return recipeId;
      },
    }),
    {
      name: "mealgenie-chat-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionKey: state.activeSessionKey,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 1) {
          return {
            sessions: {
              global: persistedState.messages || [],
            },
            activeSessionKey: "global",
          };
        }
        return persistedState;
      },
    },
  ),
);
