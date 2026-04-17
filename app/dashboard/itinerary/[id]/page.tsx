import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ItineraryViewClient from "@/app/components/itinerary/itinerary-view-client";

interface TravelFromPrevious {
  mode: string;
  duration: string;
  distance: string;
}

interface Activity {
  title: string;
  description: string;
  image: string | null;
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
  heroImage?: string;
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

  if (!itinerary || !itinerary.data) {
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
