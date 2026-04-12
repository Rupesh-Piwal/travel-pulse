import { prisma } from "@/lib/prisma";
import { Vibe, Budget } from "../../generated/prisma/client";

interface GenerateItineraryParams {
  destinationName: string;
  days: number;
  vibe: Vibe;
  budget: Budget;
}

interface ActivityData {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
}

interface DayPlan {
  day: number;
  title: string;
  activities: ActivityData[];
}

interface ItineraryResult {
  destination: string;
  days: DayPlan[];
}

export async function generateItinerary({
  destinationName,
  days,
  vibe,
  budget,
}: GenerateItineraryParams): Promise<ItineraryResult> {
  // 1. Find destination by name
  const destination = await prisma.destination.findUnique({
    where: { name: destinationName },
    include: { activities: true },
  });

  if (!destination) {
    throw new Error(`Destination "${destinationName}" not found.`);
  }

  // 2. Fetch all activities
  let activities = destination.activities;

  // 3. Filter activities by vibe
  let filteredActivities = activities.filter((a) => a.vibe === vibe);

  // Fallback to all activities if filtered < required (at least 3 per day)
  if (filteredActivities.length < days * 3) {
    filteredActivities = activities;
  }

  // 4. Shuffle activities randomly
  const shuffled = [...filteredActivities].sort(() => Math.random() - 0.5);

  // 5. Build the itinerary day by day
  const resultDays: DayPlan[] = [];
  let activityIndex = 0;

  for (let i = 1; i <= days; i++) {
    const dayActivities: ActivityData[] = [];
    let totalDuration = 0;
    const targetMinDuration = 360; // 6 hours
    const targetMaxDuration = 480; // 8 hours

    // Pick 3-5 activities
    for (let count = 0; count < 5; count++) {
      if (activityIndex >= shuffled.length) {
        // Recycle activities if we run out (for long itineraries)
        activityIndex = 0;
      }

      const activity = shuffled[activityIndex];
      dayActivities.push({
        title: activity.title,
        description: activity.description,
        image: activity.image,
        lat: activity.lat,
        lng: activity.lng,
      });

      totalDuration += activity.duration;
      activityIndex++;

      // Stop if we have at least 3 activities and reached duration target
      if (dayActivities.length >= 3 && totalDuration >= targetMinDuration) {
        break;
      }
      
      // Stop anyway if we hit the count limit (though we try to reach duration)
      if (dayActivities.length === 5) {
        break;
      }
    }

    resultDays.push({
      day: i,
      title: `Day ${i}: Exploring ${destinationName}`,
      activities: dayActivities,
    });
  }

  return {
    destination: destination.name,
    days: resultDays,
  };
}
