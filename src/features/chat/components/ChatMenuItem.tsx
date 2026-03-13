// src/features/chat/components/ChatMenuItem.tsx
import { useChatStore } from "@/stores/chatStore";
import type { ChatStore, Conversation } from "@/types/chat.types";
import { differenceInMinutes, differenceInHours, format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatMenuItemProps {
  conversation: Conversation;
  searchQuery?: string;
}

function ChatMenuItem({ conversation, searchQuery = "" }: ChatMenuItemProps) {
  const activeConversationId = useChatStore(
    (state: ChatStore) => state.activeConversationId
  );
  const deleteConversation = useChatStore(
    (state: ChatStore) => state.deleteConversation
  );
  const isActive = activeConversationId === conversation._id;

  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // tick forces a re-render every 60 seconds so relative timestamps stay fresh
  const [, setTick] = useState(0);

  // ── Auto-refresh timestamps every 60 s ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-orange-300 dark:bg-orange-800 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatTime = (date: Date): string => {
    const mins = differenceInMinutes(new Date(), date);

    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;

    const hours = differenceInHours(new Date(), date);
    if (hours < 24) return `${hours}h ago`;
    return format(date, "P", { locale: es });
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDeleteDialog(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteConversation(conversation._id);
      if (activeConversationId === conversation._id) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }, [conversation._id, activeConversationId, deleteConversation, navigate]);

  return (
    <>
      <div
        className={`group relative flex items-center gap-2 p-2 md:p-3 rounded-md cursor-pointer transition-colors duration-200 ${
          isActive ? "bg-[#E6D6CA] shadow-md" : "bg-sidebar hover:bg-[#E6D6CA]"
        }`}
      >
        {/* Avatar circle */}
        <div className="flex-shrink-0">
          <div className="rounded-full bg-emerald-200 px-2 py-1">
            <div className="text-xs font-medium">
              {conversation.otherUser?.name?.charAt(0).toUpperCase() ||
                conversation.name?.charAt(0).toUpperCase() ||
                "C"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-xs md:text-sm truncate flex-1">
              {highlightText(
                conversation.otherUser?.name || conversation.name || "Chat",
                searchQuery
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {/* Unread badge */}
              {(conversation.unreadCount ?? 0) > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
                  {conversation.unreadCount}
                </span>
              )}

              {/* Relative timestamp */}
              <div className="text-[10px] md:text-xs text-muted-foreground">
                {formatTime(
                  conversation.lastMessageAt || conversation.updated_at || new Date()
                )}
              </div>
            </div>
          </div>

          {conversation.lastMessage && (
            <div className="text-[10px] md:text-xs text-muted-foreground truncate">
              {highlightText(conversation.lastMessage, searchQuery)}
            </div>
          )}
        </div>

        {/* Delete button — visible on hover */}
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
          title="Eliminar conversación"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar conversación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la conversación con{" "}
              <strong>
                {conversation.otherUser?.name || conversation.name || "este usuario"}
              </strong>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChatMenuItem;
