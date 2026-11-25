import Link from "next/link"
import { ArrowLeft, Lock, ShieldOff } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#08080a] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10">
          <ShieldOff className="h-9 w-9 text-rose-400" />
        </div>

        {/* Lock badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-rose-400 uppercase">
          <Lock className="h-3 w-3" />
          Access denied
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Unauthorized
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-zinc-500">
          You don&apos;t have permission to view this page. This area may be
          restricted to a specific role, or your session may have expired.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <BrandButton
            nativeButton={false}
            render={<Link href="/signin" />}
            className="h-10 w-full px-6 sm:w-auto"
          >
            Sign in
          </BrandButton>
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-6 text-[13px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-zinc-700">
          If you believe this is a mistake, contact your administrator.
        </p>
      </div>
    </main>
  )
}
