"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Star, MapPin, Navigation, Utensils, Ticket, Sparkles } from "lucide-react";

export interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  category?: string;
  mealType?: string;
  rating?: number;
  priceLevel?: string;
  aiInsight?: string;
  address?: string;
  duration?: string;
  proTip?: string;
  travelFromPrevious?: {
    mode: string;
    duration: string;
    distance: string;
  } | null;
  dayNumber?: number;
}

export interface DayInfo {
  dayTitle: string;
  dayNumber: number;
  summary?: string;
}

export function DayOpener({ dayInfo, image }: { dayInfo: DayInfo, image: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div ref={ref} className="relative w-full min-h-[70vh] md:min-h-[85vh] mb-24 md:mb-32 flex flex-col justify-end overflow-hidden group rounded-[2rem]">
      {/* Background Image */}
      <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
        {image ? (
          <img src={image} alt={`Day ${dayInfo.dayNumber}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-8 mb-6">
            <span className="text-[100px] md:text-[180px] leading-[0.8] font-sans font-light italic text-white/90 tracking-tighter drop-shadow-2xl mix-blend-overlay">
              {String(dayInfo.dayNumber).padStart(2, '0')}
            </span>
            <div className="pb-2 md:pb-8">
              <span className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-orange-400 block mb-3">
                Chapter
              </span>
              <h2 className="text-3xl md:text-5xl font-sans text-white tracking-tight leading-tight max-w-xl">
                {dayInfo.dayTitle}
              </h2>
            </div>
          </div>
          {dayInfo.summary && (
            <div className="max-w-2xl md:ml-12 pl-6 border-l border-orange-500/30">
              <p className="text-lg md:text-xl font-light text-zinc-300 leading-relaxed italic" style={{ fontFamily: 'var(--font-sans)' }}>
                "{dayInfo.summary}"
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

interface SceneProps {
  activity: Activity;
  index: number;
  onInView: (index: number | null) => void;
}

interface EditorialSceneProps extends SceneProps {
  align?: "left" | "right" | "wide";
  isLast?: boolean;
}

export function EditorialActivityScene({ activity, index, onInView, align = "left", isLast = false }: EditorialSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onInView(index);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onInView]);

  const travel = activity.travelFromPrevious;
  const modeLower = travel?.mode.toLowerCase() || "";
  const modeEmojis: Record<string, string> = {
    walk: "🚶", car: "🚗", taxi: "🚕", transit: "🚇", bus: "🚌", train: "🚆", flight: "✈️", bike: "🚲", boat: "⛴️"
  };
  const travelEmoji = Object.entries(modeEmojis).find(([key]) => modeLower.includes(key))?.[1] || "🧭";

  return (
    <div ref={ref} className="relative flex mb-16 md:mb-24 group">
      
      {/* ── Continuous Timeline ── */}
      <div className="hidden md:flex flex-col items-center mr-10 relative z-10 w-12 shrink-0">
        <div className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shadow-xl z-20">
          <Clock className="w-5 h-5 text-zinc-500 group-hover:text-orange-400 transition-colors duration-500" />
        </div>
        
        {!isLast && (
          <div className="flex-1 w-px bg-gradient-to-b from-white/10 via-white/5 to-white/10 my-4 relative">
             {travel && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-black py-4">
                 <span className="text-xl mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{travelEmoji}</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                   {travel.duration}
                 </span>
               </div>
             )}
          </div>
        )}
      </div>

      {/* ── Content Block ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pb-10"
      >
        <div className="flex items-center gap-4 mb-6 md:hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              {activity.timeOfDay}
            </span>
            <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Asymmetrical Layout Logic */}
        <div className={`flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} ${align === 'wide' ? 'md:flex-col' : ''} gap-8 md:gap-12 items-start`}>
          
          {/* Image */}
          <div className={`w-full ${align === 'wide' ? 'aspect-[21/9] md:h-[500px]' : 'md:w-1/2 aspect-[4/5]'} rounded-[1.5rem] overflow-hidden relative shadow-2xl group-hover:shadow-orange-500/5 transition-shadow duration-700`}>
            {activity.image ? (
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-zinc-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Typography */}
          <div className={`w-full ${align === 'wide' ? 'md:w-3/4 lg:w-2/3 mx-auto text-center mt-8' : 'md:w-1/2 pt-4'}`}>
            <div className={`flex items-center gap-3 mb-4 ${align === 'wide' ? 'justify-center' : ''}`}>
              <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                {activity.timeOfDay}
              </span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {activity.category || "Highlight"}
              </span>
            </div>

            <h3 className={`text-4xl md:text-5xl lg:text-6xl font-sans text-white mb-6 tracking-tight leading-[1.1] ${align === 'wide' ? 'mx-auto' : ''}`}>
              {activity.title}
            </h3>
            
            <p className={`text-base text-zinc-400 leading-relaxed font-light mb-8 ${align === 'wide' ? 'mx-auto' : ''}`}>
              {activity.description}
            </p>

            <div className={`flex flex-wrap items-center gap-4 ${align === 'wide' ? 'justify-center' : ''}`}>
              {activity.rating && (
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-sm font-bold">{activity.rating.toFixed(1)}</span>
                </div>
              )}
              
              {activity.aiInsight && (
                <div className="flex items-center gap-2 mt-4 w-full border-t border-white/5 pt-4">
                  <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-[13px] font-medium text-orange-200/80 italic leading-snug">
                    "{activity.aiInsight}"
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
