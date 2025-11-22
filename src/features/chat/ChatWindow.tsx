import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { Message } from "@/types/chat.types";

function ChatWindow() {
  const { conversationId } = useParams();
  const isMobile = useIsMobile();

  const {
    setActiveConversation,
    currentConversation,
    sendMessage,
    loadMessages,
    messages,
    isLoading,
  } = useChatStore();

  const currentUser = useAuthStore((state) => state.user);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
      loadMessages(conversationId);
    }
    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[conversationId || ""]]);

  const conversation = conversationId
    ? currentConversation(conversationId)
    : null;

  const conversationMessages = conversationId
    ? messages[conversationId] || []
    : [];

  const sortedMessages = [...conversationMessages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading && conversationMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (!conversation && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Conversación no encontrada</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full w-full ${
        isMobile ? "rounded-none" : "rounded-lg"
      }`}
    >
      <header className="flex items-center justify-between px-4 py-2 bg-sidebar rounded-t-lg rounded-b-xs shadow-sm">
        <p className="text-xl font-medium">
          {conversation?.otherUser?.name || conversation?.name || "Chat"}
        </p>
      </header>

      <div className="flex-1 flex flex-col w-full p-4 overflow-y-auto border-l-2 border-sidebar">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No hay mensajes aún. ¡Envía el primero!</p>
          </div>
        ) : (
          <>
            {sortedMessages.map((message: Message) => {
              const isOwnMessage =
                typeof message.senderId === "string"
                  ? message.senderId === currentUser?._id
                  : message.senderId._id === currentUser?._id;

              return (
                <div
                  className={`${isOwnMessage ? "ml-auto" : ""} mb-2`}
                  key={message._id}
                >
                  <ChatBubble message={message} isOwnMessage={isOwnMessage} />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <footer className="flex w-full items-center gap-2 p-4 border-l-2 border-sidebar">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="w-full rounded-xl bg-sidebar text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none shadow-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="outline"
            className="shadow-lg"
            disabled={!messageInput.trim() || isLoading}
          >
            Enviar
          </Button>
        </form>
      </footer>
    </div>
  );
}

export default ChatWindow;
