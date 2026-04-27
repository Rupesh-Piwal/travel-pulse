import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// ─── Stripe SDK Instance ────────────────────────────────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// ─── Credit Tier Configuration (single source of truth) ─────────────
export const CREDIT_TIERS = {
  voyager: { name: "Voyager Credits Pack", price: 500, credits: 30 },
  pathfinder: { name: "Pathfinder Credits Pack", price: 2000, credits: 100 },
  globalist: { name: "Globalist Credits Pack", price: 4900, credits: 300 },
} as const;

export type TierKey = keyof typeof CREDIT_TIERS;

/**
 * Get or create a Stripe Customer for a given user.
 * Stores the stripeCustomerId on the User record for future use.
 */
export async function getOrCreateStripeCustomer(
  userId: string
): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  // Already has a Stripe Customer
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create a new Stripe Customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  });

  // Persist the Stripe Customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
