import { prisma } from "@/lib/prisma";
import { Vibe, Budget, ActivityCategory, MealType } from "../../generated/prisma/client";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

interface GenerateItineraryParams {
  destinationName: string;
  days: number;
  vibe: Vibe;
  budget: Budget;
}

const activitySchema = z.object({
  title: z.string().describe("The name of the activity or location"),
  description: z.string().describe("A rich, engaging description of what to do there"),
  image: z.string().nullable().describe("URL to an image of the location"),
  lat: z.number().describe("Latitude coordinate"),
  lng: z.number().describe("Longitude coordinate"),
  timeOfDay: z.enum(["Morning", "Afternoon", "Evening"]).describe("The best time of day for this activity"),
  category: z.nativeEnum(ActivityCategory).describe("The primary category of this location"),
  mealType: z.nativeEnum(MealType).describe("If this is a restaurant, which meal is it best for? Use NONE if not a restaurant."),
  rating: z.number().min(3.5).max(5).describe("Review rating (4.0-5.0). Be honest but prioritize high-quality spots."),
  priceLevel: z.string().describe("Estimated price level ($, $$, $$$, $$$$)"),
});

const daySchema = z.object({
  day: z.number().describe("The sequence number of the day"),
  title: z.string().describe("A creative, themed title for the day (e.g., 'Gothic Secrets & River Sunsets')"),
  activities: z.array(activitySchema).describe("List of 3-5 activities logically sequenced for the day"),
});

const itinerarySchema = z.object({
  destination: z.string(),
  lat: z.number().describe("The latitude of the destination center"),
  lng: z.number().describe("The longitude of the destination center"),
  days: z.array(daySchema),
});

export async function generateItinerary({
  destinationName,
  days,
  vibe,
  budget,
}: GenerateItineraryParams) {
  // 1. Fetch destination and its activities from DB to "ground" the AI
  const destination = await prisma.destination.findUnique({
    where: { name: destinationName },
    include: { activities: true },
  });

  // Prepare grounding data if destination exists
  const availableActivities = destination ? destination.activities.map(a => ({
    title: a.title,
    description: a.description,
    image: a.image,
    lat: a.lat,
    lng: a.lng,
    vibe: a.vibe,
    category: a.category,
    rating: a.rating,
    priceLevel: a.priceLevel,
  })) : [];

  // 3. Generate the structured itinerary using Gemini
  const { object } = await generateObject({
    model: google("gemini-flash-latest"),
    schema: itinerarySchema,
    prompt: `
      You are an expert travel planner for "NomadGo". 
      Create a realistic, geographically sensible ${days}-day itinerary for ${destinationName}.
      
      User Preferences:
      - Vibe: ${vibe}
      - Budget: ${budget}
      
      Grounding Information:
      ${destination ? `We have the following known locations in ${destinationName}: ${JSON.stringify(availableActivities, null, 2)}` : `Note: ${destinationName} is not in our primary database. Use your internal expert knowledge to suggest REAL-WORLD, highly-rated locations.`}
      
      Critical Guidelines:
      1. Dining: Every day MUST include exactly 3 meal stops: one for Breakfast, one for Lunch, and one for Dinner.
      2. Quality: Only suggest restaurants and landmarks with a reputation for excellence (Ratings 4.0+). Avoid generic or low-quality tourist traps.
      3. Price Balance: Ensure the suggested spots match the user's ${budget} budget.
      4. Logic: Group activities that are geographically close to each other in the same day.
      5. Variety: Include a mix of LANDMARKs, RESTAURANTs, and local ACTIVITIEs.
      6. Accuracy: For the destination and all activities, provide realistic latitude/longitude coordinates.
      7. Imagery: If suggesting a new place, leave the image field as null (we will handle it later).
    `,
  });

  return object;
}

