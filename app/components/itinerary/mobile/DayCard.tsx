import React, { useMemo, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

// Interfaces copied from parent for simplicity
interface TravelFromPrevious {
  mode: string;
  duration: string;
  distance: string;
}

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Lunchtime" | "Afternoon" | "Evening";
  category?: string;
  mealType?: string;
  cuisine?: string;
  rating?: number;
  priceLevel?: string;
  aiInsight?: string;
  address?: string;
  duration?: string;
  proTip?: string;
  travelFromPrevious?: TravelFromPrevious | null;
}

interface Day {
  day: number;
  title: string;
  summary?: string;
  estimatedCost?: string;
  activities: Activity[];
}

interface DayCardProps {
  day: Day;
}

export default function DayCard({ day }: DayCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const groups = useMemo(() => {
    const order = ["Morning", "Lunchtime", "Afternoon", "Evening"];
    const map: Record<string, Activity[]> = {};
    day.activities.forEach((a) => {
      const key = a.timeOfDay;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return Object.entries(map).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
  }, [day.activities]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      {/* Day Header with Accent Line */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-[#C4632C] rounded-full" />
        <h2 className="text-3xl font-semibold font-sans text-zinc-900 tracking-tight">Day {day.day}</h2>
      </div>

      {day.title && (
        <p className="text-xl font-medium text-zinc-800 mb-2 leading-tight px-1">{day.title}</p>
      )}
      {day.summary && (
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed px-1">{day.summary}</p>
      )}

      {/* Image Gallery */}
      <ImageCarousel activities={day.activities} />

      {/* Timeline Content */}
      <div className="mt-8 relative px-1">
        {/* Continuous Timeline Line */}
        <div className="absolute left-[9px] top-2 bottom-4 w-px bg-zinc-200" />

        <div className="space-y-8">
          {groups.map(([timeOfDay, activities], groupIdx) => (
            <div key={timeOfDay} className="relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C4632C] mb-5 pl-8 bg-[#F6F6F7] inline-block relative z-10 py-1">
                {timeOfDay}
              </h3>
              <div className="space-y-6">
                {activities.map((activity, idx) => (
                  <ActivityItem key={idx} activity={activity} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Must-Trys */}
      {day.activities.some((a) => a.proTip) && (
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4632C] block mb-3">Must-Try</span>
          <div className="flex flex-col gap-2">
            {day.activities
              .filter((a) => a.proTip)
              .map((a, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-orange-100/50 shadow-sm">
                  <span className="text-[#C4632C] text-lg leading-none mt-0.5">✦</span>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    <span className="text-zinc-900 font-semibold mr-1">{a.title}:</span>
                    {a.proTip}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estimated Cost */}
      {day.estimatedCost && (
        <div className="mt-6 flex justify-end">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-100 px-3 py-1.5 rounded-full">
            Daily spend: <span className="text-zinc-700">{day.estimatedCost}</span>
          </span>
        </div>
      )}
    </motion.section>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="relative pl-8 group">
      {/* Timeline Dot */}
      <div className="absolute left-[5px] top-[6px] w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-300 group-hover:border-[#C4632C] transition-colors z-10" />

      <h4 className="text-[16px] font-bold text-zinc-900 leading-tight">
        {activity.title}
      </h4>

      {activity.address && (
        <p className="text-[12px] text-zinc-400 mt-0.5">{activity.address}</p>
      )}

      <p className="text-[14px] text-zinc-600 leading-relaxed mt-2">
        {activity.description}
      </p>

      {activity.aiInsight && (
        <div className="mt-3 bg-[#C4632C]/5 border border-[#C4632C]/10 rounded-xl p-3">
          <p className="text-[12px] text-orange-800 leading-relaxed">
            <span className="font-semibold mr-1">💡 Pro Tip:</span>
            {activity.aiInsight}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-[11px] font-medium text-zinc-500">
        {activity.duration && (
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            ⏱ {activity.duration}
          </span>
        )}
        {activity.rating && (
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            <Star className="w-3 h-3 text-[#C4632C] fill-orange-700/30" />
            {activity.rating.toFixed(1)}
          </span>
        )}
        {activity.travelFromPrevious && (
          <span className="flex items-center gap-1 text-zinc-400 border border-zinc-200 border-dotted px-2 py-1 rounded-md">
            → {activity.travelFromPrevious.mode} · {activity.travelFromPrevious.duration}
          </span>
        )}
      </div>
    </div>
  );
}
