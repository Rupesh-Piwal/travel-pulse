import { Queue } from "bullmq";
import { connection } from "./connection";

export const ITINERARY_QUEUE_NAME = "itinerary-generation";

// Singleton Pattern for Next.js HMR
declare global {
  var itineraryQueue: Queue | undefined;
}

export const itineraryQueue = global.itineraryQueue || new Queue(ITINERARY_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

if (process.env.NODE_ENV !== "production") {
  global.itineraryQueue = itineraryQueue;
}

/**
 * Adds a new itinerary generation job to the queue
 */
export async function addItineraryJob(itineraryId: string) {
  return await itineraryQueue.add(
    "generate",
    { itineraryId },
    { jobId: itineraryId } // Ensure we don't have duplicate jobs for the same ID
  );
}
