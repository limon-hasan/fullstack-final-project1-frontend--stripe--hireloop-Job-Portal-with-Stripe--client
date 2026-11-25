import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function CompanyLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-8 w-60" />
          </div>
          <BrandSpinner size="sm" label="Loading companies…" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="h-48 rounded-2xl border border-white/[0.07] bg-[#101116]"
            />
          ))}
        </div>
      </div>
    </main>
  )
}

