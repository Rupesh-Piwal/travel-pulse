"use client";

import { motion } from "framer-motion";
import { Star, Lightbulb } from "lucide-react";

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

const CATEGORY_EMOJI: Record<string, string> = {
  RESTAURANT: "🍽️", LANDMARK: "🏛️", ACTIVITY: "🎯", HOTEL: "🏨", TRANSPORT: "🚆",
};
const MEAL_EMOJI: Record<string, string> = {
  BREAKFAST: "☕", LUNCH: "🍝", DINNER: "🥂", SNACK: "🧁",
};

const TIME_DOT_COLOR: Record<string, string> = {
  Morning: "bg-amber-400",
  Afternoon: "bg-orange-500",
  Evening: "bg-indigo-500",
};

const TIME_LABEL_COLOR: Record<string, string> = {
  Morning: "text-amber-400",
  Afternoon: "text-orange-400",
  Evening: "text-indigo-400",
};

const TIME_BG_COLOR: Record<string, string> = {
  Morning: "bg-amber-400/10",
  Afternoon: "bg-orange-400/10",
  Evening: "bg-indigo-400/10",
};

export default function HeroActivityCard({ activity }: { activity: Activity }) {
  const mapsUrl = activity.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}`
    : null;
  const cleanTitle = activity.title.includes('(') ? activity.title.split('(')[0].trim() : activity.title;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${cleanTitle}${activity.address ? `, ${activity.address}` : ''}`)}`;
  const emoji = CATEGORY_EMOJI[activity.category || "ACTIVITY"] || "📍";
  const mealEmoji = activity.mealType && activity.mealType !== "NONE" ? MEAL_EMOJI[activity.mealType] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group/hero relative w-full h-[360px] md:h-[420px] rounded-[1.5rem] overflow-hidden bg-zinc-950 border border-white/5 cursor-pointer hover:scale-[1.02] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] transition-all duration-500 mb-6"
    >
      {/* Background Image Layer */}
      {activity.image ? (
        <>
          <img
            src={activity.image}
            alt={activity.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/hero:scale-[1.03] transition-transform duration-1000 ease-out"
          />
          {/* Deep gradient overlay for perfect legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
      )}

      {/* Content Layer */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="space-y-1.5 relative z-10 w-full">
          
          {/* Top inline badge + Subtitle */}
          <div className="flex items-center gap-3 mb-1">
             <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] bg-white text-black px-2.5 py-1 rounded-md shadow-lg">
               Featured Experience ✦
             </span>
             {activity.title.includes('(') && (
               <p className="text-[11px] md:text-[12px] font-medium text-orange-400/90 uppercase tracking-widest truncate">
                 {activity.title.split('(')[1].replace(')', '').trim()}
               </p>
             )}
          </div>

          {/* Title */}
          <a 
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group/title max-w-[95%]"
            title="Get Directions on Google Maps"
          >
            <h3 className="text-3xl md:text-5xl font-sans font-bold text-white leading-tight tracking-tight group-hover/title:text-orange-400 transition-colors duration-300 truncate">
              {cleanTitle}
            </h3>
          </a>

          {/* Description (Truncated to 1 line) */}
          {activity.description && (
            <p className="text-[14px] md:text-[16px] text-zinc-300 font-light truncate max-w-full opacity-80 pt-1">
              {activity.description}
            </p>
          )}

          {/* Inline Meta String */}
          <div className="flex flex-wrap items-center gap-2.5 text-[12px] md:text-[13px] text-zinc-400 font-medium tracking-wide pt-2.5">
            {activity.timeOfDay && <span className="text-zinc-300">{activity.timeOfDay}</span>}
            
            {activity.duration && (
              <>
                {activity.timeOfDay && <span className="opacity-30">•</span>}
                <span>{activity.duration}</span>
              </>
            )}

            {activity.rating && (
              <>
                {(activity.timeOfDay || activity.duration) && <span className="opacity-30">•</span>}
                <span className="flex items-center gap-1 text-amber-400/90">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-amber-400/90" /> {activity.rating.toFixed(1)}
                </span>
              </>
            )}

            {activity.address && mapsUrl && (
              <>
                {(activity.timeOfDay || activity.duration || activity.rating) && <span className="opacity-30">•</span>}
                <span className="truncate max-w-[200px] md:max-w-[300px] hover:text-orange-400 transition-colors">{activity.address}</span>
              </>
            )}

            {activity.priceLevel && (
              <>
                {(activity.timeOfDay || activity.duration || activity.rating || activity.address) && <span className="opacity-30">•</span>}
                <span>{activity.priceLevel}</span>
              </>
            )}
          </div>

          {/* Expert Directive / Highlight (1 line) */}
          {activity.proTip && (
            <div className="pt-2.5">
              <p className="text-[14px] text-orange-300/90 italic truncate flex items-center gap-2">
                <Lightbulb className="w-4 h-4 shrink-0" />
                {activity.proTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
