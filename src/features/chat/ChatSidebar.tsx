import { Link } from "react-router-dom";
import ChatMenuItem from "./components/ChatMenuItem";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useRef } from "react";

function ChatSidebar() {
  const {
    filteredConversations,
    searchQuery,
    setActiveConversation,
    initialize,
  } = useChatStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      initialize();
      hasInitialized.current = true;
    }
  }, []);

  const handleClick = (conversationId: string) => {
    setActiveConversation(conversationId);
  };

  const displayConversations =
    filteredConversations.length > 0 ? filteredConversations : [];

  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-64px)] customScrollbar pr-2 mt-12 w-full">
      {searchQuery && displayConversations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No chats found for "{searchQuery}"</p>
          <p className="text-xs mt-1">Try different keywords</p>
        </div>
      )}

      {displayConversations.map((conversation) => (
        <Link
          key={conversation._id}
          to={`/chat/${conversation._id}`}
          onClick={() => handleClick(conversation._id)}
        >
          <ChatMenuItem conversation={conversation} searchQuery={searchQuery} />
        </Link>
      ))}
    </div>
  );
}

export default ChatSidebar;