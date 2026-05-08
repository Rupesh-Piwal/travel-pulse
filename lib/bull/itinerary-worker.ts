import "./env";

import { Worker, Job } from "bullmq";
import pLimit from "p-limit";
import { connection } from "./connection";
import { prisma } from "../prisma";
import { generateItinerary as runGenerator } from "../itinerary/generateItinerary";
import { enrichItineraryWithImages } from "../../services/media/enrich-itinerary.service";
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
        const enrichedData = await enrichItineraryWithImages(generatedData, itinerary.destination);

        // Update destination table with hero image if available
        if (enrichedData.heroImage?.url) {
          await prisma.destination.upsert({
            where: { name: itinerary.destination },
            update: { image: enrichedData.heroImage.url },
            create: {
              name: itinerary.destination,
              image: enrichedData.heroImage.url,
              description: `Exploring the wonders of ${itinerary.destination}`,
              lat: enrichedData.lat,
              lng: enrichedData.lng,
              tags: [],
            },
          });
        }

        // ⭐ INCREMENTAL UPDATE 2: Save enriched itinerary
        await prisma.itinerary.update({
          where: { id: itineraryId },
          data: { data: enrichedData as any },
        });

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
    // --- EXTREME UPSTASH OPTIMIZATIONS ---
    // Upstash charges per command. These settings minimize idle Redis traffic.
    lockDuration: 300000,     // 5 min lock (fewer renewal pings during long AI jobs)
    stalledInterval: 300000,  // Check for stalled jobs every 5 min instead of 30s
    maxStalledCount: 2,
    drainDelay: 300,          // When queue is empty, wait 5 MINUTES before checking again
    // -------------------------------------
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
