import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { stripe, CREDIT_TIERS, getOrCreateStripeCustomer } from "@/lib/stripe";
import type { TierKey } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    // 1. Validate user session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse and validate the tier
    const body = await req.json();
    const tier = body.tier as string;

    if (!tier || !(tier in CREDIT_TIERS)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be one of: voyager, pathfinder, globalist" },
        { status: 400 }
      );
    }

    const tierConfig = CREDIT_TIERS[tier as TierKey];

    // 3. Get or create a Stripe Customer
    const customerId = await getOrCreateStripeCustomer(session.user.id);

    // 4. Create a Stripe Checkout Session
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tierConfig.name,
              description: `${tierConfig.credits} credits for NomadGo`,
            },
            unit_amount: tierConfig.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        tier: tier,
        credits: String(tierConfig.credits),
      },
      success_url: `${origin}/dashboard/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/credits?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
