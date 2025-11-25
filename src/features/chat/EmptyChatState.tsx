import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewChat from "../../components/common/NewChat";
import { MessageSquarePlus } from "lucide-react";

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
      <div className="flex flex-col h-full w-full items-center justify-center gap-4 p-8">
        <MessageSquarePlus className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-center text-xl font-bold">
          No hay conversaciones activas
        </h1>
        <p className="text-center text-sm text-muted-foreground max-w-md">
          Inicia una nueva conversación con alguien para empezar a chatear
        </p>
        <Button onClick={handleOpenDialog} size="lg" className="mt-4">
          <MessageSquarePlus className="h-5 w-5 mr-2" />
          Nueva conversación
        </Button>
      </div>
      <NewChat openDialog={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default EmptyChatState;
