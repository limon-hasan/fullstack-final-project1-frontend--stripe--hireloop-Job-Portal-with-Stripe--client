"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Settings,
  UserIcon,
  UserRound,
  XIcon,
} from "lucide-react"

import logo from "@/app/images/logo.png"

import { Button } from "@/components/ui/button"
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandButton } from "@/components/shared/brand-button"
import { authClient } from "@/lib/auth-client"
import { SITE_NAV } from "@/lib/constants/marketing"
import { cn } from "@/lib/utils"

function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { data: session } = authClient.useSession()

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & { imageUrl?: string | null })
    | undefined
  const userImage = user?.imageUrl || user?.image
  const dashboardHref = `/dashboard/${session?.user.role || "seeker"}`
  const settingsHref = `${dashboardHref}/settings`
  const profileHref = `${dashboardHref}/profile`

  const handleSignOut = async () => {
    await authClient.signOut()
    toast.add({
      title: "Signed out",
      description: "You have been signed out of HireLoop.",
    })
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto flex h-[68px] w-full max-w-[1400px] items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#0e0e13]/85 px-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-5">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-white/30"
        >
          <Image
            src={logo}
            alt="HireLoop"
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-1 lg:flex"
        >
          {SITE_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                isActive(link.href)
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href={dashboardHref}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#14151b] px-4 text-[13.5px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4 text-[#a99fff]" />
                Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#14151b] pr-2 pl-2 text-left outline-none transition-colors hover:border-white/20 focus-visible:ring-3 focus-visible:ring-white/20"
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={session.user.name || "User avatar"}
                      className="h-7 w-7 shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-[11px] font-semibold text-neutral-300">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-28 truncate text-[13px] font-medium text-zinc-200">
                    {session.user.name?.split(" ")[0] || "Account"}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 border border-white/[0.08] bg-[#101116] p-1.5 text-zinc-200"
                >
                  <DropdownMenuLabel className="px-2 py-2">
                    <span className="block truncate text-sm font-semibold text-white">
                      {session.user.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                      {session.user.email}
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
                    render={<Link href="/browse-jobs" />}
                    className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
                  >
                    <BriefcaseBusiness className="h-4 w-4 text-zinc-400" />
                    Browse jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href={settingsHref} />}
                    className="gap-2.5 px-2 py-2 text-[13px] focus:bg-white/[0.06] focus:text-white"
                  >
                    <Settings className="h-4 w-4 text-zinc-400" />
                    Settings
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
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/signin"
                className="rounded-lg px-3.5 py-2 text-[13.5px] font-medium text-[#9d94ff] transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <BrandButton
                nativeButton={false}
                render={<Link href="/signup" />}
                className="h-10 rounded-xl px-4 text-[13.5px]"
              >
                Get started
              </BrandButton>
            </div>
          )}

          <div className="flex items-center gap-2 lg:hidden">
            {!session?.user && (
              <BrandButton
                nativeButton={false}
                render={<Link href="/signup" />}
                className="hidden h-9 rounded-lg px-3.5 text-[13px] sm:inline-flex"
              >
                Get started
              </BrandButton>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="h-9 w-9 rounded-lg border border-white/[0.08] bg-[#14151b] text-white hover:bg-white/10 hover:text-white"
                  />
                }
              >
                <MenuIcon className="h-5 w-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                showCloseButton={false}
                className="w-[88%] max-w-sm gap-0 border-white/10 bg-[#0b0c10] p-0 text-white"
              >
                <SheetHeader className="flex-row items-center border-b border-white/[0.07] px-5 py-4">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Links to browse jobs, companies, pricing and account
                    actions.
                  </SheetDescription>
                  <Image src={logo} alt="HireLoop" className="h-8 w-auto" />
                  <SheetClose
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Close menu"
                        className="ml-auto text-white/70 hover:bg-white/10 hover:text-white"
                      />
                    }
                  >
                    <XIcon />
                  </SheetClose>
                </SheetHeader>

                <nav
                  aria-label="Mobile"
                  className="flex flex-1 flex-col gap-1 p-4"
                >
                  {SITE_NAV.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3.5 py-3 text-[15px] font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-white/[0.07] text-white"
                          : "text-neutral-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {session?.user && (
                    <>
                      <div className="my-2 h-px bg-white/[0.07]" />
                      <Link
                        href={dashboardHref}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[15px] font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href={settingsHref}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[15px] font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </>
                  )}
                </nav>

                <SheetFooter className="gap-2 border-t border-white/[0.07] p-4">
                  {session?.user ? (
                    <>
                      <div className="mb-1 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#121318] p-3">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={session.user.name || "User avatar"}
                            className="h-9 w-9 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300">
                            <UserIcon className="h-4 w-4" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {session.user.name}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        variant="destructive"
                        className="h-11 w-full rounded-xl text-[14px]"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        nativeButton={false}
                        render={
                          <Link href="/signin" onClick={() => setOpen(false)} />
                        }
                        variant="outline"
                        className="h-11 w-full rounded-xl border-white/15 bg-transparent text-[14px] font-medium text-[#9d94ff] hover:bg-white/5 hover:text-white"
                      >
                        Sign in
                      </Button>
                      <BrandButton
                        nativeButton={false}
                        render={
                          <Link href="/signup" onClick={() => setOpen(false)} />
                        }
                        className="w-full"
                      >
                        Get started
                      </BrandButton>
                    </>
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
