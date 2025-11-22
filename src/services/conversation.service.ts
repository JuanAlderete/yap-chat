import api from "./api";

export const conversationService = {
  // Crear o obtener conversación
  createConversation: async (participantId: string) => {
    const { data } = await api.post("/conversations", { participantId });
    return data;
  },

  // Listar mis conversaciones
  getMyConversations: async () => {
    const { data } = await api.get("/conversations");
    return data.conversations;
  },

  // Obtener conversación por ID
  getConversationById: async (conversationId: string) => {
    const { data } = await api.get(`/conversations/${conversationId}`);
    return data.conversation;
  },

  // Eliminar conversación
  deleteConversation: async (conversationId: string) => {
    const { data } = await api.delete(`/conversations/${conversationId}`);
    return data;
  },
};