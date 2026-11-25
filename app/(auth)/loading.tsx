import { BrandSpinner } from "@/components/shared/page-loader"

export default function AuthLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#08080a] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#101116] p-10 text-center">
        <BrandSpinner size="lg" label="Loading authentication…" />
      </div>
    </main>
  )
}

