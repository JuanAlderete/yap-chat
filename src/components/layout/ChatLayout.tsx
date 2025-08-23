import ChatSidebar from "@/features/chat/ChatSidebar";
import ChatWindow from "@/features/chat/ChatWindow";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatStore } from "@/stores/chatStore";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

function ChatLayout() {
  const isMobile = useIsMobile();
  const { conversationId } = useParams();
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );
  const hasActiveChat = !!(conversationId || activeConversationId);

  useEffect(() => {
    if (conversationId && activeConversationId !== conversationId) {
      setActiveConversation(conversationId);
    } else {
      setActiveConversation(null);
    }
  }, [conversationId, setActiveConversation]);

  return (
    <div
      className={`flex h-full gap-2 ${
        isMobile && hasActiveChat ? "m-0" : "my-2 mx-4"
      }`}
    >
      {/* Sidebar - oculto en mobile cuando hay chat activo */}
      {/* TODO: agregar scroll-snap-type: x mandatory para que el sidebar se pueda desplazar */}
      <div
        className={`${isMobile ? "w-full" : "w-80 min-w-60 max-w-80"} ${
          isMobile && hasActiveChat ? "hidden" : "flex"
        }`}
      >
        <ChatSidebar />
      </div>

      <div className={`flex w-full`}>
        <Outlet />
      </div>
    </div>
  );
}

export default ChatLayout;
