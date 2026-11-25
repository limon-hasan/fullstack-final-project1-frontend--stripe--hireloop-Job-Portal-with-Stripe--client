import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"

const DashboardLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[#08080a] text-white">
        <DashboardSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-[1320px]">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayoutPage
