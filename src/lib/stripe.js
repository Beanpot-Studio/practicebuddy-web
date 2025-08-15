import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripe = null;

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
    const stripe = await initializeStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?upgrade=success`,
      cancelUrl: `${window.location.origin}/pricing?upgrade=cancelled`,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
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