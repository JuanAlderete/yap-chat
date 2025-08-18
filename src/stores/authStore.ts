import type { AuthContextType, LoginCredentials, RegisterCredentials } from "@/types/auth.types";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore: UseBoundStore<StoreApi<AuthContextType>> = create(
    persist(
        (set) => ({
            login: async (loginCredentials: LoginCredentials) => {
                // Empezar loading
                set({ isLoading: true });

                try {
                    // Llamar API (como en Angular)
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        body: JSON.stringify(loginCredentials)
                    });
                    const data = await response.json();

                    // Actualizar estado con éxito
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                } catch (error) {
                    set({
                        isAuthenticated: false,
                        isLoading: false
                    });
                    throw error;
                }
            },
            register: async (registerCredentials: RegisterCredentials) => {
                // Empezar loading
                set({ isLoading: true });

                try {
                    // Llamar API (como en Angular)
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        body: JSON.stringify(registerCredentials)
                    });
                    const data = await response.json();

                    // Actualizar estado con éxito
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                } catch (error) {
                    set({
                        isAuthenticated: false,
                        isLoading: false
                    });
                    throw error;
                }
            },
            logout: () => set({
                user: undefined,
                token: undefined,
                isAuthenticated: false,
                isLoading: false
            }),
            checkAuthStatus: () => { },
            isAuthenticated: false,
            isLoading: false
        }),
        {
            name: 'auth-store', // nombre en localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token
            })
        }
    )
)