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
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-64px)] customScrollbar pr-2 mt-12 w-full">
      {/* Lista de chats */}
      {Array.from({ length: 20 }).map((_, index) => (
        <Link key={index} to={`/chat/${index+1}`} onClick={() => handleClick(index)}>
          <ChatMenuItem index={index} />
        </Link>
      ))}
    </div>
  );
}

export default ChatSidebar;
