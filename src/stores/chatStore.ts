import type { ChatStore } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoading: false,

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
  },

  sendMessage: (message: string) => {
    // TODO: enviar mensaje
    console.log("sendMessage", message);
  },

  loadConversations: () => {
    // TODO: cargar conversaciones
    console.log("loadConversations");
  },

  loadMessages: (conversationId: string) => {
    // TODO: cargar mensajes
    console.log("loadMessages", conversationId);
  },
}));
