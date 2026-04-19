import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ItineraryViewClient from "@/app/components/itinerary/itinerary-view-client";
import GenerationLoading from "@/app/components/itinerary/generation-loading";
import { ItineraryStatus } from "../../../../generated/prisma/client";

// ... (interfaces remain the same)

export default async function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!itinerary) {
    notFound();
  }

  // 1. Handle Loading States
  if (itinerary.status === ItineraryStatus.QUEUED || itinerary.status === ItineraryStatus.PROCESSING) {
    return <GenerationLoading itineraryId={resolvedParams.id} />;
  }

  // 2. Handle Failure
  if (itinerary.status === ItineraryStatus.FAILED) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <h1 className="text-2xl font-serif mb-4">Generation Failed</h1>
        <p className="text-zinc-400 mb-8">Something went wrong while crafting your trip. Please try again.</p>
        <a href="/dashboard/itinerary/new" className="px-6 py-2 bg-orange-600 rounded-xl font-bold">Try New Trip</a>
      </div>
    );
  }

  // 3. Handle Done State
  if (!itinerary.data) {
    notFound();
  }

  const destination = await prisma.destination.findUnique({
    where: { name: itinerary.destination }
  });

  const data = itinerary.data as unknown as ItineraryData;
  const heroImage = data.heroImage || destination?.image || "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop";

  return (
    <ItineraryViewClient
      itinerary={{
        id: resolvedParams.id,
        destination: itinerary.destination,
        vibe: itinerary.vibe,
        budget: itinerary.budget,
        days: itinerary.days,
      }}
      data={data}
      heroImage={heroImage}
    />
  );
}

