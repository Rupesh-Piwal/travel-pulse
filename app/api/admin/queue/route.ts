import { NextResponse } from "next/server";
import { pdfQueue } from "@/lib/jobs/queues/pdf";
import { itineraryQueue } from "@/lib/jobs/queues/itinerary";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Authenticate check (ensure only logged-in users/admins can see job stats)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Fetch live job statuses in parallel
    const [pdfStats, itineraryStats] = await Promise.all([
      pdfQueue.getJobCounts(),
      itineraryQueue.getJobCounts(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      queues: {
        pdfGeneration: pdfStats,
        itineraryGeneration: itineraryStats,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch queue stats:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch queue stats" },
      { status: 500 }
    );
  }
}
