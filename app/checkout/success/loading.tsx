import { BrandSpinner, SkeletonBox } from "@/components/shared/page-loader"

export default function CheckoutSuccessLoading() {
  return (
    <section className="min-h-screen bg-[#0B0C0E] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131417] p-8">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <BrandSpinner size="lg" label="Verifying your payment…" />
            <p className="text-xs text-zinc-500">
              Confirming your transaction with Stripe and activating your plan
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <SkeletonBox className="h-16 rounded-xl bg-zinc-800/50" />
            <SkeletonBox className="h-40 rounded-xl bg-zinc-800/40" />
          </div>
        </div>
      </div>
    </section>
  )
}

