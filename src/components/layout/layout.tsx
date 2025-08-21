import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col relative">
        <SidebarTrigger className="absolute top-2 left-4 bg-sidebar hover:bg-[#E6D6CA]" />
        {children}
      </main>
    </SidebarProvider>
  );
}
