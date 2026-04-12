import { Budget, Vibe } from "@/generated/prisma";
import { generateItinerary } from "@/lib/itinerary/generateItinerary";
import "dotenv/config";

async function test() {
  try {
    const result = await generateItinerary({
      destinationName: "Tokyo",
      days: 3,
      vibe: Vibe.ADVENTURE,
      budget: Budget.MID,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
