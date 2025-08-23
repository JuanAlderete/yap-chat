// src/stores/chatStore.ts
import type { ChatStore } from "@/types/chat.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [
        {
          id: "1",
          name: "Conversación sobre React",
          lastMessage: "¿Cómo implementar hooks?",
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        },
        {
          id: "2",
          name: "Planning del proyecto",
          lastMessage: "Necesitamos revisar el cronograma",
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        },
        {
          id: "3",
          name: "Dudas sobre TypeScript",
          lastMessage: "Los tipos genéricos son confusos",
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        },
        {
          id: "4",
          name: "Chat con el equipo",
          lastMessage: "¿Vamos a almorzar juntos?",
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        },
        {
          id: "5",
          name: "Soporte técnico",
          lastMessage: "El error persiste en producción",
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        },
        // Estas son de testing
        ...Array.from({ length: 15 }, (_, i) => ({
          id: (i + 6).toString(),
          name: `Chat ${i + 6}`,
          lastMessage: `Mensaje de prueba ${i + 1}`,
          updatedAt: new Date(),
          messages: [
            {
              id: "1",
              userId: "1",
              content: "Hello, how are you?",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              content: "I'm fine, thanks!",
              createdAt: new Date(),
            },
            {
              id: "3",
              userId: "1",
              content: "I'm good too, thanks!",
              createdAt: new Date(),
            },
          ],
        })),
      ],
      activeConversationId: null,
      messages: {},
      isLoading: false,
      searchQuery: "",
      filteredConversations: [],

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
        const { conversations } = get();

        if (!query.trim()) {
          set({ filteredConversations: conversations });
          return;
        }

        const filtered = conversations.filter(
          (conversation) =>
            conversation.name.toLowerCase().includes(query.toLowerCase()) ||
            conversation.lastMessage?.toLowerCase().includes(query.toLowerCase())
        );

        set({ filteredConversations: filtered });
      },

      setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id });
      },

      sendMessage: (message: string) => {
        // TODO: enviar mensaje
        console.log("sendMessage", message);
      },

      loadConversations: () => {
        // TODO: cargar conversaciones desde API
        const { conversations } = get();
        set({ filteredConversations: conversations });
        console.log("loadConversations");
      },

      loadMessages: (conversationId: string) => {
        // TODO: cargar mensajes
        console.log("loadMessages", conversationId);
      },

      // Obtener conversación actual
      currentConversation: (conversationId: string) => {
        const { conversations } = get();
        return conversations.find(
          (conversation) => conversation.id === conversationId
        );
      },

      // Inicializar chats filtrados
      initialize: () => {
        const { conversations } = get();
        set({ filteredConversations: conversations });
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ 
        activeConversationId: state.activeConversationId,
        searchQuery: state.searchQuery 
      }),
    }
  )
);
