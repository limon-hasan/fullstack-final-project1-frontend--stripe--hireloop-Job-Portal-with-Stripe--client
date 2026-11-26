import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/logo.png"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  maxWidth?: string
}

export function AuthLayout({
  children,
  maxWidth = "max-w-[420px]",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08080a] p-4 text-white">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[550px] rounded-full bg-[#5b4df5]/15 blur-[140px]" />
      </div>

      <div
        className={cn(
          "relative z-10 w-full rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-[#121215]/85 dark:shadow-2xl",
          maxWidth
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface AuthHeaderProps {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <Link href="/" className="mb-5 inline-block">
        <Image src={logo} alt="HireLoop" className="h-9 w-auto" priority />
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
    </div>
  )
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-medium text-red-400">
      {message}
    </div>
  )
}

interface AuthFooterProps {
  prompt: string
  href: string
  linkLabel: string
}

export function AuthFooter({ prompt, href, linkLabel }: AuthFooterProps) {
  return (
    <p className="mt-6 text-center text-xs text-neutral-400">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-[#5c87ff] hover:text-[#84a4ff] hover:underline"
      >
        {linkLabel}
      </Link>
    </p>
  )
}
