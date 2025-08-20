import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
