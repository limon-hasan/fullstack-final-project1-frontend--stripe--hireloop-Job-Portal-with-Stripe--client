import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function JobDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-4 w-32" />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101116] px-3 py-1">
            <BrandSpinner size="sm" />
            <span className="text-xs text-zinc-400">Loading role details…</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#101116] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <SkeletonBox className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2.5">
                <SkeletonBox className="h-7 w-64" />
                <SkeletonBox className="h-4 w-44" />
              </div>
            </div>
            <div className="flex gap-3">
              <SkeletonBox className="h-10 w-28 rounded-xl" />
              <SkeletonBox className="h-10 w-32 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <SkeletonBox className="h-56 rounded-2xl border border-white/[0.06] bg-[#101116]" />
            <SkeletonBox className="h-64 rounded-2xl border border-white/[0.06] bg-[#101116]" />
          </div>
          <div className="space-y-5">
            <SkeletonBox className="h-72 rounded-2xl border border-white/[0.06] bg-[#101116]" />
            <SkeletonBox className="h-44 rounded-2xl border border-white/[0.06] bg-[#101116]" />
          </div>
        </div>
      </div>
    </main>
  )
}

