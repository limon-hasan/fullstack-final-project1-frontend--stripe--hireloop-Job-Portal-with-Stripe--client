"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"
import type { MenuItem } from "@/types/navigation"

export type { UserRole } from "@/types/auth"
export type { MenuItem } from "@/types/navigation"

export const menuItemsbyRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    {
      id: "dashboard",
      name: "Overview",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    { id: "jobs", name: "Browse jobs", url: "/browse-jobs", icon: Briefcase },
    {
      id: "saved-jobs",
      name: "Saved jobs",
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
    {
      id: "dashboard",
      name: "Overview",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "manage-company",
      name: "My company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "manage-jobs",
      name: "Manage jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "add-job",
      name: "Post a job",
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
    {
      id: "dashboard",
      name: "Overview",
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

const ROLE_META: Record<
  UserRole,
  { label: string; workspace: string; accent: string }
> = {
  seeker: {
    label: "Job seeker",
    workspace: "Seeker workspace",
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  },
  recruiter: {
    label: "Recruiter",
    workspace: "Recruiter workspace",
    accent: "border-[#5b4df5]/30 bg-[#5b4df5]/15 text-[#b7afff]",
  },
  admin: {
    label: "Administrator",
    workspace: "Admin console",
    accent: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  },
}

function isRouteActive(pathname: string, url: string) {
  if (url === "/dashboard/seeker" || url === "/dashboard/recruiter") {
    return pathname === url
  }

  if (url === "/dashboard/admin") {
    return pathname === url
  }

  return pathname === url || pathname.startsWith(`${url}/`)
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
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
    | (NonNullable<typeof session>["user"] & {
        imageUrl?: string | null
        premium?: boolean
      })
    | undefined

  const userName = user?.name || "Your account"
  const userEmail = user?.email || "Sign in to sync your activity"
  const userImage = user?.imageUrl || user?.image
  const meta = ROLE_META[role]

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Sidebar className="border-r border-white/[0.07] bg-[#0a0b0f] text-white">
      <SidebarHeader className="px-4 pt-5 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#5b4df5]/60"
        >
          <span className="text-[22px] font-bold tracking-tight text-white">
            hire<span className="text-amber-500">loop</span>
          </span>
        </Link>
        <p className="mt-1 px-1 text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">
          {meta.workspace}
        </p>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-600 uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {currentMenu.map((item) => {
              const Icon = item.icon
              const isActive = isRouteActive(pathname, item.url)

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={<Link href={item.url} />}
                    className={cn(
                      "group relative flex h-10 w-full flex-row items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white data-[active=true]:bg-white/[0.06] data-[active=true]:text-white"
                    )}
                  >
                    {isActive && (
                      <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#6a5cff]" />
                    )}
                    <Icon className="h-[17px] w-[17px] shrink-0 text-zinc-500 transition-colors group-hover:text-white group-data-[active=true]:text-[#b7afff]" />
                    <span className="truncate">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-600 uppercase">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                className="flex h-10 w-full flex-row items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Home className="h-[17px] w-[17px] shrink-0 text-zinc-500" />
                Market home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/browse-jobs" />}
                className="flex h-10 w-full flex-row items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <ExternalLink className="h-[17px] w-[17px] shrink-0 text-zinc-500" />
                Public job board
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06] p-3">
        <div className="rounded-xl border border-white/[0.07] bg-[#101116] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-[#191a22] text-[11px] font-semibold text-zinc-200">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(userName, userEmail)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">
                {userName}
              </p>
              <p className="truncate text-[11px] text-zinc-500">{userEmail}</p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <span
            className={cn(
              "mt-2.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
              meta.accent
            )}
          >
            {meta.label}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
