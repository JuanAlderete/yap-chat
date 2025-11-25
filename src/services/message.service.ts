import api from "./api";

export const messageService = {
  // Enviar mensaje
  sendMessage: async (conversationId: string, content: string) => {
    const { data } = await api.post("/messages", { conversationId, content });
    return data.message;
  },

  // Obtener mensajes de una conversación
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    const { data } = await api.get(`/messages/${conversationId}`, {
      params: { page, limit },
    });
    return data;
  },

  // Eliminar mensaje
  deleteMessage: async (messageId: string) => {
    const { data } = await api.delete(`/messages/${messageId}`);
    return data;
  },

  // Editar mensaje
  updateMessage: async (messageId: string, content: string) => {
    const { data } = await api.put(`/messages/${messageId}`, { content });
    return data.message;
  },
};
