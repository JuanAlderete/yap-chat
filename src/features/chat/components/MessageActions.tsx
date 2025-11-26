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
            className="absolute top-1 right-1 p-1 hover:bg-black/10 rounded touch-manipulation cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
            className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] max-w-md sm:w-full rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Editar mensaje</DialogTitle>
            <DialogDescription className="text-sm">
              Modifica el contenido de tu mensaje
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="min-h-20 md:min-h-24 text-sm"
            maxLength={5000}
            disabled={isSubmitting}
          />

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isSubmitting || !editContent.trim()}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[95%] max-w-md sm:w-full rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">¿Eliminar mensaje?</DialogTitle>
            <DialogDescription className="text-sm">
              Esta acción no se puede deshacer. El mensaje será eliminado
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
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
