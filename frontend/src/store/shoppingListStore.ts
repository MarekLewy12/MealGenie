import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ShoppingItem = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  notes?: string | null;
  obtained: boolean;
  createdAt: number;
  key: string;
};

type ShoppingItemInput = {
  name: string;
  amount: string;
  unit: string;
  notes?: string | null;
};

interface ShoppingListState {
  items: ShoppingItem[];
  addItem: (item: ShoppingItemInput) => boolean;
  removeItem: (item: ShoppingItemInput) => boolean;
  toggleObtained: (id: string) => void;
  clearAll: () => void;
}

const normalize = (value: string) => value.trim().toLowerCase();
const buildKey = (item: ShoppingItemInput) =>
  [item.name, item.amount, item.unit].map(normalize).join("|");

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const normalizedItem = {
          name: item.name.trim(),
          amount: item.amount.trim(),
          unit: item.unit.trim(),
          notes: item.notes?.trim() || null,
        };
        const key = buildKey(normalizedItem);
        const exists = get().items.some((entry) => entry.key === key);
        if (exists) return false;

        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              obtained: false,
              createdAt: Date.now(),
              key,
              ...normalizedItem,
            },
          ],
        }));
        return true;
      },

      removeItem: (item) => {
        const normalizedItem = {
          name: item.name.trim(),
          amount: item.amount.trim(),
          unit: item.unit.trim(),
          notes: item.notes?.trim() || null,
        };
        const key = buildKey(normalizedItem);
        const exists = get().items.some((entry) => entry.key === key);
        if (!exists) return false;

        set((state) => ({
          items: state.items.filter((entry) => entry.key !== key),
        }));
        return true;
      },

      toggleObtained: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, obtained: !item.obtained } : item,
          ),
        })),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "mealgenie-shopping-list",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
