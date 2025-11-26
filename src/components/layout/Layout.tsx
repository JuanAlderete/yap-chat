import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import SearchInput from "../common/SearchInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { conversationId } = useParams();
  const hasActiveChat = Boolean(conversationId);

  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col relative">
        {(!isMobile || !hasActiveChat) && (
          <div className={`flex items-center gap-2 md:gap-4 absolute top-2 z-10 ${
            isMobile ? 'left-2 right-2' : 'left-4 w-60'
          }`}>
            <SidebarTrigger className="bg-sidebar hover:bg-[#E6D6CA] flex-shrink-0 h-8 w-8 md:h-9 md:w-9" />
            <div className="flex-1">
              <SearchInput 
                className="bg-sidebar text-xs md:text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none placeholder:text-neutral-400"
                placeholder={isMobile ? "Buscar..." : "Buscar chats..."}
              />
            </div>
          </div>
        )}
        {children}
      </main>
    </SidebarProvider>
  );
}