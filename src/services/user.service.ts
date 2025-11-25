import api from "./api";

export const userService = {
  // Buscar usuarios
  searchUsers: async (query: string) => {
    const { data } = await api.get("/auth/users/search", {
      params: { query },
    });
    return data.users;
  },
};
