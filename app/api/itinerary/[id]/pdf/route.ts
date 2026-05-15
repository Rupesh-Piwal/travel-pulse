import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { addPdfJob } from "@/lib/jobs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: itineraryId } = await params;

    // 1. Verify itinerary
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      select: { id: true, userId: true }
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Check for recent existing export (avoid duplicate work within 5 mins)
    const existingExport = await prisma.pdfExport.findFirst({
      where: {
        itineraryId,
        status: { in: ["QUEUED", "ACTIVE"] },
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }
      }
    });

    if (existingExport) {
      return NextResponse.json({ exportId: existingExport.id, status: existingExport.status });
    }

    // 3. Deduct credit
    try {
      await deductCredits(session.user.id, 1);
    } catch (e: any) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // 4. Create Export Record
    const pdfExport = await prisma.pdfExport.create({
      data: {
        itineraryId,
        userId: session.user.id,
        status: "QUEUED",
      }
    });

    // 5. Determine Base URL for worker
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // 6. Queue Job
    await addPdfJob({
      itineraryId,
      userId: session.user.id,
      pdfExportId: pdfExport.id,
      baseUrl,
    });

    return NextResponse.json({ 
      exportId: pdfExport.id, 
      status: "QUEUED",
      message: "PDF generation started in background"
    });

  } catch (error) {
    console.error("PDF Queue API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
