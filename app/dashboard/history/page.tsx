import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all itineraries for the authenticated user directly on the server
  const itinerariesRaw = await prisma.itinerary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      destination: true,
      days: true,
      budget: true,
      vibe: true,
      status: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  // Convert to plain objects and handle Date serialization if necessary
  // (Next.js 15 handles Date objects in RSC -> Client props automatically)
  const itineraries = itinerariesRaw.map(i => ({
    ...i,
    status: String(i.status), // Ensure enum is stringified for props
    budget: String(i.budget),
    vibe: String(i.vibe),
  }));

  return (
    <HistoryClient initialItineraries={itineraries as any} />
  );
}
