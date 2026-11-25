"use client"

import { useEffect } from "react"
import { RefreshCw, TriangleAlert } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred."

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.07] bg-[#101116] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
          <TriangleAlert className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          We could not load this section. This is usually temporary — try again
          in a moment.
        </p>
        <p className="mt-3 rounded-lg border border-white/[0.06] bg-[#0b0c10] px-3 py-2 font-mono text-[11px] break-words text-zinc-500">
          {message}
        </p>
        <BrandButton onClick={() => retry()} className="mt-6">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </BrandButton>
      </div>
    </main>
  )
}
