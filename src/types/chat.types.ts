export interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  searchQuery: string;
  filteredConversations: Conversation[];

  setActiveConversation: (id: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  updateMessage: (messageId: string, content: string) => Promise<void>; // <-- Agregar
  deleteMessage: (messageId: string) => Promise<void>; // <-- Agregar
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  currentConversation: (conversationId: string) => Conversation | undefined;
  initialize: () => void;
}

export interface Conversation {
  _id: string;
  participants?: string[];
  otherUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  name?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId:
    | string
    | {
        _id: string;
        name: string;
        avatar?: string;
      };
  content: string;
  isRead?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
