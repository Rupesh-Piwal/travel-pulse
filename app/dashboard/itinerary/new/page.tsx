"use client";

import { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkle,
  Plus,
  Minus,
  Mountains,
  ForkKnife,
  Bank,
  CloudSun,
  Heart as HeartIcon,
  Camera,
  Lightning,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateItinerary } from "@/app/actions/itinerary";
import {
  itinerarySchema,
  type ItineraryFormValues,
} from "@/lib/schemas/itinerary";
import LocationInput from "@/app/components/itinerary/location-input";
import { useCredits } from "@/hooks/useCredits";
import { Slider } from "@/components/ui/slider";

const budgets = [
  { label: "Budget" },
  { label: "Mid-Range" },
  { label: "Luxury" },
] as const;

const vibes = [
  { label: "Adventure", icon: Mountains },
  { label: "Foodie", icon: ForkKnife },
  { label: "Cultural", icon: Bank },
  { label: "Relaxation", icon: CloudSun },
  { label: "Romantic", icon: HeartIcon },
  { label: "Photography", icon: Camera },
] as const;

export default function NewItineraryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { credits } = useCredits();

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
  const duration = watch("duration");

  const onSubmit = async (data: ItineraryFormValues) => {
    startTransition(async () => {
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
            description:
              "You've used all your credits for today. Credits reset every 24 hours.",
            duration: 5000,
          });
        } else if (result.error === "RATE_LIMIT") {
          toast.error("AI is Busy", {
            description:
              "Our travel guides are currently busy. Please wait about 30 seconds and try again.",
            duration: 5000,
          });
        } else {
          toast.error("Generation Failed", {
            description: "Something went wrong while crafting your trip.",
          });
        }
      }
    });
  };

  const SubmitButton = ({ className }: { className?: string }) => (
    <Button
      type="submit"
      disabled={isPending}
      className={cn(
        "h-12 w-full bg-gradient-to-r from-[#C4632C] to-[#D47037] hover:opacity-95 text-white rounded-[14px] font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 border-none group relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
      {isPending ? (
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Crafting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 relative z-10">
          <Sparkle weight="fill" className="w-4 h-4 text-orange-100" />
          <span>Generate Itinerary</span>
        </div>
      )}
    </Button>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)] w-full max-w-[760px] mx-auto px-4 lg:px-0">
      <div className="flex-1 flex flex-col justify-center py-6 lg:py-0">

        {/* Hero Section */}
        <header className="mb-6 lg:mb-8 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 tracking-tight leading-tight">
            Plan a new journey
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 font-medium">
            Let AI craft your perfect travel story in seconds.
          </p>
        </header>

        {/* Premium Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[16px] border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8 relative">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">

              {/* Row 1: Destination (Full Width) */}
              <div className="md:col-span-2 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                  Where to?
                </Label>
                <div className="relative">
                  <LocationInput
                    defaultValue={watch("destination")}
                    onSelect={(loc) => {
                      const fullName = loc.isFeatured
                        ? `${loc.name}, ${loc.country}`
                        : `${loc.name}${loc.city ? `, ${loc.city}` : ""}, ${loc.country}`;
                      setValue("destination", fullName, { shouldValidate: true });
                    }}
                    disabled={isPending}
                    className="h-12 rounded-[14px] border-zinc-200/80 bg-zinc-50/50 hover:bg-white focus:bg-white shadow-sm transition-colors text-sm font-medium"
                    dropdownClassName="w-full bg-white border border-zinc-200 shadow-xl rounded-2xl mt-2 overflow-hidden z-50"
                  />
                </div>
                <AnimatePresence>
                  {errors.destination && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium pl-1">
                      {errors.destination.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Row 2: Duration */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                  Duration
                </Label>
                <div className="flex items-center justify-between h-12 bg-zinc-50/50 border border-zinc-200/80 rounded-[14px] px-1.5 w-full shadow-sm">
                  <button
                    type="button"
                    disabled={duration <= 1 || isPending}
                    onClick={() => setValue("duration", Math.max(1, duration - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 disabled:opacity-40 transition-all text-zinc-600 active:scale-95"
                  >
                    <Minus weight="bold" className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900 tabular-nums tracking-tight">
                    {duration} {duration === 1 ? 'Day' : 'Days'}
                  </span>
                  <button
                    type="button"
                    disabled={duration >= 3 || isPending}
                    onClick={() => setValue("duration", Math.min(3, duration + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 disabled:opacity-40 transition-all text-zinc-600 active:scale-95"
                  >
                    <Plus weight="bold" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Budget */}
              <div className="space-y-2.5 flex flex-col justify-center">
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Budget
                  </Label>
                  <span className="text-[11px] font-bold text-[#C4632C] bg-[#C4632C]/10 px-2 py-0.5 rounded-md">
                    {selectedBudget}
                  </span>
                </div>
                <div className="h-12 flex items-center px-2">
                  <Slider
                    min={0}
                    max={2}
                    step={1}
                    value={[budgets.findIndex((b) => b.label === selectedBudget)]}
                    onValueChange={(vals) => setValue("budget", budgets[vals[0]].label as any)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Row 3: Vibes (Full Width) */}
              <div className="md:col-span-2 space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                  Travel Vibe
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {vibes.map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setValue("vibe", v.label as any)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 h-12 rounded-[14px] border text-left transition-all duration-200 group focus:outline-none",
                        selectedVibe === v.label
                          ? "bg-gradient-to-r from-[#C4632C] to-[#D47037] border-transparent text-white shadow-sm"
                          : "bg-white border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                      )}
                    >
                      <v.icon
                        weight={selectedVibe === v.label ? "fill" : "regular"}
                        className={cn("w-4 h-4 transition-colors", selectedVibe === v.label ? "text-orange-100" : "text-zinc-400 group-hover:text-zinc-600")}
                      />
                      <span className={cn("text-[13px] font-medium tracking-tight", selectedVibe === v.label ? "font-semibold" : "")}>
                        {v.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Desktop CTA (Inside Card Bottom) */}
            <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                <Lightning weight="fill" className="w-3.5 h-3.5 text-[#C4632C]" />
                <span>{credits ?? "—"} Credits Available</span>
              </div>
              <div className="w-[200px]">
                <SubmitButton />
              </div>
            </div>

          </div>
        </form>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200/60 p-4 pb-8 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <div className="max-w-[640px] mx-auto flex flex-col gap-3">
            <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <Lightning weight="fill" className="w-3.5 h-3.5 text-[#C4632C]" />
              <span>{credits ?? "—"} Credits Available</span>
            </div>
            <SubmitButton />
          </div>
        </div>

      </div>
    </div>
  );
}
