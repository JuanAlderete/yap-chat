import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState } from "react";
import type { Conversation } from "@/types/chat.types";

function ChatWindow() {
  const { conversationId } = useParams();
  const isMobile = useIsMobile();
  const currentUserId: string = "1";
  const { activeConversationId, currentConversation } = useChatStore();

  const [conversation, setConversation] = useState<Conversation>();

  useEffect(() => {
    if (!conversationId) return;
    const conversation = currentConversation(conversationId);
    if (!conversation) return;
    setConversation(conversation);
  }, [activeConversationId]);

  return (
    <div
      className={`flex flex-col h-full w-full ${
        isMobile ? "rounded-none" : "rounded-lg"
      }`}
    >
      <header className="flex items-center justify-between px-4 py-2 bg-sidebar rounded-t-lg rounded-b-xs shadow-sm">
        <p className="text-xl font-medium">{conversation?.name}</p>
        {/* Botón de acciones */}
        {/* <div className="flex items-center gap-2">
          <Button className="rounded-full bg-black p-5 hover:bg-red-500"></Button>
          <Button className="rounded-full bg-black p-5 hover:bg-red-500"></Button>
        </div> */}
      </header>
      <div className="flex-1 flex flex-col w-full p-4">
        {conversation?.messages.map((message) => (
          <div
            className={`${currentUserId === message.userId ? "ml-auto" : ""}`}
            key={message.id}
          >
            <ChatBubble message={message} />
          </div>
        ))}
      </div>
      <footer className="flex w-full items-center gap-2">
        <Input className="w-full rounded-xl bg-sidebar text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none shadow-lg" />
        <Button type="submit" variant="outline" className="shadow-lg">
          Send
        </Button>
      </footer>
    </div>
  );
}

export default ChatWindow;
