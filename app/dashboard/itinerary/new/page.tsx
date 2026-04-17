"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Sparkles,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateItinerary } from "@/app/actions/itinerary";
import { itinerarySchema, type ItineraryFormValues } from "@/lib/schemas/itinerary";

const budgets = ["Budget", "Mid-Range", "Luxury"] as const;
const vibes = [
  "Adventure", 
  "Foodie", 
  "Cultural", 
  "Relaxation", 
  "Romantic", 
  "Photography"
] as const;

export default function NewItineraryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      budget: "Mid-Range",
      vibe: "",
      duration: 3,
    },
  });

  const selectedBudget = watch("budget");
  const selectedVibe = watch("vibe");

  const onSubmit = async (data: ItineraryFormValues) => {
    startTransition(async () => {
      // Convert data to FormData for the server action
      const formData = new FormData();
      formData.append("destination", data.destination);
      formData.append("duration", data.duration.toString());
      formData.append("budget", data.budget);
      formData.append("vibe", data.vibe);

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
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-0">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <section className="space-y-6">
          {/* Destination */}
          <div className="space-y-3">
            <Label htmlFor="destination" className="text-sm font-medium ml-1">Destination</Label>
            <div className="relative group">
              <MapPin className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                errors.destination ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
              )} />
              <Input 
                id="destination" 
                {...register("destination")}
                placeholder="Santorini, Greece" 
                className={cn(
                  "pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 transition-all rounded-2xl",
                  errors.destination && "border-destructive/50 focus-visible:ring-destructive"
                )}
                disabled={isPending}
              />
            </div>
            {errors.destination && (
              <p className="text-xs text-destructive flex items-center gap-1.5 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label htmlFor="duration" className="text-sm font-medium ml-1">Duration (Days)</Label>
            <div className="relative group">
              <Calendar className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                errors.duration ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
              )} />
              <Input 
                id="duration" 
                type="number"
                {...register("duration", { valueAsNumber: true })}
                placeholder="3" 
                className={cn(
                  "pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 transition-all rounded-2xl",
                  errors.duration && "border-destructive/50 focus-visible:ring-destructive"
                )}
                disabled={isPending}
              />
            </div>
            {errors.duration && (
              <p className="text-xs text-destructive flex items-center gap-1.5 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.duration.message}
              </p>
            )}
          </div>
        </section>

        {/* Budget Selection */}
        <section className="space-y-4">
          <Label className="text-sm font-medium ml-1">Budget</Label>
          <div className="flex p-1.5 bg-accent/20 rounded-2xl border border-border/50 glass">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                disabled={isPending}
                onClick={() => setValue("budget", b)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  selectedBudget === b 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-950/20" 
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50"
                )}
              >
                {b}
              </button>
            ))}
          </div>
          {errors.budget && <p className="text-xs text-destructive ml-1">{errors.budget.message}</p>}
        </section>

        {/* Vibe Selection */}
        <section className="space-y-4">
          <Label className="text-sm font-medium ml-1">Vibe</Label>
          <div className="flex flex-wrap gap-3">
            {vibes.map((v) => (
              <button
                key={v}
                type="button"
                disabled={isPending}
                onClick={() => setValue("vibe", v)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300",
                  selectedVibe === v
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-accent/20 border-border/50 text-muted-foreground hover:border-border hover:bg-accent/40 disabled:opacity-50"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          {errors.vibe && (
            <p className="text-xs text-destructive flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.vibe.message}
            </p>
          )}
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
