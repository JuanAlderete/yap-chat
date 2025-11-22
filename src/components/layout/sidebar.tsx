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
import { MessagesSquare } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import { useEffect } from "react";

function AppSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { filteredConversations, initialize } = useChatStore();

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

  return (
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
          <div className="flex items-center gap-4">
            <Avatar className="rounded-lg">
              <AvatarImage
                src={user?.avatar || "https://github.com/shadcn.png"}
                alt={user?.name}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-base font-medium">{user?.name || "Usuario"}</h2>
          </div>

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
  );
}

export default AppSidebar;
