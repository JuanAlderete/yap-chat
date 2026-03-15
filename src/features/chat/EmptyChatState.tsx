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
      <div className="flex flex-col h-full w-full justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-[5.5rem] md:leading-[1.05] font-black tracking-tighter mb-8 animate-fade-up">
            Tu lienzo <br className="hidden sm:block"/>
            <span className="text-muted-foreground/50">está en blanco.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium animate-fade-up animate-fade-up-delayed-1">
            No hay conversaciones activas por el momento. Rompe el hielo e inicia un nuevo chat buscando un usuario por su nombre o correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-32 animate-fade-up animate-fade-up-delayed-2">
            <Button onClick={handleOpenDialog} size="lg" className="h-16 px-10 text-lg font-bold rounded-none hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-xl hover:shadow-primary/20">
              <MessageSquarePlus aria-hidden="true" className="h-6 w-6 mr-3" />
              Comenzar a chatear
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-12 border-t-2 border-border/50 animate-fade-up animate-fade-up-delayed-3">
            <div className="flex flex-col gap-4 group hover:bg-secondary/10 p-4 -m-4 rounded-xl transition-colors">
              <div className="h-14 w-14 flex items-center justify-center bg-secondary/40 text-secondary-foreground mb-2 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                <MessageCircle aria-hidden="true" className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-2xl tracking-tight">Acceso Rápido</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                También puedes crear conversaciones directamente usando el botón dedicado en la barra lateral.
              </p>
            </div>
            <div className="flex flex-col gap-4 group hover:bg-secondary/10 p-4 -m-4 rounded-xl transition-colors">
              <div className="h-14 w-14 flex items-center justify-center bg-secondary/40 text-secondary-foreground mb-2 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                <Users aria-hidden="true" className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-2xl tracking-tight">Usuarios Verificados</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Busca en nuestro directorio y comienza a chatear al instante. Seguro, rápido y sin fricciones.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NewChat openDialog={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default EmptyChatState;
