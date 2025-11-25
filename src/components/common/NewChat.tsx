import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/user.service";
import { conversationService } from "@/services/conversation.service";
import { useChatStore } from "@/stores/chatStore";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface NewChatProps {
  openDialog: boolean;
  onClose: () => void;
}

function NewChat({ openDialog, onClose }: NewChatProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const loadConversations = useChatStore((state) => state.loadConversations);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await userService.searchUsers(searchQuery);
        setSearchResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateConversation = async (userId: string) => {
    setIsCreating(true);

    try {
      const result = await toast.promise(
        conversationService.createConversation(userId),
        {
          loading: "Creando conversación...",
          success: "Conversación creada exitosamente",
          error: "Error al crear conversación",
        }
      );
      await loadConversations();
      onClose();
      const conversation = (result as any)?.conversation ?? result;
      navigate(`/chat/${conversation._id}`);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      alert(error.message || "Error al crear conversación");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-[95%] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg md:text-xl">
            Nueva Conversación
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs md:text-sm">
            Busca un usuario para iniciar una conversación
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
            autoFocus
          />
        </div>
        <div className="max-h-48 md:max-h-60 overflow-y-auto space-y-2">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isSearching &&
            searchQuery.length >= 2 &&
            searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No se encontraron usuarios</p>
              </div>
            )}
          {!isSearching && searchQuery.length < 2 && searchQuery.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Escribe al menos 2 caracteres</p>
            </div>
          )}
          {!isSearching &&
            searchResults.map((user) => (
              <button
                key={user._id}
                onClick={() => handleCreateConversation(user._id)}
                disabled={isCreating}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Avatar>
                  <AvatarImage
                    src={user.avatar || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </button>
            ))}
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={handleClose}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default NewChat;
