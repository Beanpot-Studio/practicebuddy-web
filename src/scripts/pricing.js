// src/scripts/pricing.js
import { handleSubscriptionUpgrade } from '../lib/stripe.js'

function wirePricingButtons() {
  const proBtn = document.getElementById('upgrade-pro')
  const studioBtn = document.getElementById('upgrade-studio')
  if (proBtn) {
    proBtn.addEventListener('click', () => {
      const priceId = proBtn.getAttribute('data-price-id') || ''
      if (!priceId) return alert('Plan is not available. Try again later.')
      handleSubscriptionUpgrade(priceId)
    })
  }
  if (studioBtn) {
    studioBtn.addEventListener('click', () => {
      const priceId = studioBtn.getAttribute('data-price-id') || ''
      if (!priceId) return alert('Plan is not available. Try again later.')
      handleSubscriptionUpgrade(priceId)
    })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wirePricingButtons)
} else {
  wirePricingButtons()
}


