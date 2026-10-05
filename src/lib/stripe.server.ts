import Stripe from "stripe";

// Server-only. Never import this file from a component.
let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY. Add it to your .env file.");
    stripe = new Stripe(key);
  }
  return stripe;
}

// Must match the currency in money() in src/lib/catalog.ts
export const STORE_CURRENCY = "usd";
