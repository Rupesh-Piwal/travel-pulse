"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Star, Lightbulb, ArrowSquareOut } from "@phosphor-icons/react";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  timeOfDay: string;
  category?: string;
  mealType?: string;
  rating?: number;
  priceLevel?: string;
  address?: string;
  duration?: string;
  proTip?: string;
}

interface ActivityProps {
  activity: Activity;
  index: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  RESTAURANT: "🍽️", LANDMARK: "🏛️", ACTIVITY: "🎯", HOTEL: "🏨", TRANSPORT: "🚆",
};

const MEAL_EMOJI: Record<string, string> = {
  BREAKFAST: "☕", LUNCH: "🍝", DINNER: "🥂", SNACK: "🧁",
};

const TIME_COLORS: Record<string, string> = {
  Morning: "from-amber-200/40 to-orange-100/20",
  Afternoon: "from-sky-200/30 to-blue-100/20",
  Evening: "from-indigo-200/40 to-purple-100/20",
};

export default function AnimatedActivityCard({ activity, index }: ActivityProps) {
  const mapsUrl = activity.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}` : null;
  const isEven = index % 2 === 0;
  const emoji = CATEGORY_EMOJI[activity.category || "ACTIVITY"] || "📍";
  const mealEmoji = activity.mealType && activity.mealType !== "NONE" ? MEAL_EMOJI[activity.mealType] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group/act relative"
    >
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 rounded-[2.5rem] overflow-hidden bg-white border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700`}>
        
        {/* ──── Image Panel (50%) ──── */}
        {activity.image && (
          <div className="relative w-full md:w-[48%] min-h-[300px] md:min-h-[380px] overflow-hidden">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover/act:scale-[1.08] transition-transform duration-[4s] ease-out" 
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Floating info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-2xl">
                    {emoji}
                </div>
                 {mealEmoji && (
                    <div className="p-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-xl">
                      {mealEmoji}
                    </div>
                 )}
              </div>
              
              {activity.rating && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 text-white shadow-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-black">{activity.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── Content Panel ──── */}
        <div className="flex-1 flex flex-col justify-center p-10 md:p-12 space-y-6">
          
          {/* Time + Duration Row */}
          <div className="flex items-center gap-4">
            <div className={`w-2.5 h-2.5 rounded-full ${
                activity.timeOfDay === "Morning" ? "bg-amber-400" :
                activity.timeOfDay === "Afternoon" ? "bg-orange-500" : "bg-indigo-400"
            }`} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              {activity.timeOfDay}
            </span>
            {activity.duration && (
              <>
                <div className="w-1 h-1 rounded-full bg-zinc-200" />
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{activity.duration}</span>
                </div>
              </>
            )}
          </div>

          {/* Title — Bold Advenzo style */}
          <h3 className="text-3xl md:text-4xl font-black text-zinc-950 leading-[0.95] tracking-tight">
            {activity.title}
          </h3>

          {/* Description */}
          <p className="text-[15px] text-zinc-500 leading-[1.8] font-light max-w-md">
            {activity.description}
          </p>

          {/* Bottom Bar: Address + Price */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-50">
            {activity.address && mapsUrl && (
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-zinc-400 hover:text-orange-600 transition-all duration-300 group/addr"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-[13px] font-medium tracking-tight truncate max-w-[200px]">{activity.address}</span>
              </a>
            )}
            
            {activity.priceLevel && (
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">{activity.priceLevel}</span>
            )}
          </div>

          {/* Pro Tip */}
          {activity.proTip && (
            <div className="flex gap-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Lightbulb className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-zinc-600 font-medium italic leading-relaxed">
                &ldquo;{activity.proTip}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
