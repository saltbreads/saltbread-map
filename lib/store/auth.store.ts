import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { accessToken: string; sessionId: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, sessionId }) =>
        set({
          accessToken,
          sessionId,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          sessionId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
