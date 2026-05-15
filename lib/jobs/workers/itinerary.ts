import { Worker, Job } from "bullmq";
import { connection } from "../core/connection";
import { prisma } from "../../prisma";
import { generateItinerary as runGenerator } from "../../itinerary/generateItinerary";
import { enrichItineraryWithImages } from "../../../services/media/enrich-itinerary.service";
import { ItineraryStatus } from "@prisma/client";
import { ITINERARY_QUEUE_NAME } from "../queues/itinerary";

// Singleton Pattern for Next.js HMR to prevent worker leaks
declare global {
  var itineraryWorker: Worker | undefined;
}

export const itineraryWorker = global.itineraryWorker || new Worker(
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
          data: (itinerary.data as any) || (generatedData as any), // Fallback to generated if enrichment failed
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
    lockDuration: 300000,
    stalledInterval: 300000,
    maxStalledCount: 2,
    drainDelay: 300,
    // -------------------------------------
  }
);

if (process.env.NODE_ENV !== "production") {
  global.itineraryWorker = itineraryWorker;
}

itineraryWorker.on("completed", (job) => {
  console.log(`✅ Itinerary Job ${job.id} completed`);
});

itineraryWorker.on("failed", (job, err) => {
  console.log(`❌ Itinerary Job ${job?.id} failed with ${err.message}`);
});

export default itineraryWorker;
