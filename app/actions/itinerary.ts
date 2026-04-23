"use server";

import { auth } from "@/auth";
import { initiateItineraryGeneration } from "@/lib/itinerary/service";
import { Vibe, Budget } from "../../generated/prisma/client";

import { itinerarySchema } from "@/lib/schemas/itinerary";

export async function generateItinerary(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Validate the input using the shared schema
  const rawData = {
    destination: formData.get("destination"),
    duration: Number(formData.get("duration")),
    budget: formData.get("budget"),
    vibe: formData.get("vibe"),
  };

  const validated = itinerarySchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  const { destination, duration: days, budget: budgetStr, vibe: vibeStr } = validated.data;

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
    const itinerary = await initiateItineraryGeneration({
      userId,
      destination,
      days,
      vibe,
      budget,
    });

    return { success: true, id: itinerary.id };
  } catch (error: any) {
    console.error("Initiating generation failed:", error);
    
    if (error.message === "Insufficient credits") {
      return { success: false, error: "INSUFFICIENT_CREDITS" };
    }

    return { success: false, error: "GENERIC_ERROR" };
  }
}


