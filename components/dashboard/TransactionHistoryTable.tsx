"use client"

import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Receipt,
  XCircle,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { BrandButton } from "@/components/shared/brand-button"
import { toast } from "@/components/ui/toast"
import type { PaymentTransaction } from "@/lib/api/payments"
import { formatDate } from "@/lib/format"

interface TransactionHistoryTableProps {
  transactions: PaymentTransaction[]
  showCustomer?: boolean
  emptyActionHref?: string
  emptyActionLabel?: string
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function TransactionHistoryTable({
  transactions,
  showCustomer = false,
  emptyActionHref = "/checkout",
  emptyActionLabel = "Upgrade to Pro",
}: TransactionHistoryTableProps) {
  const handleCopyId = async (txId: string) => {
    try {
      await navigator.clipboard.writeText(txId)
      toast.add({
        title: "Transaction ID copied",
        description: txId,
      })
    } catch {
      toast.add({
        title: "Could not copy ID",
        description: "Please copy the transaction ID manually.",
      })
    }
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        compact
        icon={Receipt}
        title="No transactions yet"
        description="Once a payment is completed through Stripe, your receipt and transaction details will appear here."
        action={
          emptyActionHref ? (
            <BrandButton
              nativeButton={false}
              render={<Link href={emptyActionHref} />}
            >
              {emptyActionLabel}
            </BrandButton>
          ) : undefined
        }
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.06] bg-[#14151c] text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            <th className="px-5 py-3.5">Transaction</th>
            <th className="px-4 py-3.5">Plan</th>
            {showCustomer ? <th className="px-4 py-3.5">Customer</th> : null}
            <th className="px-4 py-3.5">Amount</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Date</th>
            <th className="px-5 py-3.5 text-right">Receipt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05] text-[13px]">
          {transactions.map((tx) => {
            const isPaid = tx.status === "paid"
            const isPending = tx.status === "no_payment_required"

            return (
              <tr
                key={tx.id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="max-w-[170px] truncate font-mono text-xs text-zinc-200">
                      {tx.transactionId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(tx.transactionId)}
                      title="Copy transaction ID"
                      className="cursor-pointer rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-white">
                  {tx.planName}
                </td>
                {showCustomer ? (
                  <td className="px-4 py-3.5">
                    <p className="truncate font-medium text-zinc-200">
                      {tx.customerName || "Member"}
                    </p>
                    <p className="truncate text-[11.5px] text-zinc-500">
                      {tx.customerEmail || "—"}
                    </p>
                  </td>
                ) : null}
                <td className="px-4 py-3.5 font-semibold text-white">
                  {formatMoney(tx.amount, tx.currency)}
                </td>
                <td className="px-4 py-3.5">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-300">
                      <XCircle className="h-3 w-3" />
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-zinc-400">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/checkout/success?session_id=${encodeURIComponent(tx.id)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#15161d] px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Receipt
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

