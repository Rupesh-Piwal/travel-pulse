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

const CATEGORY_EMOJI: Record<string, string> = {
  RESTAURANT: "🍽️", LANDMARK: "🏛️", ACTIVITY: "🎯", HOTEL: "🏨", TRANSPORT: "🚆",
};
const MEAL_EMOJI: Record<string, string> = {
  BREAKFAST: "☕", LUNCH: "🍝", DINNER: "🥂", SNACK: "🧁",
};

export default function HeroActivityCard({ activity }: { activity: Activity }) {
  const mapsUrl = activity.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}`
    : null;
  const emoji = CATEGORY_EMOJI[activity.category || "ACTIVITY"] || "📍";
  const mealEmoji = activity.mealType && activity.mealType !== "NONE" ? MEAL_EMOJI[activity.mealType] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group/hero relative overflow-hidden rounded-[2rem] bg-white border border-zinc-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 mb-6"
    >
      {/* ──── Large full-width image ──── */}
      {activity.image && (
        <div className="relative w-full h-[360px] md:h-[460px] overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover/hero:scale-[1.04] transition-transform duration-[4s] ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* "First Stop" editorial badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="px-4 py-2 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl shadow-lg">
              First Stop ✦
            </div>
          </div>

          {/* Rating + Price top-right */}
          {(activity.rating || activity.priceLevel) && (
            <div className="absolute top-6 right-6 flex items-center gap-2">
              {activity.rating && (
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-black/30 backdrop-blur-xl rounded-xl text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-bold">{activity.rating.toFixed(1)}</span>
                </div>
              )}
              {activity.priceLevel && (
                <div className="px-3.5 py-2 bg-black/30 backdrop-blur-xl rounded-xl text-white text-[13px] font-bold">
                  {activity.priceLevel}
                </div>
              )}
            </div>
          )}

          {/* Bottom info bar on image */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-3">
              {/* Category + Meal */}
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-lg">{emoji}</span>
                {mealEmoji && <span className="text-xl drop-shadow-lg">{mealEmoji}</span>}
              </div>
              {/* Title on image */}
              <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight tracking-tight drop-shadow-xl max-w-xl">
                {activity.title}
              </h3>
            </div>

            {/* Time + Duration pill */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/20">
              <div className={`w-2 h-2 rounded-full ${
                activity.timeOfDay === "Morning" ? "bg-amber-400" :
                activity.timeOfDay === "Afternoon" ? "bg-orange-500" : "bg-indigo-400"
              }`} />
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">{activity.timeOfDay}</span>
              {activity.duration && (
                <>
                  <div className="w-px h-3 bg-white/30" />
                  <Clock className="w-3 h-3 text-white/60" />
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">{activity.duration}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──── Content area ──── */}
      <div className="p-8 md:p-10 space-y-5">

        {/* No-image fallback title */}
        {!activity.image && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{emoji}</span>
              <div className="px-4 py-1.5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl">
                First Stop ✦
              </div>
            </div>
            {activity.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-[14px] font-bold text-zinc-700">{activity.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        {!activity.image && (
          <h3 className="text-3xl md:text-4xl font-serif text-zinc-950 leading-tight tracking-tight">
            {activity.title}
          </h3>
        )}

        {/* Description */}
        <p className="text-[14px] text-zinc-500 leading-[1.9] font-light max-w-2xl">
          {activity.description}
        </p>

        {/* Address */}
        {activity.address && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-600 transition-colors duration-300 group/addr"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[13px]">{activity.address}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
          </a>
        )}

        {/* Pro Tip */}
        {activity.proTip && (
          <div className="flex gap-4 p-5 bg-gradient-to-r from-amber-50/60 to-orange-50/30 rounded-2xl border border-orange-100/50 mt-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-[13px] text-zinc-600 italic leading-relaxed">&ldquo;{activity.proTip}&rdquo;</p>
          </div>
        )}
      </div>
    </motion.article>
  );
}
