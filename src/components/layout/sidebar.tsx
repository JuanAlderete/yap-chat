import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessagesSquare } from "lucide-react"

function AppSidebar() {
  const items = [
    {
      title: "Chats",
      url: "#",
      icon: MessagesSquare,
    }
  ];

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
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-4 px-2">
          <Avatar className="rounded-lg">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <h2 className="text-base font-medium">Evil Rabbit</h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
