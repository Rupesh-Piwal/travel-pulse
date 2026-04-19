"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";


import { generateItinerary as runGenerator } from "@/lib/itinerary/generateItinerary";
import { Vibe, Budget, ItineraryStatus } from "../../generated/prisma/client";
import { fetchUnsplashImage } from "@/lib/unsplash";

import { addItineraryJob } from "@/lib/bull/itinerary-queue";

export async function generateItinerary(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const destination = formData.get("destination") as string;
  const days = parseInt(formData.get("duration") as string);
  const budgetStr = formData.get("budget") as string;
  const vibeStr = formData.get("vibe") as string;

  // Simple mapping
  const budgetMap: Record<string, Budget> = {
    "Budget": Budget.BUDGET,
    "Mid-Range": Budget.MID,
    "Luxury": Budget.LUXURY
  };

  const vibeMap: Record<string, Vibe> = {
    "Adventure": Vibe.ADVENTURE,
    "Foodie": Vibe.FOODIE,
    "Cultural": Vibe.CULTURAL,
    "Relaxation": Vibe.RELAXED,
    "Romantic": Vibe.RELAXED,
    "Photography": Vibe.CULTURAL
  };

  const budget = budgetMap[budgetStr] || Budget.MID;
  const vibe = vibeMap[vibeStr] || Vibe.ADVENTURE;

  try {
    // 1. Credit Deduction (Synchronous to ensure payment)
    console.log("💳 Deducting credits...");
    await deductCredits(userId, 1);

    // 2. Create Placeholder Itinerary with QUEUED status
    console.log("💾 Creating placeholder itinerary record...");
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        destination,
        days,
        vibe,
        budget,
        status: ItineraryStatus.QUEUED,
      },
    });

    // 3. Add to BullMQ Queue
    console.log("📨 Adding generation job to queue...");
    await addItineraryJob(itinerary.id);

    return { success: true, id: itinerary.id };
  } catch (error: any) {
    console.error("Initiating generation failed:", error);
    
    if (error.message === "Insufficient credits") {
      return { success: false, error: "INSUFFICIENT_CREDITS" };
    }

    return { success: false, error: "GENERIC_ERROR" };
  }
}


