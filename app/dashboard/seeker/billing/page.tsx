import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Infinity as InfinityIcon,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { getUserPremiumbyId } from "@/lib/api/users"
import { getSession } from "@/lib/core/server"
import { PRICING_PLANS } from "@/lib/constants/marketing"

export const metadata: Metadata = {
  title: "Billing",
}

const PRO_FEATURES = [
  "Unlimited applications",
  "Unlimited saved jobs",
  "Priority profile visibility",
  "Interview and offer tracking",
]

export default async function SeekerBillingPage() {
  const session = await getSession()
  const userId = session?.user?.id ?? ""
  const { premium } = userId
    ? await getUserPremiumbyId(userId)
    : { premium: false }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/seeker" },
          { label: "Billing" },
        ]}
        title="Billing & plan"
        description="Manage your HireLoop subscription, review what is included and keep payment details up to date."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] p-6 lg:col-span-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#5b4df5]/15 blur-3xl"
          />

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5b4df5]/30 bg-[#5b4df5]/10 px-2.5 py-1 text-[11px] font-medium text-[#b7afff]">
                <Sparkles className="h-3 w-3" />
                {premium ? "Pro member" : "Starter plan"}
              </span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                {premium ? "HireLoop Pro" : "HireLoop Starter"}
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-400">
                {premium
                  ? "You have unlimited applications, priority visibility and full interview tracking."
                  : "You are on the free plan. Upgrade to remove application limits and stand out to recruiters."}
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-semibold tracking-tight text-white">
                {premium ? "$20" : "$0"}
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  {premium ? "/ month" : "forever"}
                </span>
              </p>
              {premium ? (
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Active subscription
                </span>
              ) : (
                <span className="mt-1 inline-block text-[11px] text-zinc-500">
                  No payment method on file
                </span>
              )}
            </div>
          </div>

          <ul className="relative mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[12.5px] text-zinc-300"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Check className="h-3 w-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
            {premium ? (
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#15161d] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
              >
                Compare plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <BrandButton
                nativeButton={false}
                render={<Link href="/checkout" />}
                className="h-10 px-5"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </BrandButton>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure payments handled by Stripe
            </span>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400">
                <InfinityIcon className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold text-white">
                Usage this month
              </h2>
            </div>

            <dl className="mt-4 space-y-3 text-[12.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Applications</dt>
                <dd className="font-medium text-zinc-200">
                  {premium ? "Unlimited" : "2 included"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Saved jobs</dt>
                <dd className="font-medium text-zinc-200">
                  {premium ? "Unlimited" : "10 included"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Profile boost</dt>
                <dd className="font-medium text-zinc-200">
                  {premium ? "Enabled" : "Not included"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <h2 className="text-sm font-semibold text-white">Billing contact</h2>
            <p className="mt-2 truncate text-[13px] font-medium text-zinc-200">
              {session?.user?.name || "—"}
            </p>
            <p className="truncate text-[11.5px] text-zinc-500">
              {session?.user?.email || "—"}
            </p>
            <Link
              href="/dashboard/seeker/settings"
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[#a99fff] transition-colors hover:text-white"
            >
              Update account details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400">
              <Receipt className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Invoice history
              </h2>
              <p className="text-[11px] text-zinc-500">
                Receipts appear once a payment has been processed.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <EmptyState
            compact
            icon={Receipt}
            title={premium ? "Invoices are being prepared" : "No invoices yet"}
            description={
              premium
                ? "Your subscription is active. Stripe receipts will show up here after the next billing cycle."
                : "Upgrade to Pro to unlock unlimited applications and priority visibility."
            }
            action={
              !premium ? (
                <BrandButton
                  nativeButton={false}
                  render={<Link href="/checkout" />}
                >
                  See Pro plan
                </BrandButton>
              ) : undefined
            }
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-white">All plans</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const isCurrent =
              (premium && plan.name === "Pro") ||
              (!premium && plan.name === "Starter")

            return (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-5 ${
                  isCurrent
                    ? "border-[#5b4df5]/35 bg-[#5b4df5]/[0.07]"
                    : "border-white/[0.07] bg-[#101116]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="rounded-full border border-[#5b4df5]/30 bg-[#5b4df5]/15 px-2 py-0.5 text-[10px] font-medium text-[#b7afff]">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11.5px] text-zinc-500">
                  {plan.description}
                </p>
                <p className="mt-4 text-2xl font-semibold text-white">
                  {plan.price}
                  <span className="ml-1 text-[11px] font-normal text-zinc-500">
                    {plan.cadence}
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[12px] text-zinc-400"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
