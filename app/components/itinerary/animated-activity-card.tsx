"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Star, Lightbulb } from "lucide-react";

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

const TIME_DOT_COLOR: Record<string, string> = {
  Morning: "bg-amber-400",
  Afternoon: "bg-orange-500",
  Evening: "bg-indigo-400",
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

export default function AnimatedActivityCard({ activity, index }: ActivityProps) {
  const mapsUrl = activity.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}` : null;
  const cleanTitle = activity.title.includes('(') ? activity.title.split('(')[0].trim() : activity.title;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${cleanTitle}${activity.address ? `, ${activity.address}` : ''}`)}`;
  const emoji = CATEGORY_EMOJI[activity.category || "ACTIVITY"] || "📍";
  const mealEmoji = activity.mealType && activity.mealType !== "NONE" ? MEAL_EMOJI[activity.mealType] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group/act relative w-full h-[280px] md:h-[320px] rounded-[1.5rem] overflow-hidden bg-zinc-950 border border-white/5 cursor-pointer hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 mb-4"
    >
      {/* Background Image Layer */}
      {activity.image ? (
        <>
          <img
            src={activity.image}
            alt={activity.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/act:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Deep gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
      )}

      {/* Content Layer */}
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
        <div className="space-y-1 relative z-10 w-full">
          
          {/* Subtitle / Context (extracted from parenthesis) */}
          {activity.title.includes('(') && (
            <p className="text-[12px] font-medium text-orange-400/90 uppercase tracking-widest mb-1 truncate">
              {activity.title.split('(')[1].replace(')', '').trim()}
            </p>
          )}

          {/* Title */}
          <a 
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group/title max-w-[95%]"
            title="Get Directions on Google Maps"
          >
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-white leading-tight tracking-tight group-hover/title:text-orange-400 transition-colors duration-300 truncate">
              {cleanTitle}
            </h3>
          </a>

          {/* Description (Truncated to 1 line) */}
          {activity.description && (
            <p className="text-[14px] text-zinc-300 font-light truncate max-w-full opacity-80 pt-0.5">
              {activity.description}
            </p>
          )}

          {/* Inline Meta String */}
          <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-zinc-400 font-medium tracking-wide pt-2">
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
                  <Star className="w-3.5 h-3.5 fill-amber-400/90" /> {activity.rating.toFixed(1)}
                </span>
              </>
            )}

            {activity.address && mapsUrl && (
              <>
                {(activity.timeOfDay || activity.duration || activity.rating) && <span className="opacity-30">•</span>}
                <span className="truncate max-w-[150px] md:max-w-[200px] hover:text-orange-400 transition-colors">{activity.address}</span>
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
            <div className="pt-2">
              <p className="text-[13px] text-orange-300/90 italic truncate flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                {activity.proTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
