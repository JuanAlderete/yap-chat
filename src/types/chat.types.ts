export interface ChatStore {
  // Estado
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  searchQuery: string;
  filteredConversations: Conversation[];

  // Acciones
  setActiveConversation: (id: string | null) => void;
  sendMessage: (message: string) => void;
  loadConversations: () => void;
  loadMessages: (conversationId: string) => void;
  setSearchQuery: (query: string) => void;
  currentConversation: (conversationId: string) => Conversation | undefined;
  initialize: () => void;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string | null;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}
