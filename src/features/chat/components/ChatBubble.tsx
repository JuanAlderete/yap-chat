import type { Message } from "@/types/chat.types";
import { format } from "date-fns";
import MessageActions from "./MessageActions";

interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function ChatBubble({ message, isOwnMessage }: ChatBubbleProps) {
  const senderName =
    typeof message.senderId === "object" ? message.senderId.name : "Usuario";

  const messageTime = message.created_at
    ? format(new Date(message.created_at), "HH:mm")
    : "";

  return (
    <div
      className={`flex flex-col gap-1 p-3 rounded-lg w-fit max-w-md mb-2 shadow-md relative group ${
        isOwnMessage
          ? "bg-primary text-primary-foreground ml-auto"
          : "bg-sidebar text-foreground"
      }`}
    >
      <MessageActions message={message} isOwnMessage={isOwnMessage} />
      {!isOwnMessage && (
        <p className="text-xs font-semibold opacity-70">{senderName}</p>
      )}
      <p className="text-sm break-words whitespace-pre-wrap pr-6">
        {message.content}
      </p>
      <div className="flex items-center gap-1 justify-end">
        {message.updated_at && message.updated_at !== message.created_at && (
          <span className="text-[9px] opacity-50">(editado)</span>
        )}
        <p
          className={`text-[10px] ${
            isOwnMessage ? "opacity-70" : "opacity-50"
          }`}
        >
          {messageTime}
        </p>
      </div>
    </div>
  );
}

export default ChatBubble;
