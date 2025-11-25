import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewChat from "../../components/common/NewChat";
import { MessageSquarePlus, Users, MessageCircle } from "lucide-react";

function EmptyChatState() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center gap-6 p-8">
        <div className="relative">
          <MessageSquarePlus className="h-20 w-20 text-muted-foreground" />
          <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
            <Users className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-2xl font-bold">Bienvenido a YAP Chat</h1>
          <p className="text-sm text-muted-foreground">
            No tienes conversaciones activas. Inicia una nueva conversación
            buscando un usuario por su nombre o email.
          </p>
        </div>
        <Button onClick={handleOpenDialog} size="lg" className="mt-2">
          <MessageSquarePlus className="h-5 w-5 mr-2" />
          Nueva conversación
        </Button>
        <div className="mt-8 space-y-3 max-w-md">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              También puedes crear conversaciones desde el botón en el sidebar
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Users className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>Busca usuarios verificados y comienza a chatear al instante</p>
          </div>
        </div>
      </div>
      <NewChat openDialog={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default EmptyChatState;
