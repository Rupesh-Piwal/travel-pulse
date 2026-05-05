import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      select: {
        status: true,
        data: true,
      },
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: itinerary.status,
      data: itinerary.data,
    });
  } catch (error) {
    console.error("Error fetching itinerary status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
