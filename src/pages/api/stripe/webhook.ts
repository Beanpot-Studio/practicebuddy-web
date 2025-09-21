// src/pages/api/stripe/webhook.ts
import type { APIRoute } from 'astro'

export const prerender = false
export const runtime = 'node'
import Stripe from 'stripe'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function loadServiceAccount(): any {
  const projectId = process.env.PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.PUBLIC_FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.PUBLIC_FIREBASE_PRIVATE_KEY

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n')
  }

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey }
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  const json = process.env.FIREBASE_SERVICE_ACCOUNT
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  if (json) return JSON.parse(json)
  throw new Error('Missing Firebase service account env')
}

function getAdminDb() {
  const apps = getApps()
  const app = apps.length ? apps[0] : initializeApp({ credential: cert(loadServiceAccount()) })
  return getFirestore(app)
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string | undefined
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string | undefined

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' }) : null

async function mapPriceToPlan(priceId: string): Promise<{ code: string; maxStudents: number | null }> {
  // Read all plans and build a simple mapping
  try {
    const db = getAdminDb()
    const snap = await db.collection('plans').get()
    let fallback: { code: string; maxStudents: number | null } = { code: 'free', maxStudents: 5 }
    for (const doc of snap.docs) {
      const data = doc.data() || {}
      const code = String(data.code || doc.id || '').toLowerCase()
      const maxStudents = data.maxStudents ?? null
      const prices: string[] = Array.isArray(data.prices) ? data.prices : []
      const primary = typeof data.priceId === 'string' ? data.priceId : undefined
      const all = new Set<string>([...prices, ...(primary ? [primary] : [])].filter(Boolean))
      if (all.has(priceId)) {
        return { code, maxStudents }
      }
      if (code === 'free') fallback = { code, maxStudents }
    }
    // env fallback
    if (priceId === (process.env.PUBLIC_STRIPE_PRO_PRICE_ID || '')) return { code: 'pro', maxStudents: 10 }
    if (priceId === (process.env.PUBLIC_STRIPE_STUDIO_PRICE_ID || '')) return { code: 'studio', maxStudents: null }
    return fallback
  } catch {
    // Last-resort fallback
    if (priceId === (process.env.PUBLIC_STRIPE_PRO_PRICE_ID || '')) return { code: 'pro', maxStudents: 10 }
    if (priceId === (process.env.PUBLIC_STRIPE_STUDIO_PRICE_ID || '')) return { code: 'studio', maxStudents: null }
    return { code: 'free', maxStudents: 5 }
  }
}

async function updateUserPlan(userId: string, planCode: string, status: string, maxStudents: number | null) {
  const db = getAdminDb()
  const ref = db.collection('users').doc(userId)
  await ref.set(
    {
      subscriptionPlan: planCode,
      subscriptionStatus: status,
      maxStudents: maxStudents ?? null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!stripe || !webhookSecret) {
      return new Response('Stripe not configured', { status: 500 })
    }

    // Stripe requires raw body for signature verification
    const rawBody = Buffer.from(await request.arrayBuffer())
    const signature = request.headers.get('stripe-signature') || ''

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err: any) {
      return new Response(`Webhook Error: ${err?.message || 'invalid signature'}`, { status: 400 })
    }

    // Handle relevant events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        let userId = (session.client_reference_id as string) || (session.metadata?.userId as string) || ''
        // Attempt to recover user by email if userId not present
        if (!userId) {
          const email = (session.customer_details?.email as string) || (session.customer_email as string) || ''
          if (email) {
            try {
              const db = getAdminDb()
              const q = await db.collection('users').where('email', '==', email).limit(1).get()
              if (!q.empty) userId = q.docs[0].id
            } catch {}
          }
        }
        if (!userId) break
        // Get purchased price (fallback to subscription retrieval if needed)
        let priceId = ''
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
          const item = lineItems.data[0]
          priceId = (item?.price as any)?.id || (item?.price as any) || ''
        } catch {}
        if (!priceId && session.subscription) {
          try {
            const sub = await stripe.subscriptions.retrieve(String(session.subscription))
            priceId = sub.items?.data?.[0]?.price?.id || ''
          } catch {}
        }
        if (!priceId) break
        const plan = await mapPriceToPlan(priceId)
        // Persist Stripe customer id for portal access
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id
        const db = getAdminDb()
        if (stripeCustomerId) {
          await db.collection('users').doc(userId).set({ stripeCustomerId }, { merge: true })
        }
        await updateUserPlan(userId, plan.code, 'active', plan.maxStudents)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        // Attempt to recover userId through latest_invoice -> customer_email or metadata on subscription
        let userId = (sub.metadata?.userId as string) || ''
        if (!userId) {
          // Try to resolve via customer email from invoice
          const customerEmail = (sub as any)?.customer_email as string | undefined
          if (customerEmail) {
            try {
              const db = getAdminDb()
              const q = await db.collection('users').where('email', '==', customerEmail).limit(1).get()
              if (!q.empty) userId = q.docs[0].id
            } catch {}
          }
        }
        // If userId missing, we rely on checkout.session.completed path for plan setting
        const status = String(sub.status || 'active')
        const priceId = (sub.items?.data?.[0]?.price?.id as string) || ''
        if (userId) {
          // Persist Stripe customer id
          const db = getAdminDb()
          const stripeCustomerId = typeof sub.customer === 'string' ? sub.customer : (sub.customer as any)?.id
          if (stripeCustomerId) {
            await db.collection('users').doc(userId).set({ stripeCustomerId }, { merge: true })
          }
        }
        if (userId && priceId) {
          const plan = await mapPriceToPlan(priceId)
          await updateUserPlan(userId, plan.code, status, plan.maxStudents)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = (sub.metadata?.userId as string) || ''
        if (userId) {
          // Mark as canceled; keep last plan for reference
          await updateUserPlan(userId, 'free', 'canceled', 5)
        }
        break
      }
      default:
        // Ignore other events
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), { status: 500 })
  }
}


