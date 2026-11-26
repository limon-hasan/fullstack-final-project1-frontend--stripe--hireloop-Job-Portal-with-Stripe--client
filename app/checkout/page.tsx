"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

const PRO_FEATURES = [
  "Unlimited job applications across all listings",
  "Priority profile visibility to verified recruiters",
  "Real-time application status & interview tracking",
  "One-click PDF export for application history",
]

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = use(searchParams)
  useEffect(() => {
    if (canceled) {
      toast.add({
        title: "Checkout canceled",
        description: "No charges were made. You can upgrade anytime.",
      })
    }
  }, [canceled])

  const { data: session } = authClient.useSession()
  const [currency, setCurrency] = useState<"USD" | "BDT">("USD")

  const pricing = {
    USD: {
      symbol: "$",
      amount: "20.00",
      label: "$20.00",
    },
    BDT: {
      symbol: "BDT ",
      amount: "2,553.33",
      label: "BDT 2,553.33",
    },
  }

  const selectedPrice = pricing[currency]

  return (
    <div className="min-h-screen bg-[#0B0C0E] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard/seeker"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-[#131417] px-3 py-1 text-xs font-medium text-zinc-400">
            <Lock className="h-3 w-3 text-emerald-400" />
            Secure Checkout
          </span>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Plan Details & Currency Selector */}
          <div className="space-y-6 rounded-2xl border border-zinc-800/80 bg-[#131417] p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Professional Tier
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
                Hireloop Pro Plan
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Access to all features and priority job seeker tools.
              </p>
            </div>

            {/* Currency Switcher (Matches Stripe Preview) */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Choose a Currency
              </label>
              <div className="mt-2.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${currency === "USD"
                      ? "border-white bg-[#1A1C21] text-white"
                      : "border-zinc-800 bg-[#0F1013] text-zinc-400 hover:border-zinc-700"
                    }`}
                >
                  <span className="text-xs font-medium">USD</span>
                  <span className="text-sm font-bold">$20.00</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency("BDT")}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${currency === "BDT"
                      ? "border-white bg-[#1A1C21] text-white"
                      : "border-zinc-800 bg-[#0F1013] text-zinc-400 hover:border-zinc-700"
                    }`}
                >
                  <span className="text-xs font-medium">BDT</span>
                  <span className="text-sm font-bold">2,553.33</span>
                </button>
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">
                1 USD = 127.6665 BDT • Billed monthly, cancel anytime
              </p>
            </div>

            {/* Included Benefits */}
            <div className="border-t border-zinc-800/80 pt-6">
              <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                What{"'"}s Included
              </h2>
              <ul className="mt-4 space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay Button */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#131417] p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Payment Summary
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Review your subscription details before proceeding.
                </p>
              </div>

              {/* Account Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800/80 dark:bg-[#1A1C21]/60">
                <span className="text-[11px] font-medium text-zinc-500">
                  Billing Account
                </span>
                <p className="mt-1 text-sm font-medium text-white">
                  {session?.user?.name || "Hireloop Seeker"}
                </p>
                <p className="text-xs text-zinc-400">
                  {session?.user?.email || "seeker@gmail.com"}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-zinc-800/80 pt-4 text-sm">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Hireloop Pro (Monthly)</span>
                  <span className="text-zinc-200">{selectedPrice.label}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Platform Fee</span>
                  <span className="text-zinc-200">
                    {selectedPrice.symbol}0.00
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-base font-bold text-white">
                  <span>Total Due Today</span>
                  <span>{selectedPrice.label}</span>
                </div>
              </div>
            </div>

            {/* Pay CTA & Stripe Trust Footer */}
            <div className="mt-8 space-y-4">
              <form action="/api/checkout_sessions" method="POST">
                <section>
                  <button
                    type="submit"
                    role="link"
                    className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0070E0] text-lg font-bold text-white shadow-[0_4px_6px_-4px_rgba(94,158,246,0.3),0_10px_15px_-3px_rgba(94,158,246,0.3)] transition-colors hover:bg-[#3F90E5]"
                  >
                    <CreditCard className="h-5 w-5" />
                    Checkout {selectedPrice.label}
                  </button>
                </section>
              </form>

              <div className="flex items-center justify-center gap-2 text-center text-xs text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                <span>
                  You{"'"}ll be redirected to{" "}
                  <strong className="font-semibold text-zinc-300">
                    Stripe
                  </strong>{" "}
                  to complete payment securely.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
