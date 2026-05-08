import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ItineraryViewClient from "@/app/components/itinerary/itinerary-view-client";
import GenerationLoading from "@/app/components/itinerary/generation-loading";
import { ItineraryStatus } from "@prisma/client";

interface TravelFromPrevious {
  mode: string;
  duration: string;
  distance: string;
}

interface Activity {
  title: string;
  description: string;
  image: any | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  category?: string;
  mealType?: string;
  rating?: number;
  priceLevel?: string;
  address?: string;
  duration?: string;
  proTip?: string;
  travelFromPrevious?: TravelFromPrevious | null;
}

interface Day {
  day: number;
  title: string;
  summary?: string;
  estimatedCost?: string;
  activities: Activity[];
}

interface SuggestedStay {
  name: string;
  type: string;
  priceRange: string;
  neighborhood: string;
}

interface ItineraryData {
  destination: string;
  heroImage?: any;
  estimatedTotalExpense?: string;
  estimatedCostINR?: { min: number; max: number };
  placesCount?: number;
  totalDistanceKm?: number;
  difficulty?: string;
  days: Day[];
  travelTips?: string[];
  bestTimeToVisit?: string;
  localCurrency?: string;
  language?: string;
  suggestedStays?: SuggestedStay[];
}


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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6F7] p-6">
        <h1 className="text-3xl font-serif text-zinc-900 mb-4">Generation Failed</h1>
        <p className="text-zinc-500 mb-8">Something went wrong while crafting your trip. Please try again.</p>
        <a href="/dashboard/itinerary/new" className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-black transition-all">Try New Trip</a>
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
  const resolvedHeroImage = (typeof data.heroImage === 'string' ? data.heroImage : data.heroImage?.url) || destination?.image || "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop";

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
      heroImage={resolvedHeroImage}
    />
  );
}

