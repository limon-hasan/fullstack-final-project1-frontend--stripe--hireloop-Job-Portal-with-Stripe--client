import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function HomeLoading() {
  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero Skeleton */}
        <div className="flex flex-col items-center space-y-6 pt-8 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#101116] px-4 py-1.5">
            <BrandSpinner size="sm" />
            <span className="text-xs font-medium text-zinc-400">
              Loading HireLoop…
            </span>
          </div>
          <SkeletonBox className="h-12 w-full max-w-2xl rounded-2xl" />
          <SkeletonBox className="h-5 w-full max-w-lg rounded-lg" />
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <SkeletonBox className="h-11 w-40 rounded-xl" />
            <SkeletonBox className="h-11 w-36 rounded-xl" />
          </div>
        </div>

        {/* Trusted-by strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="h-12 rounded-xl border border-white/[0.05] bg-[#101116]"
            />
          ))}
        </div>

        {/* Featured jobs grid */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-7 w-48" />
            <SkeletonBox className="h-9 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-white/[0.06] bg-[#101116] p-5"
              >
                <div className="flex items-center gap-3">
                  <SkeletonBox className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="mt-6 space-y-2.5">
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

