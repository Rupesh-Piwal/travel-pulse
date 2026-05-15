import { prisma } from "../prisma";
import { deductCredits, refundCredits } from "../credits";
import { addItineraryJob } from "../jobs";
import { Vibe, Budget, ItineraryStatus } from "@prisma/client";

interface InitiateGenerationParams {
  userId: string;
  destination: string;
  days: number;
  vibe: Vibe;
  budget: Budget;
}

/**
 * Shared service to initiate an itinerary generation.
 * Handles credit deduction, DB record creation, and job queueing.
 */
export async function initiateItineraryGeneration({
  userId,
  destination,
  days,
  vibe,
  budget,
}: InitiateGenerationParams) {
  // 1. Create Itinerary row with status = PROCESSING
  const itinerary = await prisma.itinerary.create({
    data: {
      userId,
      destination,
      days,
      vibe,
      budget,
      status: ItineraryStatus.PROCESSING,
    },
  });

  try {
    // 2. Deduct 1 credit
    await deductCredits(userId, 1);

    // 3. Queue the generation job
    await addItineraryJob(itinerary.id);

    return itinerary;
  } catch (error: any) {
    // 4. Handle failure: update status to FAILED
    await prisma.itinerary.update({
      where: { id: itinerary.id },
      data: { status: ItineraryStatus.FAILED },
    });

    // 5. Refund credit if it was actually deducted
    // We only refund if the error happened AFTER deduction (i.e. during queuing)
    if (error.message !== "Insufficient credits") {
      try {
        await refundCredits(userId, 1);
      } catch (refundError) {
        console.error("Critical: Refund failed during generation initiation:", refundError);
      }
    }

    throw error;
  }
}
