import { BrandSpinner } from "@/components/shared/page-loader"

export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C0E] px-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-800/80 bg-[#131417] px-8 py-10 text-center">
        <BrandSpinner size="lg" label="Preparing secure checkout…" />
        <p className="text-xs text-zinc-500">
          Connecting to Stripe payment session
        </p>
      </div>
    </div>
  )
}

