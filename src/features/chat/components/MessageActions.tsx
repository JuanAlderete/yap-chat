import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import type { Message } from "@/types/chat.types";
import { useChatStore } from "@/stores/chatStore";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";

interface MessageActionsProps {
  message: Message;
  isOwnMessage: boolean;
}

function MessageActions({ message, isOwnMessage }: MessageActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateMessage, deleteMessage } = useChatStore();

  if (!isOwnMessage) return null;

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === message.content) {
      setIsEditDialogOpen(false);
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(
        () => updateMessage(message._id!, editContent.trim()),
        {
          loading: "Actualizando mensaje...",
          success: "Mensaje actualizado exitosamente",
          error: "Error al actualizar mensaje",
        }
      );
      setIsEditDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Error al editar mensaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await toast.promise(() => deleteMessage(message._id!), {
        loading: "Eliminando mensaje...",
        success: "Mensaje eliminado exitosamente",
        error: "Error al eliminar mensaje",
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Error al eliminar mensaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditContent(message.content);
              setIsEditDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar mensaje</DialogTitle>
            <DialogDescription>
              Modifica el contenido de tu mensaje
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="min-h-24"
            maxLength={5000}
            disabled={isSubmitting}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isSubmitting || !editContent.trim()}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar mensaje?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El mensaje será eliminado
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MessageActions;
