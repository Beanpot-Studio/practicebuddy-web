import { loadStripe } from '@stripe/stripe-js';
import app from './firebase.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Initialize Stripe
let stripe = null;

// In-memory cache for Firestore 'plans' collection
const plansCache = {
  initialized: false,
  byPriceId: new Map(), // priceId -> { code, maxStudents }
  byCode: new Map() // code -> { code, maxStudents }
}

async function ensurePlansCache() {
  if (plansCache.initialized) return plansCache
  try {
    const db = getFirestore(app)
    const snap = await getDocs(collection(db, 'plans'))
    snap.forEach((docSnap) => {
      const data = docSnap.data() || {}
      const code = (data.code || data.id || docSnap.id || '').toString().toLowerCase()
      const maxStudents = data.maxStudents ?? null

      // Collect price IDs from common field names
      const priceIds = new Set()
      ;[data.priceId, data.stripePriceId, data.default_price, data.price]?.forEach((p) => {
        if (typeof p === 'string' && p.trim()) priceIds.add(p.trim())
        if (p && typeof p === 'object' && p.id) priceIds.add(String(p.id))
      })
      ;[data.prices, data.stripePriceIds]?.forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((p) => {
          if (typeof p === 'string' && p.trim()) priceIds.add(p.trim())
          if (p && typeof p === 'object' && p.id) priceIds.add(String(p.id))
        })
      })

      const planInfo = { code, maxStudents }
      if (code) plansCache.byCode.set(code, planInfo)
      priceIds.forEach((pid) => {
        plansCache.byPriceId.set(pid, planInfo)
      })
    })
    plansCache.initialized = true
  } catch {
    // Ignore; fallback mapping will be used
  }
  return plansCache
}

export async function initializeStripe() {
  if (!stripe) {
    const publishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not found');
      return null;
    }
    stripe = await loadStripe(publishableKey);
  }
  return stripe;
}

// Check if user has active subscription
export async function checkSubscriptionStatus(customerId) {
  try {
    // This would typically call your backend, but for now we'll use localStorage
    // In production, you'd want to verify this with your backend
    const subscriptionData = localStorage.getItem(`subscription_${customerId}`);
    if (subscriptionData) {
      return JSON.parse(subscriptionData);
    }
    return null;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return null;
  }
}

// Get plan limits based on subscription
export function getPlanLimits(subscriptionPlan) {
  const plans = {
    free: {
      maxStudents: 5,
      maxClasses: null, // unlimited
      name: 'Free Plan',
      description: 'Up to 5 students'
    },
    pro: {
      maxStudents: 10,
      maxClasses: null, // unlimited
      name: 'Pro Plan', 
      description: '6-10 students'
    },
    studio: {
      maxStudents: null, // unlimited
      maxClasses: null, // unlimited
      name: 'Studio Plan',
      description: '11+ students'
    }
  };
  
  return plans[subscriptionPlan] || plans.free;
}

// Handle subscription upgrade
export async function handleSubscriptionUpgrade(priceId) {
  try {
    // Validate Price ID format
    if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
      alert('Invalid Price ID. Please configure a Stripe Price ID starting with "price_" for this plan.')
      return
    }
    // Require an authenticated user so the extension can link the session to Firestore
    const auth = getAuth(app)
    const user = auth.currentUser
    if (!user) {
      const params = new URLSearchParams({ upgrade: '1', priceId })
      window.location.assign(`/` + `?` + params.toString())
      return
    }
    // Use local API route (non-extension flow)
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode: 'subscription',
        userId: user.uid,
        customerEmail: user.email || undefined,
        successRedirect: `${window.location.origin}/billing/success?price=${encodeURIComponent(priceId)}`
      })
    })
    const data = await response.json()
    if (data?.url) {
      window.location.href = data.url
      return
    }
    throw new Error(data?.error || 'Failed to create checkout session')
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

// Update subscription data in localStorage (for demo purposes)
// In production, this would be updated via webhooks or backend verification
export function updateLocalSubscription(customerId, subscriptionData) {
  try {
    localStorage.setItem(`subscription_${customerId}`, JSON.stringify(subscriptionData));
  } catch (error) {
    console.error('Error updating local subscription:', error);
  }
}

// Check if user can add more students
export function canAddStudent(currentCount, maxStudents) {
  // If maxStudents is null, unlimited
  if (maxStudents === null) return true;
  return currentCount < maxStudents;
}

// Check if user can add more classes (always true now)
export function canAddClass(currentCount, maxClasses) {
  // Classes are unlimited for all plans
  return true;
} 

// Map Stripe price IDs to internal plan codes
export async function getPlanFromPriceId(priceId) {
  try {
    if (!priceId) return 'free'
    await ensurePlansCache()
    const fromCache = plansCache.byPriceId.get(priceId)
    if (fromCache?.code) return fromCache.code

    // Fallback to env mapping if not found in cache
    const pro = import.meta.env.PUBLIC_STRIPE_PRO_PRICE_ID || ''
    const studio = import.meta.env.PUBLIC_STRIPE_STUDIO_PRICE_ID || ''
    if (priceId === pro) return 'pro'
    if (priceId === studio) return 'studio'
    return 'free'
  } catch {
    return 'free'
  }
}

export async function getPlanLimitsAsync(planCode) {
  try {
    if (!planCode) return getPlanLimits('free')
    await ensurePlansCache()
    const fromCache = plansCache.byCode.get(String(planCode).toLowerCase())
    if (fromCache) {
      return {
        maxStudents: fromCache.maxStudents ?? null,
        maxClasses: null,
        name: `${String(planCode).charAt(0).toUpperCase()}${String(planCode).slice(1)} Plan`,
        description: ''
      }
    }
    return getPlanLimits(planCode)
  } catch {
    return getPlanLimits(planCode)
  }
}