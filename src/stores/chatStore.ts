import { conversationService } from "@/services/conversation.service";
import { messageService } from "@/services/message.service";
import type { ChatStore, Conversation, Message } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoading: false,
  searchQuery: "",
  filteredConversations: [],

  // Cargar conversaciones desde el backend
  loadConversations: async () => {
    const state = get();

    if (state.isLoading) return;

    set({ isLoading: true });
    try {
      const conversations = await conversationService.getMyConversations();
      set({
        conversations,
        filteredConversations: conversations,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading conversations:", error);
      set({ isLoading: false });
    }
  },

  // Cargar mensajes de una conversación
  loadMessages: async (
    conversationId: string,
    forceReload: boolean = false
  ) => {
    const state = get();

    if (state.isLoading && !forceReload) return;

    if (!forceReload && state.messages[conversationId]?.length > 0) {
      //console.log("Messages already loaded for:", conversationId);
      return;
    }

    set({ isLoading: true });
    try {
      const response = await messageService.getMessages(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: response.messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
      set({ isLoading: false });
    }
  },

  // Enviar mensaje
  sendMessage: async (content: string) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    try {
      const newMessage = await messageService.sendMessage(
        activeConversationId,
        content
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]: [
            ...(state.messages[activeConversationId] || []),
            newMessage,
          ],
        },
      }));

      get().loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Cambiar conversación activa
  setActiveConversation: (id: string | null) => {
    if (!id) {
      set({ activeConversationId: null });
      return;
    }

    set({ activeConversationId: id });

    get().loadMessages(id);
  },

  // Buscar conversaciones
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    const { conversations } = get();

    if (!query.trim()) {
      set({ filteredConversations: conversations });
      return;
    }

    const filtered = conversations.filter(
      (conversation) =>
        conversation.name?.toLowerCase().includes(query.toLowerCase()) ||
        conversation.lastMessage?.toLowerCase().includes(query.toLowerCase()) ||
        conversation.otherUser?.name.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredConversations: filtered });
  },


  // Obtener conversación actual
  currentConversation: (conversationId: string) => {
    const { conversations } = get();
    return conversations.find((conv) => conv._id === conversationId);
  },

  // Inicializar conversaciones
  initialize: () => {
    const state = get();
    if (state.conversations.length === 0 && !state.isLoading) {
      get().loadConversations();
    }
  },

  // Editar mensaje
  updateMessage: async (messageId: string, content: string) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    try {
      const updatedMessage = await messageService.updateMessage(
        messageId,
        content
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]:
            state.messages[activeConversationId]?.map((msg: Message) =>
              msg._id === messageId ? updatedMessage : msg
            ) || [],
        },
      }));
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  },

  // Eliminar mensaje
  deleteMessage: async (messageId: string) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    try {
      await messageService.deleteMessage(messageId);

      set((state) => ({
        messages: {
          ...state.messages,
          [activeConversationId]:
            state.messages[activeConversationId]?.filter(
              (msg: Message) => msg._id !== messageId
            ) || [],
        },
      }));

      get().loadConversations();
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },
}));
