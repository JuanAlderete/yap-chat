import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import SearchInput from "../common/SearchInput";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col relative">
        <div className="flex items-center justify-center absolute top-2 left-4 w-60 gap-4">
          <SidebarTrigger className="bg-sidebar hover:bg-[#E6D6CA]" />
          <SearchInput className="bg-sidebar text-sm ring-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-neutral-400"/>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
