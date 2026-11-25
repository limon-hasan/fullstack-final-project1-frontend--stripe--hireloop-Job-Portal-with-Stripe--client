import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { PRICING_FAQ, PRICING_PLANS } from "@/lib/constants/marketing"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for candidates and hiring teams. Start free, upgrade when you need more.",
}

export default function PricingPage() {
  return (
    <main className="overflow-hidden bg-[#08080a]">
      <section className="relative isolate px-4 pt-20 pb-14 text-center sm:px-6 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#5b4df5]/16 blur-[140px]" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101116] px-3.5 py-1.5 text-[11px] font-medium text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-[#a99fff]" />
          No hidden fees. Cancel any time.
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">
          Pricing that scales with your ambition
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          Free for exploring. Pro for candidates who want an edge. Teams for
          hiring groups that need shared pipelines.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 sm:p-7 ${
                plan.highlighted
                  ? "border-[#5b4df5]/45 bg-[linear-gradient(160deg,rgba(91,77,245,0.18),rgba(12,13,18,0.95)_55%)] shadow-[0_30px_80px_-40px_rgba(91,77,245,0.8)]"
                  : "border-white/[0.07] bg-[#0d0e12]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute top-5 right-5 rounded-full border border-[#8b81ff]/40 bg-[#5b4df5]/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#d6d2ff] uppercase">
                  Most popular
                </span>
              )}

              <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
              <p className="mt-1.5 text-[13px] text-zinc-400">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="pb-1 text-xs text-zinc-500">
                  / {plan.cadence}
                </span>
              </div>

              <div className="mt-6 h-px bg-white/[0.07]" />

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[13px] text-zinc-300"
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                        plan.highlighted
                          ? "border-[#8b81ff]/40 bg-[#5b4df5]/20 text-[#d6d2ff]"
                          : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.highlighted ? (
                <BrandButton
                  nativeButton={false}
                  render={<Link href={plan.href} />}
                  className="mt-7 w-full"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </BrandButton>
              ) : (
                <Link
                  href={plan.href}
                  className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Minus className="h-3 w-3" />
          All plans include verified employers, salary transparency and secure
          Stripe payments.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[820px] px-4 pt-20 pb-20 sm:px-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            Questions
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Answers before you commit
          </h2>
        </div>

        <div className="mt-7 space-y-2.5">
          {PRICING_FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/[0.07] bg-[#0d0e12] px-5 py-4 open:border-white/[0.12]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0c0d12] p-6 text-center">
          <h3 className="text-sm font-semibold text-white">
            Still deciding? Start free.
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            You can upgrade from your billing page whenever you are ready.
          </p>
          <BrandButton
            nativeButton={false}
            render={<Link href="/signup" />}
            className="mt-5"
          >
            Create free account
          </BrandButton>
        </div>
      </section>
    </main>
  )
}
