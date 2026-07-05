// src/pages/api/stripe/create-checkout-session.ts
import type { APIRoute } from 'astro'

export const prerender = false
export const runtime = 'node'
import Stripe from 'stripe'

const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  : null

export const POST: APIRoute = async ({ request, site, url, locals }) => {
  try {
    if (!stripe) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 })
    }

    const body = await request.json().catch(() => ({}))
    const priceId: string | undefined = body.priceId
    const mode: 'subscription' | 'payment' = body.mode === 'payment' ? 'payment' : 'subscription'
    const successRedirect: string | undefined = body.successRedirect
    const userId: string | undefined = body.userId
    const customerEmail: string | undefined = body.customerEmail

    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Missing priceId' }), { status: 400 })
    }

    const origin = site?.toString() || `${url.protocol}//${url.host}`

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successRedirect || `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?upgrade=cancelled`,
      allow_promotion_codes: true,
      client_reference_id: userId,
      customer_email: customerEmail,
      metadata: userId ? { userId } : undefined,
    })

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), { status: 500 })
  }
}


