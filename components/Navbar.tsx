"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, UserIcon, XIcon } from "lucide-react"

import logo from "@/app/images/logo.png"

import { Button } from "@/components/ui/button"
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

function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { data: session } = authClient.useSession()

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & { imageUrl?: string | null })
    | undefined
  const userImage = user?.imageUrl || user?.image

  const navLinks = [
    { label: "Browse Jobs", href: "/browse-jobs" },
    { label: "Company", href: "/company" },
    { label: "Pricing", href: "/pricing" },
    {
      label: "Dashboard",
      href: `/dashboard/${session?.user.role || "seeker"}`,
    },
  ] as const

  const handleSignOut = async () => {
    await authClient.signOut()
  }

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between gap-6 rounded-2xl border border-white/[0.06] bg-[#161616]/95 px-5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-6">
        <Link
          href="/"
          aria-label="hireloop home"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-white/30"
        >
          <Image
            src={logo}
            alt="hireloop"
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <div className="flex items-center justify-end gap-5">
          <nav aria-label="Main" className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2 text-[15px] font-medium text-neutral-100 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/30"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            aria-hidden="true"
            className="hidden h-4 w-px shrink-0 bg-white/20 lg:block"
          />

          {session?.user ? (
            <>
              <div className="flex items-center gap-3 py-2">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={session.user.name || "User avatar"}
                    className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
                  />
                ) : (
                  <div
                    aria-label="Default user avatar"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-800 text-neutral-300"
                  >
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
                <span className="text-[15px] font-medium text-neutral-300">
                  Welcome,{" "}
                  <span className="font-semibold text-white">
                    {session.user.name}
                  </span>
                </span>
              </div>
              <Button onClick={handleSignOut} variant="destructive">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-5 lg:flex">
                <Link
                  href="/signin"
                  className="rounded-lg px-1 py-2 text-[15px] font-medium text-[#5c87ff] transition-colors outline-none hover:text-[#84a4ff] focus-visible:ring-3 focus-visible:ring-white/30"
                >
                  Sign In
                </Link>
                <BrandButton
                  nativeButton={false}
                  render={<Link href="/signup" />}
                  className="text-[15px]"
                >
                  Get Started
                </BrandButton>
              </div>
              <div className="flex items-center gap-2 lg:hidden">
                <BrandButton
                  nativeButton={false}
                  render={<Link href="/signup" />}
                  className="hidden h-9 px-4 text-sm sm:inline-flex"
                >
                  Get Started
                </BrandButton>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open menu"
                        className="text-white hover:bg-white/10 hover:text-white"
                      />
                    }
                  >
                    <MenuIcon />
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    showCloseButton={false}
                    className="w-[86%] max-w-sm gap-0 border-white/10 bg-[#141414] p-0 text-white"
                  >
                    <SheetHeader className="flex-row items-center border-b border-white/10 px-5 py-4">
                      <SheetTitle className="sr-only">
                        Navigation menu
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Links to browse jobs, company information, pricing, and
                        account actions.
                      </SheetDescription>
                      <Image src={logo} alt="hireloop" className="h-8 w-auto" />
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
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-3 text-base font-medium text-neutral-200 transition-colors outline-none hover:bg-white/5 hover:text-white focus-visible:ring-3 focus-visible:ring-white/30"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <SheetFooter className="gap-2 border-t border-white/10 p-4">
                      <Button
                        nativeButton={false}
                        render={
                          <Link href="/signin" onClick={() => setOpen(false)} />
                        }
                        variant="outline"
                        className="h-11 w-full rounded-xl border-white/15 bg-transparent text-[15px] font-medium text-[#5c87ff] hover:bg-white/5 hover:text-[#84a4ff]"
                      >
                        Sign In
                      </Button>
                      <BrandButton
                        nativeButton={false}
                        render={
                          <Link href="/signup" onClick={() => setOpen(false)} />
                        }
                        className="w-full"
                      >
                        Get Started
                      </BrandButton>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { Navbar }
