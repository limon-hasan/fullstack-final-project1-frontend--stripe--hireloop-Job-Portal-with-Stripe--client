export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-white/[0.06]" />
        <div className="h-7 w-56 rounded bg-white/[0.08]" />
        <div className="h-3 w-80 max-w-full rounded bg-white/[0.05]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[118px] rounded-2xl border border-white/[0.06] bg-[#101116]"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-[340px] rounded-2xl border border-white/[0.06] bg-[#101116] lg:col-span-2" />
        <div className="h-[340px] rounded-2xl border border-white/[0.06] bg-[#101116]" />
      </div>
    </div>
  )
}
