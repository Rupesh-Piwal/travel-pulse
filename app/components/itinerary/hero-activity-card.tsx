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
      className="group/hero relative overflow-hidden rounded-[2rem] bg-white border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 mb-4"
    >
      {/* ──── Cinematic Full-Width Image ──── */}
      {activity.image && (
        <div className="relative w-full aspect-[4/5] max-h-[600px] overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover/hero:scale-[1.05] transition-transform duration-[4s] ease-out"
          />
          {/* Deep gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* "Featured Experience" editorial badge */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="px-5 py-2.5 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl">
              Featured Experience ✦
            </div>
          </div>

          {/* Rating + Price top-right */}
          {(activity.rating || activity.priceLevel) && (
            <div className="absolute top-8 right-8 flex items-center gap-3">
              {activity.rating && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-black">{activity.rating.toFixed(1)}</span>
                </div>
              )}
              {activity.priceLevel && (
                <div className="px-4 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white text-[13px] font-black tracking-widest">
                  {activity.priceLevel}
                </div>
              )}
            </div>
          )}

          {/* Bottom info bar on image */}
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl border border-white/20 text-2xl">
                  {emoji}
                </div>
                {mealEmoji && (
                  <div className="p-2.5 bg-white/15 rounded-xl border border-white/20 text-xl uppercase font-black text-[10px] text-white tracking-widest pl-3 pr-4 flex items-center gap-2">
                    {mealEmoji} {activity.mealType}
                  </div>
                )}
              </div>
              {/* Title over the image — Fraunces Serif, evocative */}
              {/* Title over the image — Fraunces Serif, evocative */}
              <div className="space-y-1">
                <h3 className="text-4xl md:text-6xl font-serif text-white leading-[1] tracking-tight max-w-4xl text-shadow-premium-black">
                  {activity.title.includes('(') ? activity.title.split('(')[0].trim() : activity.title}
                </h3>
                {activity.title.includes('(') && (
                  <p className="text-sm md:text-base font-medium text-orange-400 uppercase tracking-[0.3em] font-sans italic opacity-90 text-shadow-premium-black">
                    {activity.title.split('(')[1].replace(')', '').trim()}
                  </p>
                )}
              </div>
            </div>

            {/* Time + Duration */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white/95 rounded-2xl shadow-2xl shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${TIME_DOT_COLOR[activity.timeOfDay] || "bg-zinc-300"}`} />
              <span className={`text-[11px] font-black uppercase tracking-widest ${TIME_LABEL_COLOR[activity.timeOfDay] || "text-zinc-500"}`}>{activity.timeOfDay}</span>
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
      <div className="p-8 md:p-10 space-y-6">

        {/* Fallback title if no image */}
        {!activity.image && (
          <div className="space-y-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-100 rounded-2xl text-3xl">{emoji}</div>
              <div className="px-5 py-2 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl">
                Featured Experience ✦
              </div>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-zinc-950 leading-[1] tracking-tight">
              {activity.title}
            </h3>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-5">
            {/* Description — readable, breathable */}
            <p className="text-[16px] text-zinc-500 leading-[1.85] font-normal max-w-2xl">
              {activity.description}
            </p>

            {/* Address — small, secondary */}
            {activity.address && mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-zinc-400 hover:text-orange-600 transition-all duration-300 group/addr"
              >
                <div className="p-1.5 rounded-lg bg-zinc-50 group-hover/addr:bg-orange-50 transition-colors">
                  <MapPin className="w-3.5 h-3.5 shrink-0 group-hover/addr:text-orange-600" />
                </div>
                <span className="text-[13px] font-medium tracking-tight">{activity.address}</span>
              </a>
            )}
          </div>

          {/* ──── Insider Tip — Premium Pull Quote ──── */}
          {activity.proTip && (
            <div className="w-full md:w-80 relative pl-6 py-6 pr-6 bg-[#FDF8F4] rounded-xl border-l-[3px] border-[#C4632C] self-start">
              <div className="flex items-center gap-2.5 mb-3">
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
