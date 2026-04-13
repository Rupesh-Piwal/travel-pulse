"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const budgets = ["Budget", "Mid-Range", "Luxury"];
const vibes = [
  "Adventure", 
  "Foodie", 
  "Cultural", 
  "Relaxation", 
  "Romantic", 
  "Photography"
];

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { generateItinerary } from "@/app/actions/itinerary";

export default function NewItineraryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [budget, setBudget] = useState("Mid-Range");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe) 
        : [...prev, vibe]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await generateItinerary(formData);
      
      if (result.success) {
        toast.success("Itinerary generated successfully!");
        router.push(`/dashboard/itinerary/${result.id}`);
      } else {
        if (result.error === "INSUFFICIENT_CREDITS") {
          toast.error("Insufficient Credits", {
            description: "You've used all your credits for today. Credits reset every 24 hours.",
            duration: 5000,
          });
        } else if (result.error === "RATE_LIMIT") {
          toast.error("AI is Busy", {
            description: "Our travel guides are currently busy. Please wait about 30 seconds and try again.",
            duration: 5000,
          });
        } else {
          toast.error("Generation Failed", {
            description: "Something went wrong while crafting your trip. Please try again.",
          });
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <header className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-semibold tracking-tight text-foreground mb-3"
        >
          Plan a new trip
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Tell us about your dream destination.
        </motion.p>
      </header>

      <form action={handleSubmit} className="space-y-10">
        <section className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="destination" className="text-sm font-medium ml-1">Destination</Label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="destination" 
                name="destination"
                placeholder="Santorini, Greece" 
                className="pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 transition-all rounded-2xl"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="duration" className="text-sm font-medium ml-1">Duration (Days)</Label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="duration" 
                name="duration"
                type="number"
                placeholder="5" 
                className="pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 transition-all rounded-2xl"
                required
                disabled={isPending}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <Label className="text-sm font-medium ml-1">Budget</Label>
          <input type="hidden" name="budget" value={budget} />
          <div className="flex p-1.5 bg-accent/20 rounded-2xl border border-border/50 glass">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                disabled={isPending}
                onClick={() => setBudget(b)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  budget === b 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-950/20" 
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Label className="text-sm font-medium ml-1">Vibe</Label>
          <input type="hidden" name="vibe" value={selectedVibes[0] || ""} />
          <div className="flex flex-wrap gap-3">

            {vibes.map((v) => (
              <button
                key={v}
                type="button"
                disabled={isPending}
                onClick={() => toggleVibe(v)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300",
                  selectedVibes.includes(v)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-accent/20 border-border/50 text-muted-foreground hover:border-border hover:bg-accent/40 disabled:opacity-50"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        <Button 
          type="submit"
          disabled={isPending}
          className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-lg font-semibold shadow-xl shadow-orange-950/30 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Crafting your journey...
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Generate Itinerary — 1 Credit
              <ChevronRight className="w-5 h-5 ml-auto" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
