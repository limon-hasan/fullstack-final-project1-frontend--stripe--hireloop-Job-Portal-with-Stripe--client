import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-32" />
          <SkeletonBox className="h-7 w-56" />
          <SkeletonBox className="h-3.5 w-80 max-w-full" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101116] px-3 py-1.5">
          <BrandSpinner size="sm" />
          <span className="text-xs text-zinc-400">Syncing workspace…</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[118px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#101116] p-5"
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBox className="mt-4 h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonBox className="h-[340px] rounded-2xl border border-white/[0.06] bg-[#101116] lg:col-span-2" />
        <SkeletonBox className="h-[340px] rounded-2xl border border-white/[0.06] bg-[#101116]" />
      </div>
    </div>
  )
}
