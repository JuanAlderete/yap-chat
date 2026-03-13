import { conversationService } from "@/services/conversation.service";
import { messageService } from "@/services/message.service";
import type { ChatStore, Message } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoadingConversations: false,
  isLoadingMessages: false,
  get isLoading() {
    return this.isLoadingConversations || this.isLoadingMessages;
  },
  searchQuery: "",
  filteredConversations: [],

  // Cargar conversaciones desde el backend
  loadConversations: async () => {
    const state = get();

    if (state.isLoadingConversations) return;

    set({ isLoadingConversations: true });
    try {
      const conversations = await conversationService.getMyConversations();
      set({
        conversations,
        filteredConversations: conversations,
        isLoadingConversations: false,
      });
    } catch (error) {
      console.error("Error loading conversations:", error);
      set({ isLoadingConversations: false });
    }
  },

  // Cargar mensajes de una conversación
  loadMessages: async (
    conversationId: string,
    forceReload: boolean = false
  ) => {
    const state = get();

    if (state.isLoadingMessages && !forceReload) return;

    if (!forceReload && state.messages[conversationId]?.length > 0) {
      return;
    }

    set({ isLoadingMessages: true });
    try {
      const response = await messageService.getMessages(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: response.messages,
        },
        isLoadingMessages: false,
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
      set({ isLoadingMessages: false });
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

      // Insertamos localmente para el emisor pero con guard contra duplicados
      // (por si el socket entrega el evento antes de que termine el HTTP POST)
      set((state) => {
        const existing = state.messages[activeConversationId] || [];
        if (existing.some((m) => m._id === newMessage._id)) {
          return state; // Ya llegó por socket
        }

        return {
          messages: {
            ...state.messages,
            [activeConversationId]: [...existing, newMessage],
          },
        };
      });

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

    // Reset unread count for this conversation
    set((state) => ({
      activeConversationId: id,
      conversations: state.conversations.map((conv) =>
        conv._id === id ? { ...conv, unreadCount: 0 } : conv
      ),
      filteredConversations: state.filteredConversations.map((conv) =>
        conv._id === id ? { ...conv, unreadCount: 0 } : conv
      ),
    }));

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
    if (state.conversations.length === 0 && !state.isLoadingConversations) {
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

  // Eliminar conversación (desde la UI)
  deleteConversation: async (id: string) => {
    try {
      await conversationService.deleteConversation(id);

      set((state) => {
        const { [id]: _removed, ...remainingMessages } = state.messages;
        void _removed;
        return {
          conversations: state.conversations.filter((c) => c._id !== id),
          filteredConversations: state.filteredConversations.filter(
            (c) => c._id !== id
          ),
          messages: remainingMessages,
          activeConversationId:
            state.activeConversationId === id
              ? null
              : state.activeConversationId,
        };
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  },

  // ── Socket real-time methods ──────────────────────────────────────────────

  // Agrega un mensaje nuevo sin hacer fetch
  addMessage: (conversationId: string, message: Message) => {
    const { activeConversationId, messages } = get();
    const isActive = activeConversationId === conversationId;

    // Evitar duplicados: si el mensaje ya existe (insertado localmente por sendMessage), ignorar
    const existing = messages[conversationId];
    if (existing?.some((m) => m._id === message._id)) return;

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          message,
        ],
      },
      // Increment unread count only for non-active conversations
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId && !isActive
          ? { ...conv, unreadCount: (conv.unreadCount ?? 0) + 1 }
          : conv
      ),
      filteredConversations: state.filteredConversations.map((conv) =>
        conv._id === conversationId && !isActive
          ? { ...conv, unreadCount: (conv.unreadCount ?? 0) + 1 }
          : conv
      ),
    }));
  },

  // Reemplaza un mensaje existente por su ID
  replaceMessage: (conversationId: string, message: Message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.map((msg) =>
            msg._id === message._id ? message : msg
          ) || [],
      },
    }));
  },

  // Elimina un mensaje por ID
  removeMessage: (conversationId: string, messageId: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.filter(
            (msg) => msg._id !== messageId
          ) || [],
      },
    }));
  },
}));
