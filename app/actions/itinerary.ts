"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";


import { generateItinerary as runGenerator } from "@/lib/itinerary/generateItinerary";
import { Vibe, Budget, ItineraryStatus } from "../../generated/prisma/client";
import { fetchUnsplashImage } from "@/lib/unsplash";

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
    // Fallbacks for others
    "Romantic": Vibe.RELAXED,
    "Photography": Vibe.CULTURAL
  };

  const budget = budgetMap[budgetStr] || Budget.MID;
  const vibe = vibeMap[vibeStr] || Vibe.ADVENTURE;

  const totalStart = performance.now();

  try {
    // 1. Credit Deduction
    console.log("💳 Deducting credits...");
    await deductCredits(userId, 1);

    // 2. AI Generation
    console.log("🤖 Starting AI Itinerary Generation...");
    const aiStart = performance.now();
    const generatedData = await runGenerator({
      destinationName: destination,
      days,
      vibe,
      budget,
    });
    const aiEnd = performance.now();
    console.log(`✅ AI Generation Complete: ${((aiEnd - aiStart) / 1000).toFixed(2)}s`);

    // 3. Dynamic Image Enrichment
    console.log("📸 Starting Image Enrichment...");
    const imgStart = performance.now();
    try {
      // 1. Fetch a hero image for the destination
      const destImage = await fetchUnsplashImage(destination, "landscape");
      (generatedData as any).heroImage = destImage;
      
      // Update destination image in background if it's missing
      await prisma.destination.upsert({
        where: { name: destination },
        update: { image: destImage },
        create: { 
          name: destination, 
          image: destImage,
          description: `Exploring the wonders of ${destination}`,
          lat: (generatedData as any).lat,
          lng: (generatedData as any).lng,
          tags: []
        }
      });
      
      // 2. Fetch images for each activity in each day
      await Promise.all(
        generatedData.days.map(async (day) => {
          await Promise.all(
            day.activities.map(async (activity) => {
              if (!activity.image) {
                activity.image = await fetchUnsplashImage(
                  `${activity.title} ${destination}`, 
                  "squarish",
                  destination
                );
              }
            })
          );
        })
      );
    } catch (imgError) {
      console.error("❌ Image enrichment failed (non-critical):", imgError);
    }
    const imgEnd = performance.now();
    console.log(`✅ Image Enrichment Complete: ${((imgEnd - imgStart) / 1000).toFixed(2)}s`);

    // 4. Database Persistence
    console.log("💾 Saving itinerary to database...");
    const dbStart = performance.now();
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        destination,
        days,
        vibe,
        budget,
        status: ItineraryStatus.DONE,
        data: generatedData as any,
      },
    });
    const dbEnd = performance.now();
    console.log(`✅ Database Persistence Complete: ${((dbEnd - dbStart) / 1000).toFixed(2)}s`);

    const totalEnd = performance.now();
    console.log(`🚀 TOTAL GENERATION TIME: ${((totalEnd - totalStart) / 1000).toFixed(2)}s`);

    return { success: true, id: itinerary.id };
  } catch (error: any) {
    console.error("Generation failed:", error);
    
    // Check for specific credit error
    if (error.message === "Insufficient credits") {
      return { success: false, error: "INSUFFICIENT_CREDITS" };
    }

    // Check for AI Rate Limits (429)
    if (error.statusCode === 429) {
      return { success: false, error: "RATE_LIMIT" };
    }

    return { success: false, error: "GENERIC_ERROR" };
  }
}

