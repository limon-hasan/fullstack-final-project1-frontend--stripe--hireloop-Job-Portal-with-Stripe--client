import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function JobsLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-8 w-52" />
          <BrandSpinner size="sm" label="Loading jobs…" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="h-40 rounded-2xl border border-white/[0.07] bg-[#101116]"
            />
          ))}
        </div>
      </div>
    </main>
  )
}

