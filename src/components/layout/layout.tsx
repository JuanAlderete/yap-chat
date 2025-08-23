import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import { Input } from "../ui/input";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col relative">
        <div className="flex items-center justify-center absolute top-2 left-4 w-62 gap-4">
          <SidebarTrigger className="bg-sidebar hover:bg-[#E6D6CA]" />
          <Input
            className="bg-sidebar text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none placeholder:text-neutral-400"
            placeholder="Search chat"
          />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
