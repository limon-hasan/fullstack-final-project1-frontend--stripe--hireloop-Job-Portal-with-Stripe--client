import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"

export const metadata: Metadata = {
  title: "Payments",
}

const PAYMENT_FLOW = [
  {
    title: "Checkout session",
    description:
      "Candidates and teams start a Stripe checkout from the pricing page.",
    icon: CreditCard,
  },
  {
    title: "Verification",
    description:
      "The success page verifies the session before premium access is granted.",
    icon: ShieldCheck,
  },
  {
    title: "Settlement",
    description:
      "Stripe settles funds and sends receipts to the billing contact on file.",
    icon: BadgeDollarSign,
  },
]

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Payments" },
        ]}
        title="Payments"
        description="Monitor subscription revenue, checkout activity and refunds processed through Stripe."
        action={
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
          >
            View pricing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue this month"
          value="$0"
          icon={TrendingUp}
          accent="emerald"
          hint="Awaiting first payment"
        />
        <StatCard
          label="Active subscriptions"
          value="0"
          icon={RefreshCcw}
          accent="violet"
          hint="Pro and Teams plans"
        />
        <StatCard
          label="Successful payments"
          value="0"
          icon={CheckCircle2}
          accent="sky"
          hint="All time"
        />
        <StatCard
          label="Refunds"
          value="0"
          icon={Receipt}
          accent="amber"
          hint="No refund requests"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Transaction history
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Charges, refunds and subscription renewals.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Stripe connected
            </span>
          </div>

          <div className="p-6">
            <EmptyState
              compact
              icon={Receipt}
              title="No transactions yet"
              description="Once a customer completes checkout, the payment and its receipt will appear here."
              action={
                <Link
                  href="/checkout"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5b4df5] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a5cff]"
                >
                  <CreditCard className="h-4 w-4" />
                  Test the checkout flow
                </Link>
              }
            />
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]">
                <CreditCard className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold text-white">
                Payment provider
              </h2>
            </div>

            <dl className="mt-4 space-y-3 text-[12.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Provider</dt>
                <dd className="font-medium text-zinc-200">Stripe</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Mode</dt>
                <dd className="font-medium text-zinc-200">Hosted checkout</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Currency</dt>
                <dd className="font-medium text-zinc-200">USD / BDT</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Receipts</dt>
                <dd className="font-medium text-zinc-200">Email</dd>
              </div>
            </dl>

            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#a99fff] transition-colors hover:text-white"
            >
              Open Stripe dashboard
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <h2 className="text-sm font-semibold text-white">Plan catalogue</h2>
            <div className="mt-3 space-y-2">
              {[
                { name: "Starter", price: "$0", note: "Free forever" },
                { name: "Pro", price: "$20", note: "Per month" },
                { name: "Teams", price: "$49", note: "Per seat / month" },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0d0e12] px-3 py-2"
                >
                  <div>
                    <p className="text-[12.5px] font-medium text-zinc-200">
                      {plan.name}
                    </p>
                    <p className="text-[10.5px] text-zinc-500">{plan.note}</p>
                  </div>
                  <span className="text-[12.5px] font-semibold text-white">
                    {plan.price}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="text-sm font-semibold text-white">
            How a payment flows
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            From plan selection to premium access in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/[0.05] md:grid-cols-3">
          {PAYMENT_FLOW.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="bg-[#101116] p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#15161d] text-[#a99fff]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-600 tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-[13px] font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
