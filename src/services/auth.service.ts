import api from "./api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth.types";

export const authService = {
  // Registrar usuario
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", credentials);
    return data;
  },

  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  // Obtener perfil
  getProfile: async () => {
    const { data } = await api.get("/auth/profile");
    return data.user;
  },

  // Verificar email
  verifyEmail: async (token: string) => {
    const { data } = await api.get(`/auth/verify-email/${token}`);
    return data;
  },

  // Actualizar perfil
  updateProfile: async (data: { name?: string; avatar?: string }) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};
