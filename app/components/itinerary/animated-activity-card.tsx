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
  Evening: "bg-indigo-500",
};

const TIME_LABEL_COLOR: Record<string, string> = {
  Morning: "text-amber-600",
  Afternoon: "text-orange-600",
  Evening: "text-indigo-600",
};

const TIME_BG_COLOR: Record<string, string> = {
  Morning: "bg-amber-50",
  Afternoon: "bg-orange-50",
  Evening: "bg-indigo-50",
};

export default function AnimatedActivityCard({ activity, index }: ActivityProps) {
  const mapsUrl = activity.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}` : null;
  const emoji = CATEGORY_EMOJI[activity.category || "ACTIVITY"] || "📍";
  const mealEmoji = activity.mealType && activity.mealType !== "NONE" ? MEAL_EMOJI[activity.mealType] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group/act relative"
    >
      <div className="overflow-hidden rounded-[2rem] bg-white border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">

        {/* ──── TALL Immersive Photo ──── */}
        {activity.image && (
          <div className="relative w-full aspect-[3/4] max-h-[520px] overflow-hidden">
            <img
              src={activity.image}
              alt={activity.title}
              className="absolute inset-0 w-full h-full object-cover group-hover/act:scale-[1.04] transition-transform duration-[3s] ease-out"
            />
            {/* Gradient overlay for bottom content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Floating badge row on image */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/15 rounded-xl border border-white/20 text-xl">
                  {emoji}
                </div>
                {mealEmoji && (
                  <div className="p-2 bg-white/15 rounded-xl border border-white/20 text-lg">
                    {mealEmoji}
                  </div>
                )}
              </div>
              {activity.rating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl border border-white/20 text-white">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[12px] font-black">{activity.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── Content Panel ──── */}
        <div className="p-8 md:p-10 space-y-5">

          {/* Time of Day — Colored System */}
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${TIME_DOT_COLOR[activity.timeOfDay] || "bg-zinc-300"}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${TIME_LABEL_COLOR[activity.timeOfDay] || "text-zinc-400"} ${TIME_BG_COLOR[activity.timeOfDay] || "bg-zinc-50"} px-3 py-1 rounded-lg`}>
              {activity.timeOfDay}
            </span>
            {activity.duration && (
              <>
                <div className="w-1 h-1 rounded-full bg-zinc-200" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">{activity.duration}</span>
                </div>
              </>
            )}
          </div>

          {/* Title & Subtitle — Large Fraunces Serif (Dominant) */}
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-serif text-zinc-950 leading-[1.1] tracking-tight">
              {activity.title.includes('(') ? activity.title.split('(')[0].trim() : activity.title}
            </h3>
            {activity.title.includes('(') && (
              <p className="text-[13px] font-medium text-[#C4632C] uppercase tracking-[0.2em] font-sans italic opacity-80">
                {activity.title.split('(')[1].replace(')', '').trim()}
              </p>
            )}
          </div>

          {/* Description — DM Sans, readable weight */}
          <p className="text-[15px] text-zinc-500 leading-[1.85] font-normal max-w-xl">
            {activity.description}
          </p>

          {/* Metadata Row: Address + Price (small, muted, secondary) */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-100">
            {activity.address && mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-600 transition-all duration-300"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[12px] font-medium tracking-tight truncate max-w-[200px]">{activity.address}</span>
              </a>
            )}
            {activity.priceLevel && (
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">{activity.priceLevel}</span>
            )}
          </div>

          {/* ──── Insider Tip — Premium Pull Quote ──── */}
          {activity.proTip && (
            <div className="relative mt-4 pl-6 py-5 pr-6 bg-[#FDF8F4] rounded-xl border-l-[3px] border-[#C4632C]">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#C4632C]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4632C]">Insider Tip</span>
              </div>
              <p className="text-[15px] text-zinc-700 font-medium italic leading-relaxed">
                &ldquo;{activity.proTip}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
