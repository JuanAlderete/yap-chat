import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { Message } from "@/types/chat.types";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
  const { conversationId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
  const [isSending, setIsSending] = useState(false);

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

    if (!messageInput.trim() || isSending) return;

    setIsSending(true);

    try {
      await sendMessage(messageInput);
      setMessageInput("");

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading && conversationMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (!conversation && !isLoading) {
    return (
      <div className="flex flex-col h-full w-full md:items-center md:justify-center">
        <header className="flex items-center justify-between px-3 md:px-4 py-2 bg-sidebar shadow-sm md:hidden">
          {isMobile && (
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </header>
        <p className="text-center mt-8">Conversación no encontrada</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full w-full ${
        isMobile ? "rounded-none" : "rounded-lg"
      }`}
    >
      <header className="flex items-center justify-between px-3 md:px-4 py-2 bg-sidebar md:rounded-t-lg shadow-sm">
        {isMobile && (
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage
              src={
                conversation?.otherUser?.avatar ||
                "https://github.com/shadcn.png"
              }
              alt={conversation?.otherUser?.name}
            />
            <AvatarFallback>
              {conversation?.otherUser?.name?.charAt(0).toUpperCase() ||
                conversation?.name?.charAt(0).toUpperCase() ||
                "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-base md:text-xl font-medium truncate">
              {conversation?.otherUser?.name || conversation?.name || "Chat"}
            </p>
            <p className="text-xs text-muted-foreground">
              {conversation?.otherUser?.email}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col w-full p-4 overflow-y-auto md:border-l-2 md:border-sidebar">
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
                  className={`${isOwnMessage ? "ml-auto" : ""} mb-1`}
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

      <footer className="flex w-full items-center gap-2 p-2 md:p-4 md:border-l-2 md:border-sidebar">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="w-full rounded-xl bg-sidebar text-xs md:text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none shadow-lg"
            disabled={isLoading || isSending}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="outline"
            className="shadow-lg flex-shrink-0 h-9 px-3 md:px-4"
            disabled={!messageInput.trim() || isLoading || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Enviar</span>
              </>
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
}

export default ChatWindow;
