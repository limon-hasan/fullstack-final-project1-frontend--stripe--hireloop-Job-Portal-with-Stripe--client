"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { toast } from "@/components/ui/toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/format"
import type { UserRole } from "@/types/auth"

const PAGE_LABELS: Array<{ match: string; label: string }> = [
  { match: "/dashboard/seeker/saved-jobs", label: "Saved jobs" },
  { match: "/dashboard/seeker/applications", label: "Applications" },
  { match: "/dashboard/seeker/billing", label: "Billing" },
  { match: "/dashboard/seeker/settings", label: "Settings" },
  { match: "/dashboard/seeker/profile", label: "My profile" },
  { match: "/dashboard/seeker", label: "Overview" },
  { match: "/dashboard/recruiter/company", label: "My company" },
  { match: "/dashboard/recruiter/jobs/new", label: "Post a job" },
  { match: "/dashboard/recruiter/jobs", label: "Manage jobs" },
  { match: "/dashboard/recruiter/applications", label: "Applications" },
  { match: "/dashboard/recruiter/settings", label: "Settings" },
  { match: "/dashboard/recruiter/profile", label: "My profile" },
  { match: "/dashboard/recruiter", label: "Overview" },
  { match: "/dashboard/admin/users", label: "Users" },
  { match: "/dashboard/admin/companies", label: "Companies" },
  { match: "/dashboard/admin/jobs", label: "Jobs" },
  { match: "/dashboard/admin/payments", label: "Payments" },
  { match: "/dashboard/admin/settings", label: "Settings" },
  { match: "/dashboard/admin/profile", label: "My profile" },
  { match: "/dashboard/admin", label: "Overview" },
]

function resolveRole(pathname: string, sessionRole?: string | null): UserRole {
  if (pathname.includes("/admin")) return "admin"
  if (pathname.includes("/recruiter")) return "recruiter"
  if (pathname.includes("/seeker")) return "seeker"
  if (
    sessionRole === "admin" ||
    sessionRole === "recruiter" ||
    sessionRole === "seeker"
  ) {
    return sessionRole
  }
  return "seeker"
}

export function DashboardTopbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [query, setQuery] = useState("")

  const role = resolveRole(pathname, session?.user?.role)
  const settingsHref = `/dashboard/${role}/settings`
  const dashboardHref = `/dashboard/${role}`
  const profileHref = `/dashboard/${role}/profile`

  const pageLabel = useMemo(
    () =>
      PAGE_LABELS.find((item) => pathname.startsWith(item.match))?.label ??
      "Dashboard",
    [pathname]
  )

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & { imageUrl?: string | null })
    | undefined
  const userImage = user?.imageUrl || user?.image
  const userName = user?.name || "Your account"
  const userEmail = user?.email || "Not signed in"

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(
      trimmed
        ? `/browse-jobs?search=${encodeURIComponent(trimmed)}`
        : "/browse-jobs"
    )
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    toast.add({
      title: "Signed out",
      description: "You have been signed out of HireLoop.",
    })
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#08080a]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <SidebarTrigger className="h-9 w-9 rounded-lg border border-white/[0.08] bg-[#101116] text-zinc-400 hover:bg-white/[0.06] hover:text-white md:hidden" />

      <div className="hidden min-w-0 flex-col md:flex">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-600 uppercase">
          {role} workspace
        </p>
        <p className="truncate text-[13.5px] font-semibold text-white">
          {pageLabel}
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        role="search"
        className="relative ml-auto hidden w-full max-w-xs lg:block"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search jobs, companies…"
          aria-label="Search jobs"
          className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#101116] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 lg:ml-3">
        <ThemeToggle className="h-9 w-9 rounded-lg px-0" />
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative h-9 w-9 rounded-lg border border-white/[0.08] bg-[#101116] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              />
            }
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-[#6a5cff]" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[88%] max-w-sm gap-0 border-white/10 bg-[#0b0c10] p-0 text-white"
          >
            <SheetHeader className="border-b border-white/[0.07] px-5 py-4">
              <SheetTitle className="text-base text-white">
                Notifications
              </SheetTitle>
              <SheetDescription className="text-xs text-zinc-500">
                Activity that needs your attention.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 p-5">
              <div className="rounded-xl border border-white/[0.07] bg-[#101116] p-4">
                <p className="text-[13px] font-medium text-white">
                  You are all caught up
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Application updates, interview invites and recruiter replies
                  will show up here.
                </p>
              </div>
              <Link
                href="/browse-jobs"
                className="flex items-center justify-between rounded-xl border border-[#5b4df5]/25 bg-[#5b4df5]/10 px-4 py-3 text-[13px] font-medium text-[#c7c1ff] transition-colors hover:bg-[#5b4df5]/15"
              >
                Browse new roles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/browse-jobs"
          className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101116] px-3 text-[12.5px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
        >
          <BriefcaseBusiness className="h-4 w-4 text-[#a99fff]" />
          Job board
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101116] pr-2 pl-1.5 outline-none transition-colors hover:border-white/20 focus-visible:ring-3 focus-visible:ring-white/20"
          >
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName}
                className="h-6 w-6 shrink-0 rounded-md border border-white/10 object-cover"
              />
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-zinc-800 text-[10px] font-semibold text-neutral-300">
                {getInitials(userName, userEmail)}
              </span>
            )}
            <span className="hidden max-w-24 truncate text-[12.5px] font-medium text-zinc-200 sm:block">
              {userName.split(" ")[0]}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 border border-white/[0.08] bg-[#101116] p-1.5 text-zinc-200"
          >
            <DropdownMenuLabel className="px-2 py-2">
              <span className="block truncate text-sm font-semibold text-white">
                {userName}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                {userEmail}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.07]" />

            <DropdownMenuItem
              render={<Link href={dashboardHref} />}
              className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
            >
              <LayoutDashboard className="h-4 w-4 text-zinc-400" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={profileHref} />}
              className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
            >
              <UserRound className="h-4 w-4 text-zinc-400" />
              My profile
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={settingsHref} />}
              className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/browse-jobs" />}
              className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
            >
              <BriefcaseBusiness className="h-4 w-4 text-zinc-400" />
              Browse jobs
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.07]" />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
              className="gap-2.5 px-2 py-2 text-[13px]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
