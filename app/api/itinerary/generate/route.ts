import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { initiateItineraryGeneration } from "@/lib/itinerary/service";
import { Vibe, Budget } from "../../../../generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const generateSchema = z.object({
  destination: z.string().min(1),
  days: z.number().int().min(1).max(3),
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

    const itinerary = await initiateItineraryGeneration({
      userId: user.userId,
      destination: validated.destination,
      days: validated.days,
      vibe: validated.vibe,
      budget: validated.budget,
    });

    return NextResponse.json(itinerary);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }

    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
