"use client";

import { useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarBlank,
  Sparkle,
  CaretRight,
  WarningCircle,
  Plus,
  Minus,
  Mountains,
  ForkKnife,
  Bank,
  CloudSun,
  Heart as HeartIcon,
  Camera,
  Wallet,
  Coins,
  Crown,
  Lightning,
  Globe,
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

const budgets = [
  { label: "Budget", icon: Wallet, desc: "Value focused" },
  { label: "Mid-Range", icon: Coins, desc: "Comfort & Style" },
  { label: "Luxury", icon: Crown, desc: "High-end experience" },
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
            description:
              "Something went wrong while crafting your trip. Please try again.",
          });
        }
      }
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 lg:px-0 ">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-5xl md:text-6xl font-sans font-semibold tracking-tight text-foreground leading-tight">
            Plan a new <span className="text-terracotta">Journey.</span>
          </h1>
        </motion.div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Section 1: Destination & Duration */}
          <motion.section
            variants={item}
            className="grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-orange-500" weight="bold" />
                </div>
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Where to?
                </Label>
              </div>
              <LocationInput
                defaultValue={watch("destination")}
                onSelect={(loc) => {
                  const fullName = loc.isFeatured
                    ? `${loc.name}, ${loc.country}`
                    : `${loc.name}${loc.city ? `, ${loc.city}` : ""}, ${loc.country}`;
                  setValue("destination", fullName, { shouldValidate: true });
                }}
                disabled={isPending}
              />
              <AnimatePresence>
                {errors.destination && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-destructive flex items-center gap-1.5 ml-1"
                  >
                    <WarningCircle className="w-3.5 h-3.5" />
                    {errors.destination.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <CalendarBlank
                    className="w-4 h-4 text-orange-500"
                    weight="bold"
                  />
                </div>
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Days
                </Label>
              </div>
              <div className="flex items-center h-14 bg-accent/20 rounded-xl border border-border/50 p-1.5 glass group focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <button
                  type="button"
                  disabled={duration <= 1 || isPending}
                  onClick={() =>
                    setValue("duration", Math.max(1, duration - 1))
                  }
                  className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-accent/40 text-muted-foreground disabled:opacity-30"
                >
                  <Minus weight="bold" className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-xl font-black font-sans">
                    {duration}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={duration >= 3 || isPending}
                  onClick={() =>
                    setValue("duration", Math.min(3, duration + 1))
                  }
                  className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-accent/40 text-muted-foreground disabled:opacity-30"
                >
                  <Plus weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Budget */}
          <motion.section variants={item} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-orange-500" weight="bold" />
              </div>
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Budget Level
              </Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgets.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  disabled={isPending}
                  onClick={() => setValue("budget", b.label as any)}
                  className={cn(
                    "relative flex items-center gap-4 p-5 rounded-lg border transition-all duration-300 text-left group",
                    selectedBudget === b.label
                      ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-900/10"
                      : "bg-accent/10 border-border/50 text-muted-foreground hover:bg-accent/20",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                      selectedBudget === b.label
                        ? "bg-orange-500 text-white"
                        : "bg-accent/20 group-hover:bg-accent/40",
                    )}
                  >
                    <b.icon
                      className="w-6 h-6"
                      weight={selectedBudget === b.label ? "fill" : "regular"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-bold text-sm",
                        selectedBudget === b.label ? "text-foreground" : "",
                      )}
                    >
                      {b.label}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                      {b.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Section 3: Vibe */}
          <motion.section variants={item} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Sparkle className="w-4 h-4 text-orange-500" weight="bold" />
              </div>
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Select a Vibe
              </Label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {vibes.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  disabled={isPending}
                  onClick={() => setValue("vibe", v.label as any)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border transition-all duration-300 group",
                    selectedVibe === v.label
                      ? "bg-white text-black border-white shadow-xl scale-[1.02]"
                      : "bg-accent/10 border-border/50 text-muted-foreground hover:bg-accent/20",
                  )}
                >
                  <v.icon
                    className={cn(
                      "w-6 h-6 transition-transform group-hover:scale-110",
                      selectedVibe === v.label
                        ? "text-black"
                        : "text-muted-foreground",
                    )}
                    weight={selectedVibe === v.label ? "fill" : "regular"}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence>
              {errors.vibe && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-destructive flex items-center gap-1.5 ml-1"
                >
                  <WarningCircle className="w-3.5 h-3.5" />
                  {errors.vibe.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.section>
        </motion.div>

        {/* Footer: Credit Status & Generate */}
        <footer className="space-y-6 pt-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Lightning className="w-5 h-5 text-orange-500" weight="fill" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Available Balance
                </span>
                <span className="text-xs font-bold">
                  {credits ?? "—"} Credits
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-18 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xl font-bold rounded-lg shadow-orange-950/40 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed border-none"
          >
            {isPending ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="tracking-tight">Crafting your story...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-3">
                  <Sparkle
                    className="w-6 h-6 group-hover:rotate-12 transition-transform"
                    weight="fill"
                  />
                  <span>Generate Itinerary</span>
                </div>
                <CaretRight className="w-6 h-6 opacity-40 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </footer>
      </form>
    </div>
  );
}
