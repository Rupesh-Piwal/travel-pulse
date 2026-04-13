import { prisma } from "@/lib/prisma";
import { Vibe, Budget } from "../../generated/prisma/client";
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
});

const daySchema = z.object({
  day: z.number().describe("The sequence number of the day"),
  title: z.string().describe("A creative, themed title for the day (e.g., 'Gothic Secrets & River Sunsets')"),
  activities: z.array(activitySchema).describe("List of 3-5 activities logically sequenced for the day"),
});

const itinerarySchema = z.object({
  destination: z.string(),
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

  if (!destination) {
    throw new Error(`Destination "${destinationName}" not found in our database.`);
  }

  // 2. Prepare the local context
  const availableActivities = destination.activities.map(a => ({
    title: a.title,
    description: a.description,
    image: a.image,
    lat: a.lat,
    lng: a.lng,
    vibe: a.vibe,
    duration: a.duration
  }));

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
      
      Available Activities (Use these as your primary source of truth, but you can refine descriptions to fit the flow):
      ${JSON.stringify(availableActivities, null, 2)}
      
      Guidelines:
      1. Logic: Group activities that are geographically close to each other in the same day.
      2. Flow: Ensure a natural progression from Morning to Evening.
      3. Variety: Try to match the user's ${vibe} vibe, but include legendary "must-see" spots if they fit.
      4. Titles: Give each day a unique, evocative title that summarizes the 'theme' of that day.
      5. Accuracy: Use the provided lat/lng coordinates and image URLs for the activities.
    `,
  });

  return object;
}
