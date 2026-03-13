import { io, Socket } from "socket.io-client";
import type { Message } from "@/types/chat.types";

const SOCKET_URL = (
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/api"
).replace(/\/api$/, "");

class SocketService {
  private socket: Socket | null = null;
  private pendingJoins: Set<string> = new Set();

  connect(token: string): void {
    // If already connected or connecting, skip
    if (this.socket?.connected || this.socket?.active) return;

    // Clean up any previous dead socket
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    console.log("[Socket] Conectando a:", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // Debug: Log ALL events received from the server
    this.socket.onAny((eventName: string, ...args: unknown[]) => {
      console.log("[Socket] Evento recibido:", eventName, args);
    });

    this.socket.on("connect", () => {
      console.log("[Socket] Conectado:", this.socket?.id);

      // Re-join any pending conversations after (re)connection
      for (const convId of this.pendingJoins) {
        console.log("[Socket] Re-joining conversation after connect:", convId);
        this.socket?.emit("join:conversation", convId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Desconectado:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[Socket] Error de conexión:", err.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.pendingJoins.clear();
  }

  joinConversation(conversationId: string): void {
    console.log("[Socket] Joining conversation:", conversationId, "connected:", this.socket?.connected);
    this.pendingJoins.add(conversationId);

    if (this.socket?.connected) {
      this.socket.emit("join:conversation", conversationId);
    }
    // If not connected yet, the "connect" handler above will emit join_conversation
  }

  leaveConversation(conversationId: string): void {
    console.log("[Socket] Leaving conversation:", conversationId);
    this.pendingJoins.delete(conversationId);
    this.socket?.emit("leave:conversation", conversationId);
  }

  onNewMessage(cb: (message: Message) => void): void {
    this.socket?.on("message:new", cb);
  }

  onUpdatedMessage(cb: (message: Message) => void): void {
    this.socket?.on("message:updated", cb);
  }

  onDeletedMessage(
    cb: (data: { messageId: string; conversationId: string }) => void
  ): void {
    this.socket?.on("message:deleted", cb);
  }

  onTypingStart(
    cb: (data: { userId: string; conversationId: string }) => void
  ): void {
    this.socket?.on("typing:start", cb);
  }

  onTypingStop(
    cb: (data: { userId: string; conversationId: string }) => void
  ): void {
    this.socket?.on("typing:stop", cb);
  }

  emitTypingStart(conversationId: string): void {
    this.socket?.emit("typing:start", { conversationId });
  }

  emitTypingStop(conversationId: string): void {
    this.socket?.emit("typing:stop", { conversationId });
  }

  /** Remove only the chat event listeners, keep core ones (connect, disconnect, connect_error, onAny) */
  offChatListeners(): void {
    this.socket?.off("message:new");
    this.socket?.off("message:updated");
    this.socket?.off("message:deleted");
    this.socket?.off("typing:start");
    this.socket?.off("typing:stop");
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
