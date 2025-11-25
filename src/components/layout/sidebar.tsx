import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessagesSquare, Upload } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { convertImageToBase64, validateImageFile } from "@/utils/imageUtils";
import { MessageSquarePlus } from "lucide-react";
import NewChat from "../common/NewChat";
import { toast } from "sonner";

type ProfileFormData = {
  name: string;
  avatar: string;
};

function AppSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const navigate = useNavigate();
  const { filteredConversations, initialize } = useChatStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openNewChat, setOpenNewChat] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const items = [
    {
      title: "Chats",
      url: "#",
      icon: MessagesSquare,
    },
  ];

  const displayConversations =
    filteredConversations.length > 0 ? filteredConversations : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (isDialogOpen && user) {
      setValue("name", user.name || "");
      setAvatarPreview(user.avatar || null);
      setAvatarBase64(null);
    }
  }, [isDialogOpen, user, setValue]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      const base64 = await convertImageToBase64(file);
      setAvatarBase64(base64);
      setAvatarPreview(base64);
    } catch (error) {
      console.error("Error converting image:", error);
      alert("Error al procesar la imagen");
    }
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData: { name?: string; avatar?: string } = {};
      if (data.name && data.name !== user?.name) {
        updateData.name = data.name;
      }
      if (avatarBase64) {
        updateData.avatar = avatarBase64;
      }
      if (Object.keys(updateData).length === 0) {
        setIsDialogOpen(false);
        return;
      }

      await toast.promise(() => updateProfile(updateData), {
        loading: "Actualizando perfil...",
        success: "Perfil actualizado exitosamente",
        error: "Error al actualizar perfil",
      });

      setIsDialogOpen(false);
      setAvatarBase64(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <img
            src="/yap-chat-logo.png"
            alt="yap-chat logo"
            className="w-full px-6"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-2 pb-2">
              <Button
                onClick={() => setOpenNewChat(true)}
                className="w-full text-sm"
                size="sm"
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nueva conversación</span>
                <span className="sm:hidden">Nuevo chat</span>
              </Button>
            </div>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-12">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                    {displayConversations.length}
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="rounded-lg">
                    <AvatarImage
                      src={user?.avatar || "https://github.com/shadcn.png"}
                      alt={user?.name}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-base font-medium">
                    {user?.name || "Usuario"}
                  </h2>
                </div>
              </DialogTrigger>

              <DialogContent className="w-[95%] max-w-md sm:w-full rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">
                    Editar Perfil
                  </DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                    Actualiza tu información personal
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 md:space-y-4"
                >
                  <div className="flex flex-col items-center gap-3 md:gap-4">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32">
                      <AvatarImage
                        src={
                          avatarPreview ||
                          user?.avatar ||
                          "https://github.com/shadcn.png"
                        }
                        alt={user?.name}
                      />
                      <AvatarFallback className="text-4xl">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="w-full flex flex-col gap-2">
                      <Label
                        htmlFor="picture"
                        className="cursor-pointer mx-auto"
                      >
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" />
                          <span className="text-sm">
                            {avatarBase64 ? "Cambiar imagen" : "Subir imagen"}
                          </span>
                        </div>
                      </Label>
                      <Input
                        ref={fileInputRef}
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Formatos: JPG, PNG, GIF (máx. 2MB)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre"
                      {...register("name", {
                        required: "El nombre es requerido",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                      })}
                      className={errors.name ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      El email no se puede cambiar
                    </p>
                  </div>

                  <DialogFooter className="gap-2 flex-col sm:flex-row">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <NewChat openDialog={openNewChat} onClose={() => setOpenNewChat(false)} />
    </>
  );
}

export default AppSidebar;
