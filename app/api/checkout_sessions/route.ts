import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getSession } from '@/lib/core/server'

export async function POST() {
    const userSession = await getSession()
    // const user = userSession?.user
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')


        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1Ud2kLDFBrRZHUGAhqme6L61',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: userSession?.user?.email,
            metadata: {
                userId: userSession?.user.id ?? ""
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
        })

        return NextResponse.redirect(session.url as string, 303)
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}