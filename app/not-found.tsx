import Link from "next/link"
import { ArrowLeft, Compass, Search } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/3 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#5b4df5]/12 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#121318] text-[#a99fff]">
          <Compass className="h-6 w-6" />
        </div>

        <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-zinc-500 uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          This page took a different career path
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          The page you are looking for does not exist or has moved. Let us get
          you back to the roles that matter.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BrandButton
            nativeButton={false}
            render={<Link href="/browse-jobs" />}
          >
            <Search className="mr-2 h-4 w-4" />
            Browse jobs
          </BrandButton>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </div>
    </main>
  )
}
