import { Link } from "react-router-dom";
import ChatMenuItem from "./components/ChatMenuItem";
import { useChatStore } from "@/stores/chatStore";

function ChatSidebar() {
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  const handleClick = (index: number) => {
    setActiveConversation(index.toString());
  };

  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-48px)] customScrollbar pr-2 mt-8">
      {/* Lista de chats */}
      {Array.from({ length: 20 }).map((_, index) => (
        <Link to={`/chat/${index+1}`} onClick={() => handleClick(index)}>
          <ChatMenuItem key={index} index={index} />
        </Link>
      ))}
    </div>
  );
}

export default ChatSidebar;
