import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { addCredits } from "@/lib/credits";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler
 *
 * IMPORTANT: This route reads the raw body for signature verification.
 * Next.js App Router handles this correctly as long as we use req.text().
 */
export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    // 1. Read raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("[WEBHOOK] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // 2. Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[WEBHOOK] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // 3. Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (!userId || !tier || !credits) {
      console.error("[WEBHOOK] Missing metadata on session:", session.id);
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    try {
      // 4. Idempotency check — skip if already processed
      const existingPayment = await prisma.payment.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingPayment?.status === "completed") {
        console.log("[WEBHOOK] Already processed session:", session.id);
        return NextResponse.json({ received: true });
      }

      // 5. Create or update Payment record
      await prisma.payment.upsert({
        where: { stripeSessionId: session.id },
        create: {
          userId,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          amount: session.amount_total ?? 0,
          credits,
          tier,
          status: "completed",
        },
        update: {
          status: "completed",
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        },
      });

      // 6. Add credits to the user's balance
      await addCredits(userId, credits, session.id);

      console.log(
        `[WEBHOOK] ✅ Added ${credits} credits to user ${userId} (session: ${session.id})`
      );
    } catch (err) {
      console.error("[WEBHOOK] Fulfillment error:", err);
      return NextResponse.json(
        { error: "Fulfillment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
