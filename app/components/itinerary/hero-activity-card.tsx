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
      className="group/hero relative overflow-hidden rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 mb-8"
    >
      {/* ──── Large full-width image ──── */}
      {activity.image && (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover/hero:scale-[1.08] transition-transform duration-[4s] ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* "Featured Experience" editorial badge */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="px-5 py-2.5 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl">
              Featured Experience ✦
            </div>
          </div>

          {/* Rating + Price top-right */}
          {(activity.rating || activity.priceLevel) && (
            <div className="absolute top-8 right-8 flex items-center gap-3">
              {activity.rating && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-black">{activity.rating.toFixed(1)}</span>
                </div>
              )}
              {activity.priceLevel && (
                <div className="px-4 py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 text-white text-[13px] font-black tracking-widest">
                  {activity.priceLevel}
                </div>
              )}
            </div>
          )}

          {/* Bottom info bar on image */}
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-2xl">
                    {emoji}
                 </div>
                 {mealEmoji && (
                    <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-2xl uppercase font-black text-[10px] text-white tracking-widest pl-3 pr-4 flex items-center gap-2">
                      {mealEmoji} {activity.mealType}
                    </div>
                 )}
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight max-w-2xl">
                {activity.title}
              </h3>
            </div>

            {/* Time + Duration pill */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white/95 rounded-2xl shadow-2xl">
              <div className={`w-2.5 h-2.5 rounded-full ${
                activity.timeOfDay === "Morning" ? "bg-amber-400" :
                activity.timeOfDay === "Afternoon" ? "bg-orange-500" : "bg-indigo-400"
              }`} />
              <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">{activity.timeOfDay}</span>
              {activity.duration && (
                <>
                  <div className="w-px h-3 bg-zinc-200" />
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{activity.duration}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──── Content area ──── */}
      <div className="p-10 md:p-12 space-y-6">

        {!activity.image && (
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 rounded-2xl text-3xl">
                {emoji}
              </div>
              <div className="px-5 py-2 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl">
                Featured Experience ✦
              </div>
            </div>
            {activity.rating && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-[14px] font-black text-zinc-900">{activity.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        {!activity.image && (
          <h3 className="text-4xl md:text-5xl font-black text-zinc-950 leading-[0.95] tracking-tight">
            {activity.title}
          </h3>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <p className="text-[16px] text-zinc-500 leading-[1.8] font-light max-w-2xl">
              {activity.description}
            </p>

            {activity.address && mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-zinc-400 hover:text-orange-600 transition-all duration-300 group/addr"
              >
                <div className="p-2 rounded-xl bg-zinc-50 group-hover/addr:bg-orange-50 transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 group-hover/addr:text-orange-600" />
                </div>
                <span className="text-[14px] font-medium tracking-tight">{activity.address}</span>
              </a>
            )}
          </div>

          {/* Pro Tip - Moved to side for better Advenzo spacing */}
          {activity.proTip && (
            <div className="w-full md:w-72 p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 self-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Lightbulb className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Expert Tip</span>
              </div>
              <p className="text-[14px] text-zinc-700 font-medium leading-relaxed italic">&ldquo;{activity.proTip}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </motion.article>

  );
}
