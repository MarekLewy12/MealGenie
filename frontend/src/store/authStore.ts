import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  hasCompletedOnboarding: boolean;
  setAuth: (token: string, user: User, hasCompletedOnboarding: boolean) => void;
  logout: () => void;
  updateOnboardingStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasCompletedOnboarding: false,

      setAuth: (token, user, hasCompletedOnboarding) =>
        set({ token, user, hasCompletedOnboarding }),

      logout: () =>
        set({ token: null, user: null, hasCompletedOnboarding: false }),

      updateOnboardingStatus: (status) =>
        set({ hasCompletedOnboarding: status }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
