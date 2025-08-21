import type { Message } from "@/types/chat.types";

function ChatBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 p-2 rounded-md w-fit bg-sidebar text-black shadow-md">
      <p className="text-sm align-self-end text-popover-foreground">{message.content}</p>
      <p className="text-black text-right text-[10px]">
        {message.createdAt.getHours()}:{message.createdAt.getMinutes()}
      </p>
    </div>
  );
}

export default ChatBubble;
