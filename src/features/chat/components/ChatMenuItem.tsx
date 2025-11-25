// src/features/chat/components/ChatMenuItem.tsx
import { useChatStore } from "@/stores/chatStore";
import type { ChatStore, Conversation } from "@/types/chat.types";
import { differenceInMinutes, differenceInHours, format } from "date-fns";
import { es } from "date-fns/locale";

interface ChatMenuItemProps {
  conversation: Conversation;
  searchQuery?: string;
}

function ChatMenuItem({ conversation, searchQuery = "" }: ChatMenuItemProps) {
  const activeConversationId = useChatStore(
    (state: ChatStore) => state.activeConversationId
  );
  const isActive = activeConversationId === conversation._id;

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-orange-300 dark:bg-orange-800 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  const formatTime = (date: Date): string => {
    const mins = differenceInMinutes(new Date(), date);

    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;

    const hours = differenceInHours(new Date(), date);
    if (hours < 24) return `${hours}h ago`;
    return format(date, "P", { locale: es });
  };

  const formatName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }
    if (conversation.otherUser) {
      return conversation.otherUser.name;
    }
    return "Chat";
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 md:p-3 rounded-md cursor-pointer transition-colors duration-200 ${
        isActive ? "bg-[#E6D6CA] shadow-md" : "bg-sidebar hover:bg-[#E6D6CA]"
      }`}
    >
      <div className="flex-shrink-0">
        <div className="rounded-full bg-emerald-200 px-2 py-1">
          <div className="text-xs font-medium">
            {conversation.otherUser?.name?.charAt(0).toUpperCase() ||
              conversation.name?.charAt(0).toUpperCase() ||
              "C"}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium text-xs md:text-sm truncate flex-1">
            {highlightText(
              conversation.otherUser?.name || conversation.name || "Chat",
              searchQuery
            )}
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground flex-shrink-0 ml-2">
            {formatTime(
              conversation.lastMessageAt || conversation.updated_at || new Date()
            )}
          </div>
        </div>

        {conversation.lastMessage && (
          <div className="text-[10px] md:text-xs text-muted-foreground truncate">
            {highlightText(conversation.lastMessage, searchQuery)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMenuItem;
