import type {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth.types";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

function fakeLongRunningLogin(loginCredentials: LoginCredentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "1",
          email: loginCredentials.email,
          name: "Guest",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NCIsImlhdCI6MTY0MjE3MjQ0NSwiZXhwIjoxNjQyNzc5NDQ1fQ.1-4-6-5-3-2-1-0-9-8-7-6-5-4-3-2-1",
      });
    }, 1000);
  });
}

export const useAuthStore: UseBoundStore<StoreApi<AuthContextType>> = create(
  persist(
    (set, get) => ({
      login: async (loginCredentials: LoginCredentials) => {
        // Empezar loading
        set({ isLoading: true });

        try {
          // Llamar API (como en Angular)
          // const response = await fetch('/api/login', {
          //     method: 'POST',
          //     body: JSON.stringify(loginCredentials)
          // });
          // const data = await response.json();
          const data = await fakeLongRunningLogin(loginCredentials);

          // Actualizar estado con éxito
          set({
            user: (data as { user: AuthContextType["user"] }).user,
            token: (data as { token: string }).token,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log(data);
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },
      register: async (registerCredentials: RegisterCredentials) => {
        // Empezar loading
        set({ isLoading: true });

        try {
          // Llamar API (como en Angular)
          const response = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(registerCredentials),
          });
          const data = await response.json();

          // Actualizar estado con éxito
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },
      logout: () =>
        set({
          user: undefined,
          token: undefined,
          isAuthenticated: false,
          isLoading: false,
        }),
      checkAuthStatus: () => {
        const state = get();
        // Si tenemos user y token, el usuario está autenticado
        if (state.user && state.token) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
      isAuthenticated: false,
      isLoading: false,
    }),
    {
      name: "auth-store", // nombre en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Cuando se rehidrata el store, verificar el estado de autenticación
        if (state && state.user && state.token) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);
