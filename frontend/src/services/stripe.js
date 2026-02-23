import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Warning: VITE_STRIPE_PUBLISHABLE_KEY is not set');
}

// Load Stripe and cache the promise
let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export { getStripe, STRIPE_PUBLISHABLE_KEY };
