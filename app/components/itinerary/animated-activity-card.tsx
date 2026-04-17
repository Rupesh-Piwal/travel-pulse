"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Star, Lightbulb, ExternalLink } from "lucide-react";

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
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 rounded-[2rem] overflow-hidden bg-white border border-zinc-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_80px_-16px_rgba(0,0,0,0.1)] transition-all duration-700`}>
        
        {/* ──── Image Panel (50%) ──── */}
        {activity.image && (
          <div className="relative w-full md:w-[50%] min-h-[260px] md:min-h-[320px] overflow-hidden">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover/act:scale-[1.06] transition-transform duration-[4s] ease-out" 
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Minimal floating info */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-lg">{emoji}</span>
                {mealEmoji && <span className="text-lg drop-shadow-lg">{mealEmoji}</span>}
              </div>
              
              {activity.rating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-xl rounded-full">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[12px] font-semibold text-white">{activity.rating.toFixed(1)}</span>
                  {activity.priceLevel && (
                    <span className="text-[12px] text-white/60 ml-1">{activity.priceLevel}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── Content Panel ──── */}
        <div className={`flex-1 flex flex-col justify-center p-8 md:p-10 space-y-5 bg-gradient-to-br ${TIME_COLORS[activity.timeOfDay] || TIME_COLORS.Morning}`}>
          
          {/* Time + Duration Row */}
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              {activity.timeOfDay}
            </span>
            {activity.duration && (
              <>
                <div className="w-4 h-px bg-zinc-300" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{activity.duration}</span>
                </div>
              </>
            )}
          </div>

          {/* Title — dramatic serif */}
          <h3 className="text-2xl md:text-[1.75rem] font-serif text-zinc-950 leading-[1.15] tracking-tight">
            {activity.title}
          </h3>

          {/* Description */}
          <p className="text-[13px] text-zinc-500 leading-[1.8] font-light max-w-md">
            {activity.description}
          </p>

          {/* Address */}
          {activity.address && mapsUrl && (
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-600 transition-colors duration-300 group/addr w-fit"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[12px] truncate max-w-[250px]">{activity.address}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/addr:opacity-100 transition-opacity shrink-0" />
            </a>
          )}

          {/* Pro Tip */}
          {activity.proTip && (
            <div className="flex gap-3 pt-2">
              <Lightbulb className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-zinc-500/80 italic leading-relaxed max-w-sm">
                &ldquo;{activity.proTip}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
