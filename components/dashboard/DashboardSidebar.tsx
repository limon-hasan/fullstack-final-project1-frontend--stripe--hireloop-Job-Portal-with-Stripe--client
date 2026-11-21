"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  Users,
  Building2,
  PlusCircle,
  Home,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import type { UserRole } from "@/types/auth"
import type { MenuItem } from "@/types/navigation"

export type { UserRole } from "@/types/auth"
export type { MenuItem } from "@/types/navigation"

export const menuItemsbyRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    { id: "home", name: "Home", url: "/", icon: Home },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    { id: "jobs", name: "Jobs", url: "/jobs", icon: Briefcase },
    {
      id: "saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: "applications",
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    { id: "home", name: "Home", url: "/", icon: Home },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "manage-company",
      name: "My company",
      url: "/dashboard/recruiter/company",
      icon: Briefcase,
    },
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "add-job",
      name: "Add Job",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      id: "applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    { id: "home", name: "Home", url: "/", icon: Home },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    {
      id: "companies",
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    {
      id: "payments",
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()

  const roleFromPath: UserRole | null = pathname.includes("/admin")
    ? "admin"
    : pathname.includes("/recruiter")
      ? "recruiter"
      : pathname.includes("/seeker")
        ? "seeker"
        : null

  const role: UserRole =
    roleFromPath || (session?.user?.role as UserRole) || "seeker"
  const currentMenu = menuItemsbyRole[role] || menuItemsbyRole.seeker

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & { imageUrl?: string | null })
    | undefined

  const userName = user?.name || "User"
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
  const userImage = user?.imageUrl || user?.image
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <Sidebar className="flex flex-col justify-between border-r border-white/[0.08] bg-[#0c0d12] text-white">
      <div>
        {/* ১. লোগো ও ইউজারের নাম + রোল হেডার */}
        <SidebarHeader className="px-5 pt-6 pb-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              hire<span className="text-amber-500">loop</span>
            </span>
          </Link>

          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-white/5 bg-[#15161f] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-sm font-semibold text-white">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-white">
                  {userName}
                </p>
                <p className="text-[11.5px] text-zinc-400">{roleLabel}</p>
              </div>
            </div>

            {role === "recruiter" && (
              <div>
                <span className="inline-block rounded-full border border-[#483d8b]/40 bg-[#23203f] px-2.5 py-0.5 text-[11px] font-medium text-[#9d8df1]">
                  Premium account
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* ২. মেনু আইটেম লিস্ট */}
        <SidebarContent className="mt-3 px-3">
          <SidebarGroup>
            <SidebarMenu className="gap-1.5">
              {currentMenu.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.url} />}
                      className="group relative flex w-full flex-row items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-[#1a1b26] data-[active=true]:text-white"
                    >
                      {isActive && (
                        <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r bg-[#6366f1]" />
                      )}
                      <Icon className="h-[18px] w-[18px] shrink-0 text-zinc-400 group-hover:text-white group-data-[active=true]:text-white" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </div>

      {/* ৩. সাইডবার ফুটার */}
      <SidebarFooter className="border-t border-white/5 p-4">
        <p className="truncate text-xs font-medium text-[#f59e0b] transition-colors hover:text-[#fbbf24]">
          {session?.user?.email || "maksudulhasanlimon@gmail.com"}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
