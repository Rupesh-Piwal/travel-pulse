import React, { useState } from "react";
import { Star } from "lucide-react";
import SkeletonGallery from "./SkeletonGallery";
import { motion } from "framer-motion";

interface Activity {
  title: string;
  image: any | null;
  rating?: number;
  category?: string;
}

interface ImageCarouselProps {
  activities: Activity[];
}

export default function ImageCarousel({ activities }: ImageCarouselProps) {
  const images = activities.filter((a) => a.image);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  if (images.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6">
      {images.map((activity, idx) => (
        <div key={idx} className="w-[85%] sm:w-[300px] snap-center shrink-0 group relative">
          <div className="aspect-video rounded-[20px] overflow-hidden bg-zinc-100 relative">
            {!loadedImages[idx] && (
              <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
            )}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: loadedImages[idx] ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              src={typeof activity.image === 'string' ? activity.image : activity.image?.url}
              alt={activity.title}
              onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
              className="w-full h-full object-cover aspect-video"
              loading="lazy"
            />
            {/* Gradient overlay for text readability if we want it, but let's keep text outside for cleaner look */}
          </div>

          <div className="mt-3 px-1">
            <h4 className="text-[15px] font-semibold text-zinc-900 truncate">{activity.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              {activity.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#C4632C] fill-orange-700/30" />
                  <span className="text-xs font-semibold text-zinc-700">{activity.rating.toFixed(1)}</span>
                </div>
              )}
              {activity.category && (
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{activity.category}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
