import { z } from "zod";

export const itinerarySchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  duration: z.number()
    .min(1, "Minimum duration is 1 day")
    .max(3, "Maximum duration is 3 days (Premium trial limit)"),
  budget: z.enum(["Budget", "Mid-Range", "Luxury"], {
    error: "Please select a budget",
  }),
  vibe: z.string().min(1, "Please select at least one vibe"),
});

export type ItineraryFormValues = z.infer<typeof itinerarySchema>;

// automatically creates a TypeScript type for you. 
// You never have to manually define interface FormProps again.