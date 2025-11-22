export interface ChatStore {
  messages: any;

  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  searchQuery: string;
  filteredConversations: Conversation[];

  setActiveConversation: (id: string | null) => void;
  sendMessage: (message: string) => void;
  loadConversations: () => void;
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
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
}
