import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"

const DashboardLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full flex-1 p-6 lg:px-9 lg:py-6">
        <div className="mb-2">
          <SidebarTrigger className="text-zinc-400 hover:text-white" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayoutPage
