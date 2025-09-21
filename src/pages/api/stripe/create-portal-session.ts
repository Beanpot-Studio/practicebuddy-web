// src/pages/api/stripe/create-portal-session.ts
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
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' }) : null

export const POST: APIRoute = async ({ request, site, url }) => {
  try {
    if (!stripe) return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 })

    const { userId } = await request.json()
    if (!userId) return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 })

    const db = getAdminDb()
    const userSnap = await db.collection('users').doc(userId).get()
    if (!userSnap.exists) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    let { stripeCustomerId, email } = userSnap.data() as any
    // If we don't have a stored customer id, try to resolve by email
    if (!stripeCustomerId) {
      if (!email) {
        return new Response(JSON.stringify({ error: 'No Stripe customer on file' }), { status: 400 })
      }
      try {
        // Prefer Stripe search API
        const found = await stripe.customers.search({ query: `email:'${email}'`, limit: 1 })
        if (found.data && found.data.length > 0) {
          stripeCustomerId = found.data[0].id
          await db.collection('users').doc(userId).set({ stripeCustomerId }, { merge: true })
        } else {
          return new Response(JSON.stringify({ error: 'No Stripe customer on file' }), { status: 400 })
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: 'No Stripe customer on file' }), { status: 400 })
      }
    }

    const origin = site?.toString() || `${url.protocol}//${url.host}`
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}`,
    })
    // Store the latest portal link (note: portal session URLs are short-lived – generate on demand for production usage)
    await db.collection('users').doc(userId).set({
      billingPortal: {
        lastUrl: session.url,
        createdAt: new Date().toISOString()
      }
    }, { merge: true })

    return new Response(JSON.stringify({ url: session.url }), { headers: { 'Content-Type': 'application/json' }, status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500 })
  }
}


