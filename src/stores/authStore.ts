import { authService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthContextType>()(
  persist(
    (set, get) => ({
      user: undefined,
      token: undefined,
      isAuthenticated: false,
      isLoading: true,

      login: async (loginCredentials: LoginCredentials) => {
        set({ isLoading: true });

        try {
          const response = await authService.login(loginCredentials);

          localStorage.setItem("auth-token", response.token);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          socketService.connect(response.token);
        } catch (error: any) {
          set({
            isAuthenticated: false,
            isLoading: false,
          });
          throw new Error(
            error.response?.data?.message || "Error al iniciar sesión"
          );
        }
      },

      register: async (registerCredentials: RegisterCredentials) => {
        set({ isLoading: true });

        try {
          const response = await authService.register(registerCredentials);

          set({
            user: response.user,
            isAuthenticated: false,
            isLoading: false,
          });

          return response;
        } catch (error: any) {
          set({
            isAuthenticated: false,
            isLoading: false,
          });
          throw new Error(
            error.response?.data?.message || "Error al registrar usuario"
          );
        }
      },

      logout: () => {
        socketService.disconnect();
        localStorage.removeItem("auth-token");
        set({
          user: undefined,
          token: undefined,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuthStatus: async () => {
        const state = get();
        const token = localStorage.getItem("auth-token");

        if (!token) {
          set({
            isAuthenticated: false,
            isLoading: false,
            user: undefined,
            token: undefined,
          });
          return;
        }

        if (state.user && state.token === token) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
          socketService.connect(token);
          return;
        }

        try {
          const user = await authService.getProfile();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          socketService.connect(token);
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("auth-token");
          set({
            user: undefined,
            token: undefined,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: { name?: string; avatar?: string }) => {
        set({ isLoading: true });

        try {
          const response = await authService.updateProfile(data);

          set(() => ({
            user: response.user,
            isLoading: false,
          }));

          return response;
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(
            error.response?.data?.message || "Error al actualizar perfil"
          );
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuthStatus();
        }
      },
    }
  )
);
