import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Receipt,
  Sparkles,
} from "lucide-react"

import { TransactionHistoryTable } from "@/components/dashboard/TransactionHistoryTable"
import { BrandButton } from "@/components/shared/brand-button"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getUserTransactions } from "@/lib/api/payments"
import { getUserPremiumbyId } from "@/lib/api/users"
import { getSession } from "@/lib/core/server"

export const metadata: Metadata = {
  title: "Transaction History",
}

export default async function SeekerTransactionsPage() {
  const session = await getSession()
  const userId = session?.user?.id ?? ""
  const userEmail = session?.user?.email ?? ""

  const [transactions, { premium }] = await Promise.all([
    getUserTransactions(userId, userEmail),
    userId ? getUserPremiumbyId(userId) : Promise.resolve({ premium: false }),
  ])

  const paidTransactions = transactions.filter((tx) => tx.status === "paid")
  const totalSpent = paidTransactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/seeker" },
          { label: "Billing", href: "/dashboard/seeker/billing" },
          { label: "Transaction history" },
        ]}
        eyebrow="Payments & receipts"
        title="Transaction history"
        description="Review all your Stripe payments, subscription upgrades and downloadable receipts."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/seeker/billing"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Billing
            </Link>
            {!premium ? (
              <BrandButton
                nativeButton={false}
                render={<Link href="/checkout" />}
                className="h-10 px-4"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </BrandButton>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon={CreditCard}
          accent="emerald"
          hint="Verified via Stripe"
        />
        <StatCard
          label="Successful payments"
          value={paidTransactions.length}
          icon={CheckCircle2}
          accent="sky"
          hint="Completed checkouts"
        />
        <StatCard
          label="Current plan"
          value={premium ? "HireLoop Pro" : "Starter"}
          icon={Sparkles}
          accent="violet"
          hint={premium ? "Active membership" : "Free tier"}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400">
              <Receipt className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">
                All transactions
              </h2>
              <p className="text-[11px] text-zinc-500">
                {transactions.length}{" "}
                {transactions.length === 1 ? "record" : "records"} found
              </p>
            </div>
          </div>
        </div>

        <TransactionHistoryTable transactions={transactions} />
      </section>
    </div>
  )
}

