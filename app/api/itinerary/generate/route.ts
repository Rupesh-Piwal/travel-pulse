import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deductCredits, refundCredits } from "@/lib/credits";
import { generateItinerary } from "@/lib/itinerary/generateItinerary";
import { Vibe, Budget, ItineraryStatus } from "../../../../generated/prisma/client";

const generateSchema = z.object({
  destination: z.string().min(1),
  days: z.number().int().min(1).max(30),
  vibe: z.nativeEnum(Vibe),
  budget: z.nativeEnum(Budget),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = generateSchema.parse(body);

    // 1. Create Itinerary row with status = PROCESSING
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: user.userId,
        destination: validated.destination,
        days: validated.days,
        vibe: validated.vibe,
        budget: validated.budget,
        status: ItineraryStatus.PROCESSING,
      },
    });

    try {
      // 2. Deduct 1 credit
      await deductCredits(user.userId, 1);

      // 3. Generate itinerary synchronously
      const generatedData = await generateItinerary({
        destinationName: validated.destination,
        days: validated.days,
        vibe: validated.vibe,
        budget: validated.budget,
      });

      // 4. Update Itinerary: status = DONE, data = generated JSON
      const updatedItinerary = await prisma.itinerary.update({
        where: { id: itinerary.id },
        data: {
          status: ItineraryStatus.DONE,
          data: generatedData as any,
          lastUsedAt: new Date(),
        },
      });

      return NextResponse.json(updatedItinerary);
    } catch (innerError: any) {
      // 5. Handle failure: update status to FAILED and refund credit
      await prisma.itinerary.update({
        where: { id: itinerary.id },
        data: { status: ItineraryStatus.FAILED },
      });

      // Refund credit if deduction happened
      try {
        await refundCredits(user.userId, 1);
      } catch (refundError) {
        // Log refund error but don't crash again?
        console.error("Refund failed:", refundError);
      }

      return NextResponse.json(
        { error: innerError.message || "Generation failed" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }

    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
