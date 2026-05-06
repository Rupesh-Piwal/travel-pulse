import React from "react";

export default function SkeletonGallery() {
  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="min-w-[85%] sm:min-w-[300px] aspect-video rounded-[20px] bg-zinc-200 animate-pulse snap-center shrink-0"
        />
      ))}
    </div>
  );
}
