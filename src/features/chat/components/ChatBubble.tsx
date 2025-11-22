import type { Message } from "@/types/chat.types";
import { format } from "date-fns";

interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function ChatBubble({ message, isOwnMessage }: ChatBubbleProps) {
  // Obtener el nombre del remitente (si viene POPULATE)
  const senderName =
    typeof message.senderId === "object" ? message.senderId.name : "Usuario";

  const messageTime = message.createdAt
    ? format(new Date(message.createdAt), "HH:mm")
    : "";

  return (
    <div
      className={`flex flex-col gap-1 p-3 rounded-lg w-fit max-w-md mb-2 shadow-md ${
        isOwnMessage
          ? "bg-primary text-primary-foreground ml-auto"
          : "bg-sidebar text-foreground"
      }`}
    >
      {!isOwnMessage && (
        <p className="text-xs font-semibold opacity-70">{senderName}</p>
      )}
      <p className="text-sm break-words">{message.content}</p>
      <p
        className={`text-[10px] text-right ${
          isOwnMessage ? "opacity-70" : "opacity-50"
        }`}
      >
        {messageTime}
      </p>
    </div>
  );
}

export default ChatBubble;
