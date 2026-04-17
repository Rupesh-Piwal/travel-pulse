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

const travelFromPreviousSchema = z.object({
  mode: z.enum(["walk", "bus", "train", "taxi", "ferry"]).describe("Best transport mode from previous stop"),
  duration: z.string().describe("Travel time, e.g. '12 mins'"),
  distance: z.string().describe("Distance, e.g. '0.8 km'"),
});

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
  address: z.string().describe("Full street address of the location"),
  duration: z.string().describe("Recommended time to spend, e.g. '1.5 hours' or '45 mins'"),
  proTip: z.string().describe("A short insider tip that only a local would know — make it genuinely useful"),
  travelFromPrevious: travelFromPreviousSchema.nullable().describe("How to get here from the previous activity. Use null for the FIRST activity of each day."),
});

const suggestedStaySchema = z.object({
  name: z.string().describe("Hotel, hostel, or accommodation name"),
  type: z.enum(["Hotel", "Hostel", "Boutique", "Resort", "Airbnb"]).describe("Type of accommodation"),
  priceRange: z.string().describe("Price range per night, e.g. '$80-$150'"),
  neighborhood: z.string().describe("Area or neighborhood where it is located"),
});

const daySchema = z.object({
  day: z.number().describe("The sequence number of the day"),
  title: z.string().describe("A creative, themed title for the day (e.g., 'Gothic Secrets & River Sunsets')"),
  summary: z.string().describe("A 1-2 sentence overview of what the day covers and its highlights"),
  estimatedCost: z.string().describe("Estimated total cost for the day including meals and activities, e.g. '$80-$120'"),
  activities: z.array(activitySchema).describe("List of 4-6 activities logically sequenced for the day"),
});

const itinerarySchema = z.object({
  destination: z.string(),
  lat: z.number().describe("The latitude of the destination center"),
  lng: z.number().describe("The longitude of the destination center"),
  travelTips: z.array(z.string()).describe("3-5 essential travel tips specific to this destination"),
  bestTimeToVisit: z.string().describe("Best months or season to visit, e.g. 'April to June, September to October'"),
  localCurrency: z.string().describe("Local currency name and rough USD exchange rate, e.g. 'Euro (€1 ≈ $1.08)'"),
  language: z.string().describe("Primary language spoken at the destination"),
  suggestedStays: z.array(suggestedStaySchema).describe("3-4 recommended places to stay matching the user's budget"),
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
      You are an expert travel concierge for "NomadGo", a premium travel planning service. 
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
      6. Accuracy: For the destination and all activities, provide realistic latitude/longitude coordinates and REAL street addresses.
      7. Imagery: Leave the image field as null (we will handle it later).
      8. Travel Transitions: For each activity EXCEPT the first one of each day, provide realistic travel info (mode, duration, distance) from the previous stop. Prefer walking for short distances (<1km), public transit for medium, taxi for long.
      9. Pro Tips: For each activity, provide a genuinely useful insider tip that a first-time visitor wouldn't know.
      10. Day Summary: Each day MUST have a 1-2 sentence summary and an estimated total cost range.
      11. Accommodation: Suggest 3-4 places to stay that match the ${budget} budget level. Include the neighborhood and nightly price range.
      12. Destination Intel: Provide travel tips, best time to visit, local currency with exchange rate, and primary language.
    `,
  });

  return object;
}
