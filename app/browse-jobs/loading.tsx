import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function BrowseJobsLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2.5">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-8 w-56" />
            <SkeletonBox className="h-4 w-80 max-w-full" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101116] px-3 py-1.5">
            <BrandSpinner size="sm" />
            <span className="text-xs text-zinc-400">Loading open roles…</span>
          </div>
        </div>

        <SkeletonBox className="h-[68px] rounded-2xl border border-white/[0.06] bg-[#0d0e12]" />

        <div className="flex flex-col gap-6 lg:flex-row">
          <SkeletonBox className="hidden h-[440px] w-64 shrink-0 rounded-2xl border border-white/[0.06] bg-[#0d0e12] lg:block xl:w-72" />
          <div className="flex-1 space-y-3.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-[132px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#0d0e12] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <SkeletonBox className="h-11 w-11 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBox className="h-4 w-48" />
                      <SkeletonBox className="h-3 w-32" />
                    </div>
                  </div>
                  <SkeletonBox className="h-8 w-24 rounded-lg" />
                </div>
                <div className="mt-5 flex gap-2">
                  <SkeletonBox className="h-5 w-20 rounded-full" />
                  <SkeletonBox className="h-5 w-24 rounded-full" />
                  <SkeletonBox className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

