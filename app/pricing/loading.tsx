import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function PricingLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col items-center space-y-3 text-center">
          <BrandSpinner size="sm" label="Loading plans…" />
          <SkeletonBox className="h-9 w-72" />
          <SkeletonBox className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="h-[420px] rounded-2xl border border-white/[0.07] bg-[#101116]"
            />
          ))}
        </div>
      </div>
    </main>
  )
}

