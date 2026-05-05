import { Worker, Job } from "bullmq";
import pLimit from "p-limit";
import { connection } from "./connection";
import { prisma } from "../prisma";
import { generateItinerary as runGenerator } from "../itinerary/generateItinerary";
import { fetchPexelsImage } from "../pexels";
import { ItineraryStatus } from "@prisma/client";

export const ITINERARY_QUEUE_NAME = "itinerary-generation";

// Initialize the limiter with a concurrency of 5
const limit = pLimit(5);

// Singleton Pattern for Next.js HMR to prevent worker leaks
declare global {
  var itineraryWorker: Worker | undefined;
}

const worker = global.itineraryWorker || new Worker(
  ITINERARY_QUEUE_NAME,
  async (job: Job) => {
    const { itineraryId } = job.data;
    console.log(`👷 Worker processing job ${job.id} for itinerary ${itineraryId}`);

    // FETCH ITINERARY
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      throw new Error(`Itinerary ${itineraryId} not found`);
    }

    try {
      // 1. UPDATE STATUS TO PROCESSING
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: { status: ItineraryStatus.PROCESSING },
      });

      // 2. AI GENERATION
      console.log(`🤖 Starting AI Generation for ${itinerary.destination}...`);
      const generatedData = await runGenerator({
        destinationName: itinerary.destination,
        days: itinerary.days,
        vibe: itinerary.vibe,
        budget: itinerary.budget,
      });

      // ⭐ INCREMENTAL UPDATE 1: Save the structure
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: { data: generatedData as any },
      });

      // 3. IMAGE ENRICHMENT
      console.log(`📸 Starting Image Enrichment...`);
      try {
        const destImage = await fetchPexelsImage(itinerary.destination, "landscape");
        (generatedData as any).heroImage = destImage;

        // Background update of destination table
        await prisma.destination.upsert({
          where: { name: itinerary.destination },
          update: { image: destImage },
          create: {
            name: itinerary.destination,
            image: destImage,
            description: `Exploring the wonders of ${itinerary.destination}`,
            lat: (generatedData as any).lat,
            lng: (generatedData as any).lng,
            tags: [],
          },
        });

        // ⭐ INCREMENTAL UPDATE 2: Save hero image
        await prisma.itinerary.update({
          where: { id: itineraryId },
          data: { data: generatedData as any },
        });

        // Activity images with concurrency limiting (max 5 at a time)
        await Promise.all(
          generatedData.days.flatMap((day: any) =>
            day.activities.map((activity: any) =>
              limit(async () => {
                if (!activity.image) {
                  // SMARTER SEARCH: If it's a meal/restaurant, search for the cuisine/vibe 
                  // instead of the specific name which Unsplash won't have.
                  let searchQuery = `${activity.title} ${itinerary.destination}`;

                  if (activity.category === "RESTAURANT" || activity.mealType !== "NONE") {
                    const cuisine = (activity as any).cuisine || "";
                    searchQuery = `${cuisine} food restaurant ${itinerary.destination}`;
                  }

                  console.log(`🖼️ Fetching image for: ${activity.title} (Query: ${searchQuery})`);
                  activity.image = await fetchPexelsImage(
                    searchQuery,
                    "square",
                    itinerary.destination
                  );

                  // ⭐ INCREMENTAL UPDATE 3: Save activity image
                  await prisma.itinerary.update({
                    where: { id: itineraryId },
                    data: { data: generatedData as any },
                  });

                  // Add a small delay to "drip-feed" the UI updates
                  await new Promise(resolve => setTimeout(resolve, 800));
                }
              })
            )
          )
        );
      } catch (imgError) {
        console.error("❌ Image enrichment failed:", imgError);
      }

      // 4. SAVE & FINALIZE
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          status: ItineraryStatus.DONE,
          data: generatedData as any,
          lastUsedAt: new Date(),
        },
      });

      console.log(`✅ Itinerary ${itineraryId} complete!`);
    } catch (error: any) {
      console.error(`❌ Job ${job.id} failed:`, error);

      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: { status: ItineraryStatus.FAILED },
      });

      throw error;
    }
  },
  { 
    connection,
    // --- UPSTASH OPTIMIZATIONS ---
    lockDuration: 60000,    // 60s locks (reduces lock renewal pings)
    stalledInterval: 60000, // Check for stalled jobs every 60s instead of 30s
    maxStalledCount: 1,
    drainDelay: 10,         // Wait 10s when queue is empty before polling again
    // -----------------------------
  }
);

if (process.env.NODE_ENV !== "production") {
  global.itineraryWorker = worker;
}

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed with ${err.message}`);
});

console.log("🚀 Itinerary Worker is running...");

export default worker;
