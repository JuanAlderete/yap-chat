import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { Message } from "@/types/chat.types";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { socketService } from "@/services/socket.service";

const EMPTY_MESSAGES: Message[] = [];

function ChatWindow() {
  const { conversationId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const sendMessageAction = useChatStore((s) => s.sendMessage);
  const loadMessages = useChatStore((s) => s.loadMessages);
  const loadConversations = useChatStore((s) => s.loadConversations);
  const isLoadingMessages = useChatStore((s) => s.isLoadingMessages);
  const isLoadingConversations = useChatStore((s) => s.isLoadingConversations);
  const addMessage = useChatStore((s) => s.addMessage);
  const replaceMessage = useChatStore((s) => s.replaceMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const conversations = useChatStore((s) => s.conversations);
  const allMessages = useChatStore((s) => s.messages);

  // Derive messages and conversation from store state using stable references
  const conversationMessages = (conversationId ? allMessages[conversationId] : undefined) ?? EMPTY_MESSAGES;
  const conversation = conversations.find((c) => c._id === conversationId);

  const currentUser = useAuthStore((state) => state.user);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load conversations if not loaded yet ────────────────────────────────
  useEffect(() => {
    if (conversations.length === 0) {
      loadConversations();
    }
  }, [conversations.length, loadConversations]);

  // ── Set active conversation & load messages ─────────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    setActiveConversation(conversationId);
    loadMessages(conversationId);

    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation, loadMessages]);

  // ── Socket effect (separate from data loading) ──────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    socketService.joinConversation(conversationId);

    const handleNewMessage = (message: Message) => {
      console.log("[Socket] new_message recibido:", message._id, message.content?.substring(0, 30));
      if (message.conversationId === conversationId) {
        addMessage(conversationId, message);
      }
    };

    const handleUpdatedMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        replaceMessage(conversationId, message);
      }
    };

    const handleDeletedMessage = ({
      messageId,
      conversationId: cid,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      if (cid === conversationId) {
        removeMessage(conversationId, messageId);
      }
    };

    const handleTypingStart = ({ userId }: { userId: string }) => {
      console.log("[Socket] typing:start from:", userId);
      if (userId !== currentUser?._id) {
        setIsOtherUserTyping(true);
      }
    };

    const handleTypingStop = ({ userId }: { userId: string }) => {
      if (userId !== currentUser?._id) {
        setIsOtherUserTyping(false);
      }
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUpdatedMessage(handleUpdatedMessage);
    socketService.onDeletedMessage(handleDeletedMessage);
    socketService.onTypingStart(handleTypingStart);
    socketService.onTypingStop(handleTypingStop);

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.offChatListeners();
      setIsOtherUserTyping(false);
    };
  }, [conversationId, currentUser?._id, addMessage, replaceMessage, removeMessage]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const sortedMessages = [...conversationMessages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // ── Typing indicator ───────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessageInput(e.target.value);

      if (!conversationId) return;

      socketService.emitTypingStart(conversationId);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketService.emitTypingStop(conversationId);
      }, 1000);
    },
    [conversationId]
  );

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || isSending) return;

    setIsSending(true);

    // Stop typing indicator immediately
    if (conversationId) {
      socketService.emitTypingStop(conversationId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    try {
      await sendMessageAction(messageInput);
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

  // ── Loading state ──────────────────────────────────────────────────────────
  if ((isLoadingMessages || isLoadingConversations) && conversationMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (!conversation && !isLoadingConversations && conversations.length > 0) {
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
            <p className="text-xs text-muted-foreground transition-all duration-200 min-h-[1rem]">
              {isOtherUserTyping ? (
                <span className="italic text-primary animate-pulse">
                  escribiendo...
                </span>
              ) : (
                conversation?.otherUser?.email
              )}
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
            onChange={handleInputChange}
            placeholder="Escribe un mensaje..."
            className="w-full h-11 px-4 py-3 rounded-xl bg-sidebar text-xs md:text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none shadow-lg transition-transform focus-within:scale-[1.01]"
            disabled={isLoadingMessages || isSending}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="outline"
            className="shadow-lg flex-shrink-0 h-11 rounded-xl px-4 md:px-5"
            disabled={!messageInput.trim() || isLoadingMessages || isSending}
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
