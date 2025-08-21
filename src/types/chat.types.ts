export interface ChatStore {
  // Estado
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // por conversationId
  isLoading: boolean;

  // Acciones
  setActiveConversation: (id: string | null) => void;
  sendMessage: (message: string) => void;
  loadConversations: () => void;
  loadMessages: (conversationId: string) => void;
}

export interface Conversation {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}
