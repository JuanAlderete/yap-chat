import { Link } from "react-router-dom";
import ChatMenuItem from "./components/ChatMenuItem";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useRef } from "react";
import EmptyChatState from "./EmptyChatState";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonChatItem() {
  return (
    <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-sidebar">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-4/5" />
      </div>
    </div>
  );
}

function ChatSidebar() {
  const {
    filteredConversations,
    conversations,
    searchQuery,
    setActiveConversation,
    initialize,
    isLoading,
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
    <>
      <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-64px)] customScrollbar mt-12 md:mt-12 w-full">
        {/* Skeleton loaders while conversations are loading */}
        {isLoading && conversations.length === 0 &&
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonChatItem key={i} />
          ))
        }

        {searchQuery && displayConversations.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground px-4">
            <p className="text-xs md:text-sm">
              No se encontraron conversaciones con el término "{searchQuery}"
            </p>
            <p className="text-xs mt-1">Prueba con otro término</p>
          </div>
        )}

        {displayConversations.map((conversation) => (
          <Link
            key={conversation._id}
            to={`/chat/${conversation._id}`}
            onClick={() => handleClick(conversation._id)}
            className="block"
          >
            <ChatMenuItem
              conversation={conversation}
              searchQuery={searchQuery}
            />
          </Link>
        ))}

        {!searchQuery && displayConversations.length === 0 && !isLoading && (
          <div className="h-full md:hidden">
            <EmptyChatState />
          </div>
        )}
      </div>
    </>
  );
}

export default ChatSidebar;
