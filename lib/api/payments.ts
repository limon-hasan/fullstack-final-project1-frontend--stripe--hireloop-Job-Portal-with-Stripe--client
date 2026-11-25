import "server-only"

import { stripe } from "@/lib/stripe"

export interface PaymentTransaction {
  id: string
  transactionId: string
  userId: string
  customerEmail: string
  customerName: string
  planName: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export async function getTransactions(
  limit = 50
): Promise<PaymentTransaction[]> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return []

    const sessions = await stripe.checkout.sessions.list({
      limit,
      expand: ["data.payment_intent", "data.line_items"],
    })

    return sessions.data
      .filter((s) => s.status === "complete" || s.payment_status === "paid")
      .map((s) => {
        const paymentIntentId =
          typeof s.payment_intent === "string"
            ? s.payment_intent
            : (s.payment_intent?.id ?? s.id)

        return {
          id: s.id,
          transactionId: paymentIntentId,
          userId: s.metadata?.userId ?? "",
          customerEmail: s.customer_email || s.customer_details?.email || "",
          customerName: s.customer_details?.name || "",
          planName:
            s.line_items?.data?.[0]?.description || "HireLoop Pro Plan",
          amount: (s.amount_total ?? 0) / 100,
          currency: (s.currency || "usd").toUpperCase(),
          status: s.payment_status,
          createdAt: new Date(s.created * 1000).toISOString(),
        }
      })
  } catch {
    return []
  }
}

export async function getUserTransactions(
  userId?: string,
  email?: string | null
): Promise<PaymentTransaction[]> {
  if (!userId && !email) return []

  const all = await getTransactions(100)
  const normalizedEmail = email?.trim().toLowerCase()

  return all.filter((tx) => {
    if (userId && tx.userId && tx.userId === userId) return true
    if (
      normalizedEmail &&
      tx.customerEmail &&
      tx.customerEmail.toLowerCase() === normalizedEmail
    ) {
      return true
    }
    return false
  })
}

