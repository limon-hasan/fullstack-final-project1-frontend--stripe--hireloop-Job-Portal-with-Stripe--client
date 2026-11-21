import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  CreditCard,
  Hash,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  const {
    status,
    payment_status,
    customer_email,
    customer_details,
    payment_intent,
    amount_total,
    currency,
    created,
    line_items,
  } = session

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    const result = await checkoutVerify(session_id)
    console.log("Checkout verify result:", result)

    const transactionId =
      typeof payment_intent === "string"
        ? payment_intent
        : (payment_intent?.id ?? "N/A")

    const email = customer_email || customer_details?.email || "N/A"
    const customerName = customer_details?.name || "Hireloop Pro Member"
    const planName = line_items?.data?.[0]?.description || "Hireloop Pro Plan"

    const formattedAmount =
      amount_total !== null
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (currency || "usd").toUpperCase(),
          }).format(amount_total / 100)
        : "$20.00"

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(created * 1000))

    return (
      <section
        id="success"
        className="min-h-screen bg-[#0B0C0E] px-4 py-12 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl">
          {/* Main Receipt Card */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131417]">
            {/* Top Status Banner */}
            <div className="border-b border-zinc-800/80 bg-gradient-to-b from-emerald-500/10 to-transparent px-6 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Hireloop Pro Activated
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Payment Successful
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                Thank you for upgrading,{" "}
                <span className="font-medium text-zinc-200">
                  {customerName}
                </span>
                . A confirmation receipt has been sent to{" "}
                <span className="font-medium text-zinc-200">{email}</span>.
              </p>
            </div>

            {/* Payment Details Body */}
            <div className="space-y-6 p-6 sm:p-8">
              {/* Highlighted Transaction ID */}
              <div className="rounded-xl border border-zinc-800 bg-[#1A1C21]/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                    <Hash className="h-3.5 w-3.5 text-blue-400" />
                    Transaction ID
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 capitalize">
                    {payment_status}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm font-medium break-all text-white">
                  {transactionId}
                </p>
              </div>

              {/* Order Breakdown */}
              <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-[#0F1013] px-4 text-sm">
                <div className="flex items-center justify-between py-3.5">
                  <span className="inline-flex items-center gap-2 text-zinc-400">
                    <Sparkles className="h-4 w-4 text-zinc-500" />
                    Plan
                  </span>
                  <span className="font-medium text-white">{planName}</span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="inline-flex items-center gap-2 text-zinc-400">
                    <CreditCard className="h-4 w-4 text-zinc-500" />
                    Amount Paid
                  </span>
                  <span className="font-bold text-emerald-400">
                    {formattedAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="inline-flex items-center gap-2 text-zinc-400">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    Customer Email
                  </span>
                  <span className="font-medium text-zinc-200">{email}</span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="inline-flex items-center gap-2 text-zinc-400">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    Payment Date
                  </span>
                  <span className="font-medium text-zinc-200">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <Link
                  href="/dashboard/seeker"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0070E0] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3F90E5]"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/browse-jobs"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-[#1A1C21] px-5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </div>
            </div>

            {/* Footer Note */}
            <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-800/80 bg-[#0F1013]/70 px-6 py-4 text-xs text-zinc-500 sm:flex-row sm:px-8">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                Verified by Stripe
              </span>
              <span>
                Need help? Email{" "}
                <a
                  href="mailto:orders@example.com"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white"
                >
                  orders@example.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#0B0C0E] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#131417] p-8 text-center">
        <h1 className="text-xl font-bold text-white">Payment Incomplete</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your payment status is currently{" "}
          <span className="font-medium text-zinc-200">{payment_status}</span>.
          Please try checking out again.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0070E0] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3F90E5]"
        >
          Return to Checkout
        </Link>
      </div>
    </section>
  )
}
